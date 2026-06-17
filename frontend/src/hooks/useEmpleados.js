import { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { manejarError } from "../utils/errorHandler";
import { toast } from "react-hot-toast";
import { confirmarAccion } from "../utils/alerts";

export function useEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    dui: "",
    area: "",
    puesto: "",
    salario_mensual: 0,
    fecha_ingreso: ""
  });
  const [empleadoCargado, setEmpleadoCargado] = useState(false);
  const [empleadoEditandoId, setEmpleadoEditandoId] = useState(null);
  const [filtroEmpleados, setFiltroEmpleados] = useState("");

  // Cargar empleados al iniciar
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const res = await fetch(`${API_URL}/empleado`);
        if (res.ok) {
          const data = await res.json();
          setEmpleados(data);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("No se pudieron cargar los empleados");
      }
    };
    cargarEmpleados();
  }, []);

  const crearEmpleado = async (e) => {
    e.preventDefault();
    const duiRegex = /^\d{8}-\d{1}$/;
    if (!duiRegex.test(nuevoEmpleado.dui)) {
      toast.error("El DUI debe tener el formato ########-# (8 dígitos, guion y 1 dígito)");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/empleado/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEmpleado),
      });
      if (res.ok) {
        const data = await res.json();
        setEmpleados([...empleados, data]);
        limpiarFormularioEmpleado();
        toast.success("Empleado creado exitosamente");
      } else {
        const error = await res.json();
        const mensaje = manejarError(error);
        toast.error(`Error: ${mensaje}`);
      }
    } catch (error) {
      console.error("Error al crear empleado:", error);
      toast.error("Error de conexión con el backend");
    }
  };

  const actualizarEmpleado = async (e) => {
    e.preventDefault();
    const duiRegex = /^\d{8}-\d{1}$/;
    if (!duiRegex.test(nuevoEmpleado.dui)) {
      toast.error("El DUI debe tener el formato ########-# (8 dígitos, guion y 1 dígito)");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/empleado/${empleadoEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEmpleado),
      });
      if (res.ok) {
        const data = await res.json();
        setEmpleados(empleados.map(emp => emp.id === data.id ? data : emp));
        limpiarFormularioEmpleado();
        toast.success("Empleado actualizado exitosamente");
      } else {
        const error = await res.json();
        const mensaje = manejarError(error);
        toast.error(`Error: ${mensaje}`);
      }
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      toast.error("Error de conexión con el backend");
    }
  };

  const eliminarEmpleado = async (id) => {
    // Reemplazo de window.confirm usando await y la utilidad centralizada
    const confirmado = await confirmarAccion(
      "¿Seguro que deseas eliminar este empleado?",
      "Esta acción no se puede deshacer."
    );
    
    if (!confirmado) return;

    try {
      const res = await fetch(`${API_URL}/empleado/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEmpleados(empleados.filter(emp => emp.id !== id));
        toast.success("Empleado eliminado");
      } else {
        toast.error("Error al eliminar. Verificar si tiene planillas asociadas");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error de conexión al intentar eliminar");
    }
  };

  const cargarEmpleado = (emp) => {
    setNuevoEmpleado({
      nombre: emp.nombre || "",
      dui: emp.dui || "",
      area: emp.area || "",
      puesto: emp.puesto || "",
      salario_mensual: emp.salario_mensual || 0,
      fecha_ingreso: emp.fecha_ingreso || ""
    });
    setEmpleadoCargado(true);
    setEmpleadoEditandoId(emp.id);
  };

  const limpiarFormularioEmpleado = () => {
    setNuevoEmpleado({ nombre: "", dui: "", area: "", puesto: "", salario_mensual: 0, fecha_ingreso: "" });
    setEmpleadoCargado(false);
    setEmpleadoEditandoId(null);
  };

  return {
    empleados,
    nuevoEmpleado,
    setNuevoEmpleado,
    empleadoCargado,
    empleadoEditandoId,
    filtroEmpleados,
    setFiltroEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado,
    cargarEmpleado,
    limpiarFormularioEmpleado
  };
}