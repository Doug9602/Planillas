import React from "react";
import DetallePlanilla from "./DetallePlanilla";

export default function Planillas({
  planillas,
  periodos,
  empleados,
  nuevaPlanilla,
  setNuevaPlanilla,
  planillaCargado,
  crearPlanilla,
  actualizarPlanilla,
  eliminarPlanilla,
  cargarPlanilla,
  limpiarFormularioPlanilla,
  verDetalle,
  vistaDetalle,
  planillaSeleccionada,
  volverAListado
}) {
  if (vistaDetalle) {
    return (
      <DetallePlanilla
        planilla={planillaSeleccionada}
        empleados={empleados}
        periodos={periodos}
        onVolver={volverAListado}
      />
    );
  }

  return (
    <>
      <section className="hero" style={{ height: "200px" }}>
        <div className="overlay">
          <h1 style={{ fontSize: "32px" }}>Registro de Planillas</h1>
          <p style={{ color: "#ddd", marginTop: "8px" }}>
            Ingresa los datos del empleado y las horas trabajadas
          </p>
        </div>
      </section>

      <div style={{ padding: "30px 20px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: "1200px", margin: "auto" }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            padding: "30px 35px",
            marginBottom: "30px"
          }}>
            <h2 style={{ marginBottom: "25px", color: "#d71920", fontSize: "24px" }}>
              {planillaCargado ? "✏️ Editar Planilla" : "📝 Registrar Nueva Planilla"}
            </h2>

            <form onSubmit={planillaCargado ? actualizarPlanilla : crearPlanilla}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Período</label>
                  <select
                    value={nuevaPlanilla.periodo_id}
                    onChange={e => setNuevaPlanilla({ ...nuevaPlanilla, periodo_id: e.target.value })}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                  >
                    <option value="">Seleccione período</option>
                    {periodos.map(per => {
                      const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                      const partes = per.fecha_corte.split("-");
                      const fechaFormateada = `${partes[2]}/${meses[parseInt(partes[1], 10) - 1]}/${partes[0]}`;
                      return (
                        <option key={per.id} value={per.id}>
                          {fechaFormateada}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Empleado</label>
                  <select
                    value={nuevaPlanilla.empleado_id}
                    onChange={e => setNuevaPlanilla({ ...nuevaPlanilla, empleado_id: e.target.value })}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                  >
                    <option value="">Seleccione empleado</option>
                    {empleados.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nombre} - DUI: {emp.dui} - {emp.puesto}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Sueldo base mensual (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevaPlanilla.sueldo_base || ''}
                    onFocus={(e) => e.target.select()}
                    onChange={e => setNuevaPlanilla({ ...nuevaPlanilla, sueldo_base: parseFloat(e.target.value) || 0 })}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Subsidio de alimentación (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevaPlanilla.subsidio_alimentacion || ''}
                    onFocus={(e) => e.target.select()}
                    onChange={e => setNuevaPlanilla({ ...nuevaPlanilla, subsidio_alimentacion: parseFloat(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Horas extra diurnas</label>
                  <input
                    type="number"
                    step="0.5"
                    value={nuevaPlanilla.horas_extras_diurnas || ''}
                    onFocus={(e) => e.target.select()}
                    onChange={e => setNuevaPlanilla({ ...nuevaPlanilla, horas_extras_diurnas: parseFloat(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Horas extra nocturnas</label>
                  <input
                    type="number"
                    step="0.5"
                    value={nuevaPlanilla.horas_extras_nocturnas || ''}
                    onFocus={(e) => e.target.select()}
                    onChange={e => setNuevaPlanilla({ ...nuevaPlanilla, horas_extras_nocturnas: parseFloat(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Horas nocturnas normales</label>
                  <input
                    type="number"
                    step="0.5"
                    value={nuevaPlanilla.horas_nocturnas || ''}
                    onFocus={(e) => e.target.select()}
                    onChange={e => setNuevaPlanilla({ ...nuevaPlanilla, horas_nocturnas: parseFloat(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Bono extra (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevaPlanilla.bono_extra || ''}
                    onFocus={(e) => e.target.select()}
                    onChange={e => setNuevaPlanilla({ ...nuevaPlanilla, bono_extra: parseFloat(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
                  <label style={{ fontWeight: "500" }}>
                    <input
                      type="checkbox"
                      checked={nuevaPlanilla.quincena25_aplica}
                      onChange={e => setNuevaPlanilla({ ...nuevaPlanilla, quincena25_aplica: e.target.checked })}
                      style={{ marginRight: "8px" }}
                    />
                    Pagar Quincena 25 (50% del sueldo base, solo si ≤ $1,500)
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button type="submit" style={{
                  background: "#d71920",
                  color: "white",
                  border: "none",
                  padding: "12px 32px",
                  borderRadius: "30px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.2s",
                  flex: 1
                }}>
                  {planillaCargado ? "Actualizar Planilla" : "Registrar Planilla"}
                </button>
                <button
                  type="button"
                  onClick={limpiarFormularioPlanilla}
                  style={{
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "12px 32px",
                    borderRadius: "30px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  {planillaCargado ? "Cancelar Edición" : "Limpiar"}
                </button>
              </div>
            </form>
          </div>

          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            padding: "20px 25px",
            overflowX: "auto"
          }}>
            <h3 style={{ marginBottom: "15px", color: "#333" }}>📋 Planillas Registradas</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={{ padding: "10px 8px", textAlign: "left" }}>ID</th>
                  <th style={{ padding: "10px 8px", textAlign: "left" }}>Empleado</th>
                  <th style={{ padding: "10px 8px", textAlign: "left" }}>Período</th>
                  <th style={{ padding: "10px 8px", textAlign: "right" }}>Neto</th>
                  <th style={{ padding: "10px 8px", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {planillas.map(pl => {
                  const emp = empleados.find(e => e.id === pl.empleado_id);
                  const per = periodos.find(p => p.id === pl.periodo_id);
                  return (
                    <tr key={pl.id}>
                      <td style={{ padding: "8px 8px", textAlign: "left" }}>{pl.id}</td>
                      <td style={{ padding: "8px 8px", textAlign: "left" }}>{emp ? emp.nombre : "?"}</td>
                      <td style={{ padding: "8px 8px", textAlign: "left" }}>{per ? `${per.mes}/${per.año}` : "?"}</td>
                      <td style={{ padding: "8px 8px", textAlign: "right" }}><strong>${pl.monto_neto?.toFixed(2) ?? "0.00"}</strong></td>
                      <td style={{ padding: "8px 8px", textAlign: "center" }}>
                        <button
                          onClick={() => verDetalle(pl)}
                          style={{
                            background: "#28a745",
                            color: "white",
                            border: "none",
                            padding: "4px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "6px"
                          }}
                        >
                          Detalle
                        </button>
                        <button
                          onClick={() => cargarPlanilla(pl)}
                          style={{
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "4px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "6px"
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarPlanilla(pl.id)}
                          style={{
                            background: "#d71920",
                            color: "white",
                            border: "none",
                            padding: "4px 12px",
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
        </div>
      </div>
    </>
  );
}
