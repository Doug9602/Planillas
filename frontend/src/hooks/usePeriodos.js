// hooks/usePeriodos.js

import { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { manejarError } from "../utils/errorHandler";
import { toast } from "react-hot-toast";
import { confirmarAccion } from "../utils/alerts";

export function usePeriodos() {
  const [periodos, setPeriodos] = useState([]);
  const [nuevoPeriodo, setNuevoPeriodo] = useState({
    mes: "",
    año: new Date().getFullYear(),  // ✅ Agregado año por defecto
    fecha_corte: "",
    descripcion: ""
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

    // Validación: debe tener fecha_corte
    if (!nuevoPeriodo.fecha_corte) {
      toast.error("La fecha de corte es obligatoria");
      return;
    }

    // Extraer mes y año de la fecha de corte
    const fecha = new Date(nuevoPeriodo.fecha_corte);
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();

    // Construir objeto a enviar al backend
    const datosEnviar = {
      mes: mes,
      año: año,
      fecha_corte: nuevoPeriodo.fecha_corte,
      total_general: nuevoPeriodo.total_general || 0,
      descripcion: nuevoPeriodo.descripcion || ""
    };

    try {
      const res = await fetch(`${API_URL}/periodo/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEnviar),
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
    if (!nuevoPeriodo.fecha_corte) {
      toast.error("La fecha de corte es obligatoria");
      return;
    }
    const fecha = new Date(nuevoPeriodo.fecha_corte);
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();

    const datosEnviar = {
      mes: mes,
      año: año,
      fecha_corte: nuevoPeriodo.fecha_corte,
      total_general: nuevoPeriodo.total_general || 0,
      descripcion: nuevoPeriodo.descripcion || ""
    };

    try {
      const res = await fetch(`${API_URL}/periodo/${periodoEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEnviar),
      });
      if (res.ok) {
        const data = await res.json();
        const nuevosPeriodos = periodos.map((per) =>
          per.id === periodoEditandoId ? data : per
        );
        nuevosPeriodos.sort((a, b) => new Date(a.fecha_corte) - new Date(b.fecha_corte));
        setPeriodos(nuevosPeriodos);
        limpiarFormularioPeriodo();
        toast.success("Período actualizado exitosamente");
      } else {
        const error = await res.json();
        console.error("❌ Error del backend:", error);
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
    let fechaCorte = per.fecha_corte;
    if (fechaCorte && fechaCorte.includes('/')) {
      const partes = fechaCorte.split('/');
      fechaCorte = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }
    
    // Extraer mes y año de la fecha_corte
    const fecha = new Date(per.fecha_corte);
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    
    setNuevoPeriodo({
      mes: mes,
      año: año,
      fecha_corte: per.fecha_corte,
      descripcion: per.descripcion || ""
    });
    setPeriodoCargado(true);
    setPeriodoEditandoId(per.id);
  };

  const limpiarFormularioPeriodo = () => {
    setNuevoPeriodo({
      mes: "",
      año: new Date().getFullYear(),  // ✅ Año por defecto al limpiar
      fecha_corte: "",
      descripcion: ""
    });
    setPeriodoCargado(false);
    setPeriodoEditandoId(null);
  };

  const generarProximoPeriodo = () => {
    if (periodos.length === 0) {
      setNuevoPeriodo({
        mes: 1,
        año: 2026,
        fecha_corte: "2026-01-31",
        descripcion: ""
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
      descripcion: ""
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