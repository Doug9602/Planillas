import { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { toast } from "react-hot-toast";
import { confirmarAccion } from "../utils/alerts";
import { manejarError } from "../utils/errorHandler";

export function usePlanillas(empleados = []) {
  const safeEmpleados = Array.isArray(empleados) ? empleados : [];

  const [planillas, setPlanillas] = useState([]);
  const [nuevaPlanilla, setNuevaPlanilla] = useState({
    periodo_id: "",
    empleado_id: "",
    sueldo_base: 0,
    horas_extras_diurnas: 0,
    horas_extras_nocturnas: 0,
    horas_nocturnas: 0,
    subsidio_alimentacion: 0,
    bono_extra: 0,
    quincena25_aplica: false,
    descuentos_adicionales: 0  // <--- NUEVO
  });
  const [planillaCargado, setPlanillaCargado] = useState(false);
  const [planillaEditandoId, setPlanillaEditandoId] = useState(null);
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [planillaSeleccionada, setPlanillaSeleccionada] = useState(null);

  // Cargar planillas al inicio
  useEffect(() => {
    const cargarPlanillas = async () => {
      try {
        const res = await fetch(`${API_URL}/planilla`);
        if (res.ok) {
          const data = await res.json();
          setPlanillas(data);
        } else {
          toast.error("Error al cargar planillas");
        }
      } catch (error) {
        console.error("Error cargando planillas:", error);
        toast.error("No se pudieron cargar las planillas");
      }
    };
    cargarPlanillas();
  }, []);

  // Auto-llenar sueldo_base al seleccionar empleado
  useEffect(() => {
    if (nuevaPlanilla.empleado_id && safeEmpleados.length > 0) {
      const empleado = safeEmpleados.find(emp => emp.id === parseInt(nuevaPlanilla.empleado_id));
      if (empleado && empleado.salario_mensual) {
        setNuevaPlanilla(prev => ({
          ...prev,
          sueldo_base: empleado.salario_mensual
        }));
      }
    }
  }, [nuevaPlanilla.empleado_id, safeEmpleados]);

  // Crear planilla
  const crearPlanilla = async (e) => {
    e.preventDefault();
    if (!nuevaPlanilla.periodo_id || !nuevaPlanilla.empleado_id) {
      toast.error("Selecciona período y empleado");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/planilla/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periodo_id: parseInt(nuevaPlanilla.periodo_id),
          empleado_id: parseInt(nuevaPlanilla.empleado_id),
          sueldo_base: nuevaPlanilla.sueldo_base,
          horas_extras_diurnas: nuevaPlanilla.horas_extras_diurnas,
          horas_extras_nocturnas: nuevaPlanilla.horas_extras_nocturnas,
          horas_nocturnas: nuevaPlanilla.horas_nocturnas,
          subsidio_alimentacion: nuevaPlanilla.subsidio_alimentacion,
          bono_extra: nuevaPlanilla.bono_extra,
          quincena25_aplica: nuevaPlanilla.quincena25_aplica,
          descuentos_adicionales: nuevaPlanilla.descuentos_adicionales || 0  // <--- NUEVO
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlanillas([...planillas, data]);
        limpiarFormularioPlanilla();
        toast.success("Planilla registrada exitosamente");
      } else {
        const error = await res.json();
        toast.error(manejarError(error) || "Error al crear planilla");
      }
    } catch (error) {
      console.error("Error al crear planilla:", error);
      toast.error("Error de conexión con el backend");
    }
  };

  // Actualizar planilla
  const actualizarPlanilla = async (e) => {
    e.preventDefault();
    if (!nuevaPlanilla.periodo_id || !nuevaPlanilla.empleado_id) {
      toast.error("Selecciona período y empleado");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/planilla/${planillaEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periodo_id: parseInt(nuevaPlanilla.periodo_id),
          empleado_id: parseInt(nuevaPlanilla.empleado_id),
          sueldo_base: nuevaPlanilla.sueldo_base,
          horas_extras_diurnas: nuevaPlanilla.horas_extras_diurnas,
          horas_extras_nocturnas: nuevaPlanilla.horas_extras_nocturnas,
          horas_nocturnas: nuevaPlanilla.horas_nocturnas,
          subsidio_alimentacion: nuevaPlanilla.subsidio_alimentacion,
          bono_extra: nuevaPlanilla.bono_extra,
          quincena25_aplica: nuevaPlanilla.quincena25_aplica,
          descuentos_adicionales: nuevaPlanilla.descuentos_adicionales || 0  // <--- NUEVO
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlanillas(planillas.map(p => p.id === data.id ? data : p));
        limpiarFormularioPlanilla();
        toast.success("Planilla actualizada exitosamente");
      } else {
        const error = await res.json();
        toast.error(manejarError(error) || "Error al actualizar");
      }
    } catch (error) {
      console.error("Error al actualizar planilla:", error);
      toast.error("Error de conexión con el backend");
    }
  };

  // Eliminar planilla
  const eliminarPlanilla = async (id) => {
    const confirmado = await confirmarAccion(
      "¿Seguro que deseas eliminar esta planilla?",
      "Los cálculos asociados a este empleado en este período se perderán."
    );
    if (!confirmado) return;

    try {
      const res = await fetch(`${API_URL}/planilla/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlanillas(planillas.filter(p => p.id !== id));
        toast.success("Planilla eliminada");
      } else {
        const error = await res.json();
        toast.error(manejarError(error) || "Error al eliminar");
      }
    } catch (error) {
      console.error("Error al eliminar planilla:", error);
      toast.error("Error de conexión con el servidor");
    }
  };

  // Ver detalle de una planilla
  const verDetalle = (p) => {
    setPlanillaSeleccionada(p);
    setVistaDetalle(true);
  };

  const volverAListado = () => {
    setPlanillaSeleccionada(null);
    setVistaDetalle(false);
  };

  // Cargar datos al formulario para edición (INCLUYE descuentos_adicionales)
  const cargarPlanilla = (p) => {
    setNuevaPlanilla({
      periodo_id: p.periodo_id,
      empleado_id: p.empleado_id,
      sueldo_base: p.sueldo_base || 0,
      horas_extras_diurnas: p.horas_extras_diurnas || 0,
      horas_extras_nocturnas: p.horas_extras_nocturnas || 0,
      horas_nocturnas: p.horas_nocturnas || 0,
      subsidio_alimentacion: p.subsidio_alimentacion || 0,
      bono_extra: p.bono_extra || 0,
      quincena25_aplica: p.quincena25_aplica || false,
      descuentos_adicionales: p.descuentos_adicionales || 0   // <--- NUEVO
    });
    setPlanillaCargado(true);
    setPlanillaEditandoId(p.id);
  };

  const limpiarFormularioPlanilla = () => {
    setNuevaPlanilla({
      periodo_id: "",
      empleado_id: "",
      sueldo_base: 0,
      horas_extras_diurnas: 0,
      horas_extras_nocturnas: 0,
      horas_nocturnas: 0,
      subsidio_alimentacion: 0,
      bono_extra: 0,
      quincena25_aplica: false,
      descuentos_adicionales: 0   // <--- NUEVO
    });
    setPlanillaCargado(false);
    setPlanillaEditandoId(null);
  };

  return {
    planillas,
    nuevaPlanilla,
    setNuevaPlanilla,
    planillaCargado,
    planillaEditandoId,
    vistaDetalle,
    planillaSeleccionada,
    crearPlanilla,
    actualizarPlanilla,
    eliminarPlanilla,
    cargarPlanilla,
    limpiarFormularioPlanilla,
    verDetalle,
    volverAListado
  };
}