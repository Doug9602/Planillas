import React, { useState } from "react";
import ModalISR from "../components/ModalISR";
import ModalBaseImponible from "../components/ModalBaseImponible";

export default function DetallePlanilla({ planilla, empleados, periodos, onVolver }) {
  const [isModalISROpen, setIsModalISROpen] = useState(false);
  const [isModalBaseOpen, setIsModalBaseOpen] = useState(false);
  const pl = planilla;
  const emp = empleados.find(e => e.id === pl.empleado_id);
  const per = periodos.find(p => p.id === pl.periodo_id);

  return (
    <>
      <section className="hero" style={{ height: "150px" }}>
        <div className="overlay">
          <h1 style={{ fontSize: "28px" }}>Detalle de Planilla</h1>
          <p style={{ color: "#ddd" }}>
            {emp ? emp.nombre : "Empleado"} - Período {per ? `${per.mes}/${per.año}` : ""}
          </p>
        </div>
      </section>
      <div style={{ padding: "30px 20px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: "1000px", margin: "auto", background: "white", borderRadius: "16px", padding: "30px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
          <h2 style={{ color: "#d71920", marginBottom: "20px" }}>📋 Desglose completo</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
            <tbody>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>ID Planilla</td><td>{pl.id}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Empleado</td><td>{emp ? emp.nombre : "?"}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Período</td><td>{per ? `${per.mes}/${per.año}` : "?"}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Sueldo base</td><td>${pl.sueldo_base?.toFixed(2)}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Horas extras diurnas</td><td>{pl.horas_extras_diurnas} h → ${pl.monto_horas_extras_diurnas?.toFixed(2)}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Horas extras nocturnas</td><td>{pl.horas_extras_nocturnas} h → ${pl.monto_horas_extras_nocturnas?.toFixed(2)}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Horas nocturnas normales</td><td>{pl.horas_nocturnas} h → ${pl.monto_horas_nocturnas?.toFixed(2)}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Subsidio alimentación</td><td>${pl.subsidio_alimentacion?.toFixed(2)}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Bono extra</td><td>${pl.bono_extra?.toFixed(2)}</td></tr>

              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Monto Vacaciones</td><td>${pl.monto_vacaciones?.toFixed(2)}</td></tr>

              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Aguinaldo</td><td>${pl.monto_aguinaldo?.toFixed(2)}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Aguinaldo Gravado</td><td>${pl.aguinaldo_gravado?.toFixed(2)}</td></tr>

              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>Quincena 25</td><td>${pl.monto_quincena25?.toFixed(2)}</td></tr>

              <tr style={{ borderTop: "2px solid #d71920" }}>
                <td style={{ padding: "8px", fontWeight: "bold", fontSize: "16px" }}>Total Ingresos</td>
                <td style={{ fontWeight: "bold", fontSize: "16px" }}>${pl.total_ingresos?.toFixed(2)}</td>
              </tr>

              <tr>
                <td style={{ padding: "8px", fontWeight: "bold" }}>
                  Monto Cotizable
                  <span
                    style={{
                      marginLeft: "8px",
                      cursor: "pointer",
                      color: "#007bff",
                      fontWeight: "normal",
                      fontSize: "14px",
                    }}
                    onClick={() => setIsModalBaseOpen(true)}
                    title="Ver cómo se calcula la base imponible"
                  >
                    ⓘ
                  </span>
                </td>
                <td>${pl.monto_cotizable?.toFixed(2)}</td>
              </tr>

              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>ISSS (empleado)</td><td>${pl.monto_isss?.toFixed(2)}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>AFP (empleado)</td><td>${pl.monto_afp?.toFixed(2)}</td></tr>
              
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold" }}>
                  ISR (Renta)
                  <span 
                    style={{ 
                      marginLeft: "8px", 
                      cursor: "pointer", 
                      color: "#007bff",
                      fontWeight: "normal",
                      fontSize: "14px",
                      display: "inline-block"
                    }}
                    onClick={() => setIsModalISROpen(true)}
                    title="Ver tabla de descuentos de ISR"
                  >
                    ⓘ
                  </span>
                </td>
                <td>${pl.monto_isr?.toFixed(2)}</td>
              </tr>

              <tr style={{ borderTop: "2px solid #d71920" }}>
                <td style={{ padding: "8px", fontWeight: "bold", fontSize: "16px" }}>Total Deducciones</td>
                <td style={{ fontWeight: "bold", fontSize: "16px" }}>${pl.total_deducciones?.toFixed(2)}</td>
              </tr>

              <tr style={{ borderTop: "2px solid #d71920", background: "#f9f9f9" }}>
                <td style={{ padding: "10px", fontWeight: "bold", fontSize: "18px", color: "#d71920" }}>Neto a Pagar</td>
                <td style={{ fontWeight: "bold", fontSize: "18px", color: "#d71920" }}>${pl.monto_neto?.toFixed(2)}</td>
              </tr>

              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>ISSS Patronal</td><td>${pl.monto_isss_patronal?.toFixed(2)}</td></tr>
              <tr><td style={{ padding: "8px", fontWeight: "bold" }}>AFP Patronal</td><td>${pl.monto_afp_patronal?.toFixed(2)}</td></tr>

              <tr style={{ borderTop: "2px solid #d71920", background: "#fff8f0" }}>
                <td style={{ padding: "10px", fontWeight: "bold", fontSize: "16px", color: "#d71920" }}>
                  💰 Monto a depositar planilla única
                </td>
                <td style={{ fontWeight: "bold", fontSize: "16px", color: "#d71920" }}>
                  ${pl.monto_planilla_unica?.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <button onClick={onVolver} style={{ background: "#6c757d", color: "white", border: "none", padding: "10px 30px", borderRadius: "30px", cursor: "pointer" }}>
              ← Volver a Planillas
            </button>
          </div>
        </div>
      </div>

      <ModalBaseImponible
        isOpen={isModalBaseOpen}
        onClose={() => setIsModalBaseOpen(false)}
        planilla={pl}
      />

      <ModalISR
        isOpen={isModalISROpen}
        onClose={() => setIsModalISROpen(false)}
      />
    </>
  );
}