import React, { useState } from "react";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function DetallePlanilla({ planilla, empleados, periodos, onVolver }) {
  // ===== HOOKS =====
  const [modalISR, setModalISR] = useState(false);
  const [modalCotizable, setModalCotizable] = useState(false);
  const [modalPlanillaUnica, setModalPlanillaUnica] = useState(false);

  // ===== VALIDACIÓN =====
  if (!planilla) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>No se encontró la planilla</h2>
        <button onClick={onVolver} style={{ background: "#6c757d", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
          Volver
        </button>
      </div>
    );
  }

  const pl = planilla;
  const emp = empleados?.find(e => e.id === pl.empleado_id);
  const per = periodos?.find(p => p.id === pl.periodo_id);

  // ===== DATOS PARA MODALES =====
  const desgloseCotizable = {
    sueldo_base: pl.sueldo_base || 0,
    horas_extras_diurnas: pl.monto_horas_extras_diurnas || 0,
    horas_extras_nocturnas: pl.monto_horas_extras_nocturnas || 0,
    vacaciones: pl.monto_vacaciones || 0,
    bono_extra: pl.bono_extra || 0,
    aguinaldo_gravado: pl.aguinaldo_gravado || 0,
    total: pl.monto_cotizable || 0
  };

  const tramosISR = [
    { desde: "0.01", hasta: "550.00", cuota: "0.00", porcentaje: "0%" },
    { desde: "550.01", hasta: "895.24", cuota: "17.67", porcentaje: "10%" },
    { desde: "895.25", hasta: "2,038.10", cuota: "60.00", porcentaje: "20%" },
    { desde: "2,038.11", hasta: "∞", cuota: "288.57", porcentaje: "30%" }
  ];

  // ===== FUNCIONES =====
  const cerrarModales = () => {
    setModalISR(false);
    setModalCotizable(false);
    setModalPlanillaUnica(false);
  };

  // ===== FORMATO DE FECHA =====
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "Fecha no disponible";
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  // ===== ESTILOS =====
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px"
  };

  const modalContentStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
  };

  return (
    <>
      {/* ===== MODALES ===== */}
      {modalISR && (
        <div style={modalOverlayStyle} onClick={cerrarModales}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#d71920", marginBottom: "15px" }}>📊 Tabla de Retención de ISR</h3>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "15px" }}>
              Tramos mensuales vigentes según Ministerio de Hacienda.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Desde ($)</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Hasta ($)</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>Cuota fija ($)</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>%</th>
                </tr>
              </thead>
              <tbody>
                {tramosISR.map((tramo, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{tramo.desde}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{tramo.hasta}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>${tramo.cuota}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>{tramo.porcentaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "15px", textAlign: "right" }}>
              <button onClick={cerrarModales} style={{ background: "#6c757d", color: "white", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalCotizable && (
        <div style={modalOverlayStyle} onClick={cerrarModales}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#d71920", marginBottom: "15px" }}>📊 Desglose del Monto Cotizable</h3>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "15px" }}>
              Base para el cálculo de ISSS, AFP e ISR.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <tbody>
                <tr><td style={{ padding: "6px", borderBottom: "1px solid #eee" }}>Sueldo base</td><td style={{ padding: "6px", borderBottom: "1px solid #eee", textAlign: "right" }}>${desgloseCotizable.sueldo_base.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "6px", borderBottom: "1px solid #eee" }}>Horas extras diurnas</td><td style={{ padding: "6px", borderBottom: "1px solid #eee", textAlign: "right" }}>${desgloseCotizable.horas_extras_diurnas.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "6px", borderBottom: "1px solid #eee" }}>Horas extras nocturnas</td><td style={{ padding: "6px", borderBottom: "1px solid #eee", textAlign: "right" }}>${desgloseCotizable.horas_extras_nocturnas.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "6px", borderBottom: "1px solid #eee" }}>Monto Vacaciones</td><td style={{ padding: "6px", borderBottom: "1px solid #eee", textAlign: "right" }}>${desgloseCotizable.vacaciones.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "6px", borderBottom: "1px solid #eee" }}>Bono extra</td><td style={{ padding: "6px", borderBottom: "1px solid #eee", textAlign: "right" }}>${desgloseCotizable.bono_extra.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "6px", borderBottom: "1px solid #eee" }}>Aguinaldo gravado</td><td style={{ padding: "6px", borderBottom: "1px solid #eee", textAlign: "right" }}>${desgloseCotizable.aguinaldo_gravado.toFixed(2)}</td></tr>
                <tr style={{ borderTop: "2px solid #d71920", fontWeight: "bold" }}>
                  <td style={{ padding: "8px" }}>TOTAL Monto Cotizable</td>
                  <td style={{ padding: "8px", textAlign: "right", color: "#d71920" }}>${desgloseCotizable.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: "15px", textAlign: "right" }}>
              <button onClick={cerrarModales} style={{ background: "#6c757d", color: "white", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalPlanillaUnica && (
        <div style={modalOverlayStyle} onClick={cerrarModales}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#d71920", marginBottom: "15px" }}>📊 Monto a depositar planilla única</h3>
            <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
              <p><strong>¿Qué incluye?</strong></p>
              <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
                <li>ISSS Patronal (7.5% sobre el monto cotizable)</li>
                <li>AFP Patronal (8.75% sobre el monto cotizable)</li>
                <li><strong>ISSS Empleado (3%)</strong></li>
                <li><strong>AFP Empleado (7.25%)</strong></li>
              </ul>
              <p style={{ background: "#f9f9f9", padding: "10px", borderRadius: "6px", borderLeft: "4px solid #d71920" }}>
                <strong>Monto calculado:</strong> ${pl.monto_planilla_unica?.toFixed(2) || "0.00"}
              </p>
              <p style={{ fontSize: "13px", color: "#666", marginTop: "10px" }}>
                <em>Nota: Este monto incluye tanto las cuotas patronales como las del empleado que la empresa debe depositar ante las instituciones correspondientes.</em>
              </p>
            </div>
            <div style={{ marginTop: "15px", textAlign: "right" }}>
              <button onClick={cerrarModales} style={{ background: "#6c757d", color: "white", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== BANNER HERO ===== */}
      <section className="hero" style={{ height: "180px" }}>
        <div className="overlay">
          <h1 style={{ fontSize: "28px" }}>Detalle de Planilla</h1>
          <p style={{ color: "#ddd", marginTop: "4px" }}>
            {emp ? emp.nombre : "Empleado"} - Período {per ? `${per.mes}/${per.año}` : ""}
          </p>
        </div>
      </section>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "auto" }}>
          
          {/* ===== ENCABEZADO CON DATOS DEL EMPLEADO ===== */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "25px 30px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            borderBottom: "4px solid #d71920"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h1 style={{ color: "#d71920", fontSize: "26px", margin: 0, fontWeight: "700" }}>
                  TEXACO EL SALVADOR
                </h1>
                <p style={{ color: "#555", margin: "2px 0 0 0", fontSize: "15px" }}>
                  Planilla de Salarios - Período: {per ? `${per.mes}/${per.año}` : "N/A"}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ background: "#d71920", color: "white", padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
                  ID: {pl.id}
                </span>
              </div>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "8px",
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #eee"
            }}>
              <div><strong>Empleado:</strong> {emp ? emp.nombre : "?"}</div>
              <div><strong>Puesto:</strong> {emp ? emp.puesto : "?"}</div>
              <div><strong>DUI:</strong> {emp ? emp.dui : "?"}</div>
              <div><strong>Área:</strong> {emp ? emp.area : "?"}</div>
              <div><strong>Fecha Ingreso:</strong> {emp ? emp.fecha_ingreso : "?"}</div>
              <div><strong>Fecha Corte:</strong> {formatearFecha(per?.fecha_corte)}</div>
            </div>
          </div>

          {/* ===== TABLA DE DESGLOSE ===== */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "25px 30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            overflowX: "auto"
          }}>
            <h2 style={{ color: "#d71920", fontSize: "20px", marginBottom: "20px", borderBottom: "2px solid #d71920", paddingBottom: "10px" }}>
              📋 Desglose completo
            </h2>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <tbody>
                {/* ===== INGRESOS ===== */}
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <td colSpan="2" style={{ padding: "10px", fontWeight: "bold", fontSize: "16px", color: "#d71920" }}>
                    📋 INGRESOS
                  </td>
                </tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Sueldo base</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.sueldo_base?.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Horas extras diurnas</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>{pl.horas_extras_diurnas} h → ${pl.monto_horas_extras_diurnas?.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Horas extras nocturnas</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>{pl.horas_extras_nocturnas} h → ${pl.monto_horas_extras_nocturnas?.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Subsidio alimentación</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.subsidio_alimentacion?.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Bono extra</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.bono_extra?.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Monto Vacaciones</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.monto_vacaciones?.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Aguinaldo</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.monto_aguinaldo?.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Aguinaldo Gravado</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.aguinaldo_gravado?.toFixed(2) || "0.00"}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Quincena 25</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.monto_quincena25?.toFixed(2)}</td></tr>
                <tr style={{ borderTop: "2px solid #d71920", fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td style={{ padding: "10px 12px", fontSize: "15px" }}>Total Ingresos</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontSize: "15px" }}>${pl.total_ingresos?.toFixed(2)}</td>
                </tr>

                {/* ===== DESCUENTOS ===== */}
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <td colSpan="2" style={{ padding: "10px", fontWeight: "bold", fontSize: "16px", color: "#d71920" }}>
                    📌 DESCUENTOS
                  </td>
                </tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>ISSS (empleado)</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.monto_isss?.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>AFP (empleado)</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.monto_afp?.toFixed(2)}</td></tr>
                <tr>
                  <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>
                    ISR (Renta)
                    <button 
                      onClick={() => setModalISR(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer",
                        fontSize: "13px",
                        marginLeft: "8px",
                        textDecoration: "underline"
                      }}
                    >
                      ⓘ
                    </button>
                  </td>
                  <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.monto_isr?.toFixed(2)}</td>
                </tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>Descuentos adicionales</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.descuentos_adicionales?.toFixed(2) || "0.00"}</td></tr>
                <tr style={{ borderTop: "2px solid #d71920", fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td style={{ padding: "10px 12px", fontSize: "15px" }}>Total Descuentos</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontSize: "15px" }}>${pl.total_deducciones?.toFixed(2)}</td>
                </tr>

                {/* ===== RESUMEN ===== */}
                <tr style={{ borderTop: "2px solid #d71920", backgroundColor: "#fef9f9" }}>
                  <td style={{ padding: "12px 12px", fontWeight: "bold", fontSize: "18px", color: "#d71920" }}>Neto a Pagar</td>
                  <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: "bold", fontSize: "18px", color: "#d71920" }}>${pl.monto_neto?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>
                    Monto Cotizable
                    <button 
                      onClick={() => setModalCotizable(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer",
                        fontSize: "13px",
                        marginLeft: "8px",
                        textDecoration: "underline"
                      }}
                    >
                      ⓘ
                    </button>
                  </td>
                  <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.monto_cotizable?.toFixed(2) || "0.00"}</td>
                </tr>

                {/* ===== COSTOS PATRONALES ===== */}
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <td colSpan="2" style={{ padding: "10px", fontWeight: "bold", fontSize: "16px", color: "#d71920" }}>
                    🏢 COSTOS PATRONALES
                  </td>
                </tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>ISSS Patronal</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.monto_isss_patronal?.toFixed(2)}</td></tr>
                <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>AFP Patronal</td><td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${pl.monto_afp_patronal?.toFixed(2)}</td></tr>
                <tr style={{ borderTop: "2px solid #d71920", fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td style={{ padding: "10px 12px", fontSize: "15px", color: "#d71920" }}>
                    Monto a depositar planilla única
                    <button 
                      onClick={() => setModalPlanillaUnica(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer",
                        fontSize: "13px",
                        marginLeft: "8px",
                        textDecoration: "underline"
                      }}
                    >
                      ⓘ
                    </button>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontSize: "15px", fontWeight: "bold", color: "#d71920" }}>
                    ${pl.monto_planilla_unica?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Botón volver */}
            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <button 
                onClick={onVolver} 
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 35px",
                  borderRadius: "30px",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "0.2s",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                }}
                onMouseEnter={(e) => e.target.style.background = "#5a6268"}
                onMouseLeave={(e) => e.target.style.background = "#6c757d"}
              >
                ← Volver a Planillas
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}