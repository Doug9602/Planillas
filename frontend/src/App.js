import React, { useState } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";

import { useEmpleados } from "./hooks/useEmpleados";
import { usePeriodos } from "./hooks/usePeriodos";
import { usePlanillas } from "./hooks/usePlanillas";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Empleados from "./pages/Empleados";
import Periodos from "./pages/Periodos";
import Planillas from "./pages/Planillas";
import PlanillaMensual from "./pages/PlanillaMensual";  // Importamos la nueva página

export default function App() {
  const [vista, setVista] = useState("home");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null); // Para la vista mensual

  const empleadosState = useEmpleados();
  const periodosState = usePeriodos();
  const planillasState = usePlanillas(empleadosState.empleados);

  // --- Navegación ---
  const irAInicio = () => {
    setVista("home");
    setPeriodoSeleccionado(null);
    empleadosState.limpiarFormularioEmpleado();
    periodosState.limpiarFormularioPeriodo();
    planillasState.limpiarFormularioPlanilla();
    empleadosState.setFiltroEmpleados("");
  };

  const irAEmpleados = () => {
    setVista("empleados");
    setPeriodoSeleccionado(null);
    periodosState.limpiarFormularioPeriodo();
    planillasState.limpiarFormularioPlanilla();
  };

  const irAPeriodos = () => {
    setVista("periodos");
    setPeriodoSeleccionado(null);
    empleadosState.limpiarFormularioEmpleado();
    planillasState.limpiarFormularioPlanilla();
  };

  const irAPlanillas = () => {
    setVista("planillas");
    setPeriodoSeleccionado(null);
    empleadosState.limpiarFormularioEmpleado();
    periodosState.limpiarFormularioPeriodo();
  };

  const irAPlanillaMensual = () => {
    setVista("planillaMensual");
    setPeriodoSeleccionado(null); // Reseteamos el período al entrar
    empleadosState.limpiarFormularioEmpleado();
    periodosState.limpiarFormularioPeriodo();
    planillasState.limpiarFormularioPlanilla();
  };

  // Función para ver detalle de una planilla desde la tabla mensual
  const verDetalleDesdeMensual = (planillaId) => {
    const pl = planillasState.planillas.find(p => p.id === planillaId);
    if (pl) {
      planillasState.verDetalle(pl);
      // Mantenemos la vista en "planillas" para que el detalle se muestre allí
      setVista("planillas");
    }
  };

  return (
    <div className="app">
      <Navbar
        onInicio={irAInicio}
        onEmpleados={irAEmpleados}
        onPeriodos={irAPeriodos}
        onPlanillas={irAPlanillas}
        onPlanillaMensual={irAPlanillaMensual}  // Nueva prop
      />

      {vista === "home" && <Home onIrAEmpleados={irAEmpleados} />}

      {vista === "empleados" && (
        <Empleados
          empleados={empleadosState.empleados}
          nuevoEmpleado={empleadosState.nuevoEmpleado}
          setNuevoEmpleado={empleadosState.setNuevoEmpleado}
          empleadoCargado={empleadosState.empleadoCargado}
          filtroEmpleados={empleadosState.filtroEmpleados}
          setFiltroEmpleados={empleadosState.setFiltroEmpleados}
          crearEmpleado={empleadosState.crearEmpleado}
          actualizarEmpleado={empleadosState.actualizarEmpleado}
          cargarEmpleado={empleadosState.cargarEmpleado}
          eliminarEmpleado={empleadosState.eliminarEmpleado}
          limpiarFormularioEmpleado={empleadosState.limpiarFormularioEmpleado}
        />
      )}

      {vista === "periodos" && (
        <Periodos
          periodos={periodosState.periodos}
          nuevoPeriodo={periodosState.nuevoPeriodo}
          setNuevoPeriodo={periodosState.setNuevoPeriodo}
          periodoCargado={periodosState.periodoCargado}
          crearPeriodo={periodosState.crearPeriodo}
          eliminarPeriodo={periodosState.eliminarPeriodo}
          cargarPeriodo={periodosState.cargarPeriodo}
          limpiarFormularioPeriodo={periodosState.limpiarFormularioPeriodo}
          generarProximoPeriodo={periodosState.generarProximoPeriodo}
          actualizarPeriodo={periodosState.actualizarPeriodo}   
        />
      )}

      {/* Página de Planillas (con detalle incluido) */}
      {vista === "planillas" && (
        <Planillas
          planillas={planillasState.planillas}
          periodos={periodosState.periodos}
          empleados={empleadosState.empleados}
          nuevaPlanilla={planillasState.nuevaPlanilla}
          setNuevaPlanilla={planillasState.setNuevaPlanilla}
          planillaCargado={planillasState.planillaCargado}
          crearPlanilla={planillasState.crearPlanilla}
          actualizarPlanilla={planillasState.actualizarPlanilla}
          eliminarPlanilla={planillasState.eliminarPlanilla}
          cargarPlanilla={planillasState.cargarPlanilla}
          limpiarFormularioPlanilla={planillasState.limpiarFormularioPlanilla}
          verDetalle={planillasState.verDetalle}
          vistaDetalle={planillasState.vistaDetalle}
          planillaSeleccionada={planillasState.planillaSeleccionada}
          volverAListado={planillasState.volverAListado}
        />
      )}

      {/* Nueva vista: Planilla Mensual tipo spreadsheet */}
      {vista === "planillaMensual" && (
        <PlanillaMensual
          periodos={periodosState.periodos}
          empleados={empleadosState.empleados}
          planillas={planillasState.planillas}
          periodoSeleccionado={periodoSeleccionado}
          setPeriodoSeleccionado={setPeriodoSeleccionado}
          onVerDetalle={verDetalleDesdeMensual}
        />
      )}

      <Footer />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          }
        }}
      />
    </div>
  );
}