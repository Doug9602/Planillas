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
    total: pl.monto_cotizable || 0,
    isss_empleado: pl.monto_isss || 0, 
    afp_empleado: pl.monto_afp || 0    
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

  const handleImprimir = () => {
    window.print();
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
      {/* ===== 🖨️ ESTILOS INYECTADOS EXCLUSIVOS PARA UNA SOLA PÁGINA ===== */}
      <style>{`
        @media print {
          /* Configurar márgenes de página físicos */
          @page {
            size: letter;
            margin: 0.8cm 1cm;
          }

          /* Forzar visibilidad y evitar saltos extraños */
          html, body, #root, [class*="layout"], [class*="dashboard"], main, section {
            position: static !important;
            overflow: visible !important;
            height: auto !important;
            background: white !important;
          }

          /* Elementos ocultados por completo */
          .hero, .no-print, button, nav, aside, header, footer {
            display: none !important;
          }

          /* Forzar contenedor a ocupar el alto máximo de una página */
          .print-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            page-break-inside: avoid !important; /* Evita dividirse en 2 hojas */
          }

          /* Reducción eficiente de espacios */
          .encabezado-planilla {
            padding: 10px !important;
            margin-bottom: 10px !important;
            border-radius: 0 !important;
            border-bottom: 2px solid #333 !important;
          }

          .grid-datos-empleado {
            grid-template-columns: repeat(3, 1fr) !important; /* Todo en filas compactas */
            gap: 4px !important;
            margin-top: 8px !important;
            padding-top: 8px !important;
            font-size: 11px !important;
          }

          .tabla-desglose-contenedor {
            padding: 10px !important;
            box-shadow: none !important;
          }

          .tabla-desglose-contenedor h2 {
            font-size: 14px !important;
            margin-bottom: 10px !important;
          }

          /* Achicar tablas y rellenos de filas */
          table {
            width: 100% !important;
            font-size: 11px !important; /* Tipografía legible pero compacta */
          }
          
          tr td {
            padding: 4px 8px !important; /* Reducción de relleno de celdas al 50% */
            border-bottom: 1px solid #eee !important;
          }

          tr[style*="background-color: #f8f9fa"] td {
            padding: 6px 8px !important;
            font-size: 12px !important;
          }

          .total-destacado td {
            font-size: 13px !important;
            padding: 6px 8px !important;
          }
        }
      `}</style>

      {/* ===== MODALES COMPLETOS ORIGINALES ===== */}
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
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
              Base para el cálculo de ISSS, AFP e ISR.
            </p>

            <div style={{ 
              background: "#f0f7ff", 
              padding: "12px", 
              borderRadius: "8px", 
              borderLeft: "4px solid #007bff", 
              marginBottom: "15px",
              fontSize: "13px",
              lineHeight: "1.5"
            }}>
              <strong>💡 Importante (Base Imponible para ISR):</strong><br />
              Para calcular el ISR (Renta), la ley establece que la base imponible se obtiene restando el ISSS y la AFP al Monto Cotizable:
              <div style={{ marginTop: "5px", fontFamily: "monospace", fontWeight: "bold", color: "#0056b3" }}>
                ${desgloseCotizable.total.toFixed(2)} (Cotizable) 
                - ${desgloseCotizable.isss_empleado.toFixed(2)} (ISSS) 
                - ${desgloseCotizable.afp_empleado.toFixed(2)} (AFP) <br />
                = ${(desgloseCotizable.total - desgloseCotizable.isss_empleado - desgloseCotizable.afp_empleado).toFixed(2)} (Base Imponible)
              </div>
            </div>

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
                <strong>Monto calculated:</strong> ${pl.monto_planilla_unica?.toFixed(2) || "0.00"}
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
        </div>
      </section>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
        <div className="print-container" style={{ maxWidth: "1100px", margin: "auto" }}>
          
          {/* ===== ENCABEZADO CON DATOS DEL EMPLEADO ===== */}
          <div className="encabezado-planilla" style={{
            background: "white",
            borderRadius: "16px",
            padding: "25px 30px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            borderBottom: "4px solid #d71920"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h1 style={{ color: "#d71920", fontSize: "24px", margin: 0, fontWeight: "700" }}>
                  TEXACO EL SALVADOR
                </h1>
                <p style={{ color: "#555", margin: "2px 0 0 0", fontSize: "14px" }}>
                  Planilla de Salarios - Período: {per ? `${per.mes}/${per.año}` : "N/A"}
                </p>
              </div>
              <div style={{ textAlign: "right" }} className="no-print">
                <button 
                  onClick={handleImprimir} 
                  style={{ 
                    background: "#007bff", 
                    color: "white", 
                    border: "none", 
                    padding: "6px 14px", 
                    borderRadius: "20px", 
                    fontSize: "14px", 
                    fontWeight: "bold", 
                    cursor: "pointer",
                    marginRight: "10px" 
                  }}
                >
                  🖨️ Imprimir Planilla
                </button>
                <span style={{ background: "#d71920", color: "white", padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
                  ID: {pl.id}
                </span>
              </div>
            </div>
            
            <div className="grid-datos-empleado" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "8px",
              marginTop: "15px",
              padding: "15px 0 0 0",
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
          <div className="tabla-desglose-contenedor" style={{
            background: "white",
            borderRadius: "16px",
            padding: "25px 30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            overflowX: "auto"
          }}>
            <h2 style={{ color: "#d71920", fontSize: "20px", marginBottom: "15px", borderBottom: "2px solid #d71920", paddingBottom: "10px" }}>
              📋 Desglose completo
            </h2>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <tbody>
                {/* ===== INGRESOS ===== */}
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <td colSpan="2" style={{ padding: "10px", fontWeight: "bold", fontSize: "15px", color: "#d71920" }}>
                    📋 INGRESOS
                  </td>
                </tr>
                <tr><td>Sueldo base</td><td style={{ textAlign: "right" }}>${pl.sueldo_base?.toFixed(2)}</td></tr>
                <tr><td>Horas extras diurnas</td><td style={{ textAlign: "right" }}>{pl.horas_extras_diurnas} h → ${pl.monto_horas_extras_diurnas?.toFixed(2)}</td></tr>
                <tr><td>Horas extras nocturnas</td><td style={{ textAlign: "right" }}>{pl.horas_extras_nocturnas} h → ${pl.monto_horas_extras_nocturnas?.toFixed(2)}</td></tr>
                <tr><td>Subsidio alimentación</td><td style={{ textAlign: "right" }}>${pl.subsidio_alimentacion?.toFixed(2)}</td></tr>
                <tr><td>Bono extra</td><td style={{ textAlign: "right" }}>${pl.bono_extra?.toFixed(2)}</td></tr>
                <tr><td>Monto Vacaciones</td><td style={{ textAlign: "right" }}>${pl.monto_vacaciones?.toFixed(2)}</td></tr>
                <tr><td>Aguinaldo</td><td style={{ textAlign: "right" }}>${pl.monto_aguinaldo?.toFixed(2)}</td></tr>
                <tr><td>Aguinaldo Gravado</td><td style={{ textAlign: "right" }}>${pl.aguinaldo_gravado?.toFixed(2) || "0.00"}</td></tr>
                <tr><td>Quincena 25</td><td style={{ textAlign: "right" }}>${pl.monto_quincena25?.toFixed(2)}</td></tr>
                <tr style={{ borderTop: "2px solid #d71920", fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td style={{ fontSize: "14px" }}>Total Ingresos</td>
                  <td style={{ textAlign: "right", fontSize: "14px" }}>${pl.total_ingresos?.toFixed(2)}</td>
                </tr>

                {/* ===== DESCUENTOS ===== */}
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <td colSpan="2" style={{ padding: "10px", fontWeight: "bold", fontSize: "15px", color: "#d71920" }}>
                    📌 DESCUENTOS
                  </td>
                </tr>
                <tr><td>ISSS (empleado)</td><td style={{ textAlign: "right" }}>${pl.monto_isss?.toFixed(2)}</td></tr>
                <tr><td>AFP (empleado)</td><td style={{ textAlign: "right" }}>${pl.monto_afp?.toFixed(2)}</td></tr>
                <tr>
                  <td>
                    ISR (Renta)
                    <button onClick={() => setModalISR(true)} className="no-print" style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "12px", marginLeft: "6px", textDecoration: "underline" }}>ⓘ</button>
                  </td>
                  <td style={{ textAlign: "right" }}>${pl.monto_isr?.toFixed(2)}</td>
                </tr>
                <tr><td>Descuentos adicionales</td><td style={{ textAlign: "right" }}>${pl.descuentos_adicionales?.toFixed(2) || "0.00"}</td></tr>
                <tr style={{ borderTop: "2px solid #d71920", fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td style={{ fontSize: "14px" }}>Total Descuentos</td>
                  <td style={{ textAlign: "right", fontSize: "14px" }}>${pl.total_deducciones?.toFixed(2)}</td>
                </tr>

                {/* ===== RESUMEN ===== */}
                <tr className="total-destacado" style={{ borderTop: "2px solid #d71920", backgroundColor: "#fef9f9" }}>
                  <td style={{ fontWeight: "bold", fontSize: "16px", color: "#d71920" }}>Neto a Pagar</td>
                  <td style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px", color: "#d71920" }}>${pl.monto_neto?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>
                    Monto Cotizable
                    <button onClick={() => setModalCotizable(true)} className="no-print" style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "12px", marginLeft: "6px", textDecoration: "underline" }}>ⓘ</button>
                  </td>
                  <td style={{ textAlign: "right" }}>${pl.monto_cotizable?.toFixed(2) || "0.00"}</td>
                </tr>

                {/* ===== COSTOS PATRONALES ===== */}
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <td colSpan="2" style={{ padding: "10px", fontWeight: "bold", fontSize: "15px", color: "#d71920" }}>
                    🏢 COSTOS PATRONALES
                  </td>
                </tr>
                <tr><td>ISSS Patronal</td><td style={{ textAlign: "right" }}>${pl.monto_isss_patronal?.toFixed(2)}</td></tr>
                <tr><td>AFP Patronal</td><td style={{ textAlign: "right" }}>${pl.monto_afp_patronal?.toFixed(2)}</td></tr>
                <tr className="total-destacado" style={{ borderTop: "2px solid #d71920", fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td style={{ fontSize: "14px", color: "#d71920" }}>
                    Monto a depositar planilla única
                    <button onClick={() => setModalPlanillaUnica(true)} className="no-print" style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "12px", marginLeft: "6px", textDecoration: "underline" }}>ⓘ</button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    ${pl.monto_planilla_unica?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Botón Volver (Solo visible en pantalla) */}
            <div style={{ textAlign: "center", marginTop: "20px" }} className="no-print">
              <button 
                onClick={onVolver} 
                style={{ background: "#6c757d", color: "white", border: "none", padding: "10px 35px", borderRadius: "30px", fontSize: "15px", cursor: "pointer" }}
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