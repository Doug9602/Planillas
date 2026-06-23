import React from "react";
import { calcularAntiguedad } from "../utils/helpers";


export default function Empleados({
  empleados,
  nuevoEmpleado,
  setNuevoEmpleado,
  empleadoCargado,
  filtroEmpleados,
  setFiltroEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  cargarEmpleado,
  eliminarEmpleado,
  limpiarFormularioEmpleado
}) {
  const empleadosFiltrados = empleados.filter(emp =>
    emp.nombre.toLowerCase().includes(filtroEmpleados.toLowerCase()) ||
    (emp.dui && emp.dui.toLowerCase().includes(filtroEmpleados.toLowerCase()))
  );

  return (
    <>
      <section className="hero" style={{ height: "250px" }}>
        <div className="overlay">
          <h1 style={{ fontSize: "36px" }}>Gestión de Empleados</h1>
        </div>
      </section>
      <div style={{ padding: "40px 20px", background: "#efefef", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "900px", width: "100%", background: "white", padding: "30px", borderRadius: "8px" }}>
          <h2 style={{ textAlign: "center", color: "#d71920", marginBottom: "20px" }}>
            {empleadoCargado ? "Editar Empleado" : "Agregar Nuevo Empleado"}
          </h2>
          <form onSubmit={empleadoCargado ? actualizarEmpleado : crearEmpleado}>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoEmpleado.nombre}
              onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="DUI (ej: 12345678-9)"
              value={nuevoEmpleado.dui}
              onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, dui: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Área"
              value={nuevoEmpleado.area}
              onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, area: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Puesto"
              value={nuevoEmpleado.puesto}
              onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, puesto: e.target.value })}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Salario mensual"
              value={nuevoEmpleado.salario_mensual || ''}
              onFocus={(e) => e.target.select()}
              onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, salario_mensual: parseFloat(e.target.value) || 0 })}
              required
            />
            <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Fecha de ingreso</label>
            <input
              type="date"
              value={nuevoEmpleado.fecha_ingreso}
              onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, fecha_ingreso: e.target.value })}
              required
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={{ flex: 1 }}>
                {empleadoCargado ? "Actualizar Empleado" : "Guardar Empleado"}
              </button>
              {empleadoCargado && (
                <button type="button" onClick={limpiarFormularioEmpleado} style={{ background: "#666", flex: 1 }}>
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
          <hr style={{ margin: "30px 0" }} />

          {/* BUSCADOR CON BOTÓN DE LIMPIEZA */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o DUI..."
              value={filtroEmpleados}
              onChange={e => setFiltroEmpleados(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "15px"
              }}
            />
            <button
              onClick={() => setFiltroEmpleados('')}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#f5f5f5",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#555"
              }}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          </div>

          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
            Lista de Empleados {empleadosFiltrados.length !== empleados.length && `(${empleadosFiltrados.length} de ${empleados.length})`}
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>
                  <th style={{ textAlign: "center", padding: "10px 8px" }}>Nombre</th>
                  <th style={{ textAlign: "center", padding: "10px 8px" }}>Puesto</th>
                  <th style={{ textAlign: "center", padding: "10px 8px" }}>Antigüedad</th>
                  <th style={{ textAlign: "center", padding: "10px 8px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.map(emp => {
                  const antiguedad = calcularAntiguedad(emp.fecha_ingreso);
                  return (
                    <tr key={emp.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ textAlign: "center", padding: "10px 8px", fontWeight: "500" }}>{emp.nombre}</td>
                      <td style={{ textAlign: "center", padding: "10px 8px" }}>{emp.puesto}</td>
                      <td style={{ textAlign: "center", padding: "10px 8px" }}>
                        <span style={{ fontWeight: "bold", color: "#d71920" }}>
                          {antiguedad} {antiguedad === 1 ? 'año' : 'años'}
                        </span>
                      </td>
                      <td style={{ textAlign: "center", padding: "10px 8px", whiteSpace: "nowrap" }}>
                        <button
                          onClick={() => cargarEmpleado(emp)}
                          style={{
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "6px"
                          }}
                        >
                          Cargar
                        </button>
                        <button
                          onClick={() => eliminarEmpleado(emp.id)}
                          style={{
                            background: "#d71920",
                            color: "white",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {empleadosFiltrados.length === 0 && (
            <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
              No se encontraron empleados con ese criterio.
            </p>
          )}
        </div>
      </div>
    </>
  );
}