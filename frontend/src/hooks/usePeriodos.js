import { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { manejarError } from "../utils/errorHandler";
import { toast } from "react-hot-toast";
import { confirmarAccion } from "../utils/alerts";

export function usePeriodos() {
  const [periodos, setPeriodos] = useState([]);
  const [nuevoPeriodo, setNuevoPeriodo] = useState({
    mes: 1,
    año: 2026,
    fecha_corte: "",
    total_general: 0
  });
  const [periodoCargado, setPeriodoCargado] = useState(false);
  const [periodoEditandoId, setPeriodoEditandoId] = useState(null);

  // Cargar periodos al iniciar
  useEffect(() => {
    const cargarPeriodos = async () => {
      try {
        const res = await fetch(`${API_URL}/periodo`);
        if (res.ok) {
          const data = await res.json();
          data.sort((a, b) => new Date(a.fecha_corte) - new Date(b.fecha_corte));
          setPeriodos(data);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("No se pudieron cargar los períodos");
      }
    };
    cargarPeriodos();
  }, []);

  const crearPeriodo = async (e) => {
    e.preventDefault();

    // Validación simple de campos
    if (!nuevoPeriodo.mes || !nuevoPeriodo.año || !nuevoPeriodo.fecha_corte) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/periodo/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPeriodo),
      });
      if (res.ok) {
        const data = await res.json();
        const nuevosPeriodos = [...periodos, data];
        nuevosPeriodos.sort((a, b) => new Date(a.fecha_corte) - new Date(b.fecha_corte));
        setPeriodos(nuevosPeriodos);
        limpiarFormularioPeriodo();
        toast.success("Período creado exitosamente");
      } else {
        const error = await res.json();
        const mensaje = manejarError(error);
        toast.error(`Error: ${mensaje}`);
      }
    } catch (error) {
      console.error("Error al crear periodo:", error);
      toast.error("Error de conexión con el backend");
    }
  };

  const actualizarPeriodo = async (e) => {
    e.preventDefault();

    if (!nuevoPeriodo.mes || !nuevoPeriodo.año || !nuevoPeriodo.fecha_corte) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/periodo/${periodoEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPeriodo),
      });
      if (res.ok) {
        const data = await res.json();
        setPeriodos(periodos.map(p => p.id === data.id ? data : p));
        limpiarFormularioPeriodo();
        toast.success("Período actualizado exitosamente");
      } else {
        const error = await res.json();
        const mensaje = manejarError(error);
        toast.error(`Error: ${mensaje}`);
      }
    } catch (error) {
      console.error("Error al actualizar periodo:", error);
      toast.error("Error de conexión con el backend");
    }
  };

  const eliminarPeriodo = async (id) => {
    const confirmado = await confirmarAccion(
      "¿Seguro que deseas eliminar este período?",
      "Si tiene planillas asociadas, no se podrá eliminar."
    );
    if (!confirmado) return;

    try {
      const res = await fetch(`${API_URL}/periodo/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPeriodos(periodos.filter(per => per.id !== id));
        toast.success("Período eliminado exitosamente");
      } else {
        const error = await res.json();
        const mensaje = manejarError(error);
        toast.error(`Error: ${mensaje}`);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error de conexión al intentar eliminar");
    }
  };

  const cargarPeriodo = (per) => {
    setNuevoPeriodo({
      mes: per.mes,
      año: per.año,
      fecha_corte: per.fecha_corte,
      total_general: per.total_general || 0
    });
    setPeriodoCargado(true);
    setPeriodoEditandoId(per.id);
  };

  const limpiarFormularioPeriodo = () => {
    setNuevoPeriodo({ mes: 1, año: 2026, fecha_corte: "", total_general: 0 });
    setPeriodoCargado(false);
    setPeriodoEditandoId(null);
  };

  const generarProximoPeriodo = () => {
    if (periodos.length === 0) {
      setNuevoPeriodo({
        mes: 1,
        año: 2026,
        fecha_corte: "2026-01-31",
        total_general: 0
      });
      toast.info("Se ha cargado el período inicial (enero 2026)");
      return;
    }

    const ultimo = periodos.reduce((a, b) => a.fecha_corte > b.fecha_corte ? a : b);
    const fecha = new Date(ultimo.fecha_corte);
    let mes = fecha.getMonth() + 2;
    let año = fecha.getFullYear();
    if (mes > 12) {
      mes = 1;
      año += 1;
    }
    const ultimoDia = new Date(año, mes, 0).getDate();
    const fechaCorte = `${año}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;

    setNuevoPeriodo({
      mes: mes,
      año: año,
      fecha_corte: fechaCorte,
      total_general: 0
    });
    setPeriodoCargado(false);
    setPeriodoEditandoId(null);
    toast.success("Próximo período generado en el formulario");
  };

  return {
    periodos,
    nuevoPeriodo,
    setNuevoPeriodo,
    periodoCargado,
    periodoEditandoId,
    crearPeriodo,
    actualizarPeriodo,
    eliminarPeriodo,
    cargarPeriodo,
    limpiarFormularioPeriodo,
    generarProximoPeriodo
  };
}