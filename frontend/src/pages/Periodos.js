// components/Periodos.js

import React, { useState, useEffect, useRef } from "react";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Periodos({
  periodos,
  nuevoPeriodo,
  setNuevoPeriodo,
  periodoCargado,
  crearPeriodo,
  actualizarPeriodo,
  eliminarPeriodo,
  cargarPeriodo,
  limpiarFormularioPeriodo,
  generarProximoPeriodo
}) {
  
  const añoActualSistema = new Date().getFullYear();
  const añoSeleccionado = nuevoPeriodo.año || añoActualSistema;

  // Estado para el Dropdown y referencia para auto-scrollear al año activo
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const contenedorAñosRef = useRef(null);

  // Generar array plano desde el 2000 hasta el 2100 para el scroll directo
  const listaCompletaAños = Array.from({ length: 101 }, (_, i) => 2000 + i);

  // Efecto para que, al abrir el menú, haga scroll automático hasta el año que está seleccionado
  useEffect(() => {
    if (mostrarDropdown && contenedorAñosRef.current) {
      const botonActivo = contenedorAñosRef.current.querySelector("[data-activo='true']");
      if (botonActivo) {
        contenedorAñosRef.current.scrollTop = botonActivo.offsetTop - 80;
      }
    }
  }, [mostrarDropdown]);

  // Función: Obtiene la fecha de corte exacta en formato local YYYY-MM-DD
  const obtenerFechaCorteExacta = (mes, año) => {
    if (!mes || !año) return "";
    const fecha = new Date(año, mes, 0); 
    
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
  };

  // Manejar cambio de mes
  const handleMesChange = (e) => {
    const mes = parseInt(e.target.value);
    const fechaCorte = obtenerFechaCorteExacta(mes, añoSeleccionado);
    
    setNuevoPeriodo({
      ...nuevoPeriodo,
      mes: mes,
      fecha_corte: fechaCorte
    });
  };

  // Seleccionar año del scroll y cerrar menú
  const cambiarAño = (nuevoAño) => {
    const mes = nuevoPeriodo.mes || 1;
    const fechaCorte = obtenerFechaCorteExacta(mes, nuevoAño);
    
    setNuevoPeriodo({
      ...nuevoPeriodo,
      año: nuevoAño,
      fecha_corte: fechaCorte
    });
    
    setMostrarDropdown(false);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');

    // Validar que haya mes y año
    if (!nuevoPeriodo.mes || !nuevoPeriodo.año) {
      setMensajeError('⚠️ Debes seleccionar mes y año');
      return;
    }

    // Calcular fecha_corte y actualizar el estado
    const fechaCorte = obtenerFechaCorteExacta(nuevoPeriodo.mes, nuevoPeriodo.año);
    
    setNuevoPeriodo(prev => ({
      ...prev,
      fecha_corte: fechaCorte
    }));

    try {
      if (periodoCargado) {
        // Pasar el evento (e) como espera la función
        await actualizarPeriodo(e);
      } else {
        // Pasar el evento (e) como espera la función
        await crearPeriodo(e);
      }
      
      // Las funciones ya manejan toast de éxito/error internamente
      // El hook ya actualiza el estado y muestra los mensajes
      
    } catch (error) {
      // Solo errores de ejecución, los HTTP ya los maneja el hook
      console.error('Error inesperado:', error);
      setMensajeError('❌ Error inesperado al guardar el período');
    }
  };

  return (
    <>
      <section className="hero" style={{ height: "250px" }}>
        <div className="overlay">
          <h1 style={{ fontSize: "36px" }}>Gestión de Períodos</h1>
        </div>
      </section>

      <div style={{ padding: "40px 20px", background: "#efefef", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "800px", width: "100%", background: "white", padding: "30px", borderRadius: "8px" }}>
          <h2 style={{ textAlign: "center", color: "#d71920", marginBottom: "20px" }}>
            {periodoCargado ? "Editar Período" : "Agregar Nuevo Período"}
          </h2>

          {/* Mostrar mensaje de error */}
          {mensajeError && (
            <div style={{ 
              color: '#721c24', 
              background: '#f8d7da', 
              padding: '12px', 
              borderRadius: '8px',
              border: '1px solid #f5c6cb',
              marginBottom: '16px'
            }}>
              {mensajeError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Fila: Mes y Año (Dropdown con Scroll) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
              
              {/* Selector de Mes */}
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Mes</label>
                <select
                  value={nuevoPeriodo.mes || ""}
                  onChange={handleMesChange}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", height: "42px", fontSize: "15px" }}
                >
                  <option value="">Seleccione mes</option>
                  {meses.map((nombre, index) => (
                    <option key={index + 1} value={index + 1}>
                      {nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Año Premium con Scroll Nativo */}
              <div style={{ position: "relative" }}>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Año</label>
                
                {/* Input falso estético */}
                <div
                  onClick={() => setMostrarDropdown(!mostrarDropdown)}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd",
                    background: "white", cursor: "pointer", display: "flex", justifyContent: "space-between",
                    alignItems: "center", height: "42px", boxSizing: "border-box", fontSize: "15px",
                    userSelect: "none"
                  }}
                >
                  <span>{añoSeleccionado}</span>
                  <span style={{ fontSize: "11px", color: "#666" }}>{mostrarDropdown ? "▲" : "▼"}</span>
                </div>

                {/* Contenedor Flotante con Scroll Completo (2000-2100) */}
                {mostrarDropdown && (
                  <div 
                    ref={contenedorAñosRef}
                    style={{
                      position: "absolute", top: "46px", left: 0, width: "100%",
                      height: "200px", background: "white", borderRadius: "8px", border: "1px solid #ddd",
                      boxShadow: "0px 6px 16px rgba(0,0,0,0.12)", zIndex: 10, overflowY: "auto",
                      padding: "5px", boxSizing: "border-box", scrollBehavior: "smooth"
                    }}
                  >
                    {listaCompletaAños.map((año) => {
                      const esElActivo = año === añoSeleccionado;
                      return (
                        <button
                          key={año}
                          type="button"
                          data-activo={esElActivo}
                          onClick={() => cambiarAño(año)}
                          style={{
                            width: "100%", padding: "9px 0", border: "none", borderRadius: "6px",
                            fontSize: "14px", fontWeight: esElActivo ? "bold" : "normal",
                            background: esElActivo ? "#007bff" : "transparent",
                            color: esElActivo ? "white" : "#333",
                            cursor: "pointer", textAlign: "center", transition: "background 0.1s",
                            display: "block"
                          }}
                          onMouseEnter={(e) => {
                            if (!esElActivo) e.target.style.background = "#f1f3f5";
                          }}
                          onMouseLeave={(e) => {
                            if (!esElActivo) e.target.style.background = "transparent";
                          }}
                        >
                          {año}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Descripción (opcional) */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Descripción (opcional)
              </label>
              <input
                type="text"
                placeholder=""
                value={nuevoPeriodo.descripcion || ""}
                onChange={e => setNuevoPeriodo({ ...nuevoPeriodo, descripcion: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            {/* Fecha de corte (solo lectura, se calcula automáticamente) */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Fecha de corte (automática)
              </label>
              <input
                type="date"
                value={nuevoPeriodo.fecha_corte || ""}
                readOnly
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5" }}
              />
              <small style={{ color: "#888" }}>Se calcula automáticamente al seleccionar mes y año.</small>
            </div>

            {/* Botones de acción */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="submit" style={{ flex: 1, padding: "10px", background: "#d71920", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                {periodoCargado ? "Actualizar Período" : "Guardar Período"}
              </button>
              <button
                type="button"
                onClick={limpiarFormularioPeriodo}
                style={{ flex: 1, padding: "10px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={generarProximoPeriodo}
                style={{ flex: 1, padding: "10px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Generar Próximo
              </button>
            </div>

            {periodoCargado && (
              <button
                type="button"
                onClick={limpiarFormularioPeriodo}
                style={{ marginTop: "10px", padding: "8px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Cancelar Edición
              </button>
            )}
          </form>

          <hr style={{ margin: "30px 0" }} />
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Lista de Períodos</h3>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {periodos.map(per => {
              if (!per.fecha_corte) return null;
              
              const [fAño, fMes, fDia] = per.fecha_corte.split('-').map(Number);
              const dia = fDia;
              const mes = meses[fMes - 1]; 
              const año = fAño;

              return (
                <li key={per.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee" }}>
                  <span>
                    <strong>{dia} de {mes} de {año}</strong>
                    {per.descripcion ? ` - ${per.descripcion}` : ' - (sin descripción)'}
                    {per.total_general > 0 && ` (Total: $${per.total_general})`}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => cargarPeriodo(per)} style={{ background: "#007bff", color: "white", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer" }}>
                      Cargar
                    </button>
                    <button onClick={() => eliminarPeriodo(per.id)} style={{ background: "#d71920", color: "white", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer" }}>
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}