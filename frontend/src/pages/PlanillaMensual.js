import React from "react";

export default function PlanillaMensual({
  periodos,
  empleados,
  planillas,
  periodoSeleccionado,
  setPeriodoSeleccionado,
  onVerDetalle
}) {
  const planillasFiltradas = planillas.filter(p => p.periodo_id === periodoSeleccionado);
  const periodo = periodos.find(p => p.id === periodoSeleccionado);

  // --- Función para calcular totales ---
  const calcularTotales = () => {
    if (planillasFiltradas.length === 0) return null;

    const totales = {
      sueldo_base: 0,
      horas_extras_diurnas: 0,
      monto_horas_extras_diurnas: 0,
      horas_extras_nocturnas: 0,
      monto_horas_extras_nocturnas: 0,
      horas_nocturnas: 0,
      monto_horas_nocturnas: 0,
      subsidio_alimentacion: 0,
      bono_extra: 0,
      monto_vacaciones: 0,
      monto_aguinaldo: 0,
      monto_quincena25: 0,
      total_ingresos: 0,
      monto_isss: 0,
      monto_afp: 0,
      monto_isr: 0,
      total_deducciones: 0,
      monto_neto: 0
    };

    planillasFiltradas.forEach(pl => {
      totales.sueldo_base += pl.sueldo_base || 0;
      totales.horas_extras_diurnas += pl.horas_extras_diurnas || 0;
      totales.monto_horas_extras_diurnas += pl.monto_horas_extras_diurnas || 0;
      totales.horas_extras_nocturnas += pl.horas_extras_nocturnas || 0;
      totales.monto_horas_extras_nocturnas += pl.monto_horas_extras_nocturnas || 0;
      totales.horas_nocturnas += pl.horas_nocturnas || 0;
      totales.monto_horas_nocturnas += pl.monto_horas_nocturnas || 0;
      totales.subsidio_alimentacion += pl.subsidio_alimentacion || 0;
      totales.bono_extra += pl.bono_extra || 0;
      totales.monto_vacaciones += pl.monto_vacaciones || 0;
      totales.monto_aguinaldo += pl.monto_aguinaldo || 0;
      totales.monto_quincena25 += pl.monto_quincena25 || 0;
      totales.total_ingresos += pl.total_ingresos || 0;
      totales.monto_isss += pl.monto_isss || 0;
      totales.monto_afp += pl.monto_afp || 0;
      totales.monto_isr += pl.monto_isr || 0;
      totales.total_deducciones += pl.total_deducciones || 0;
      totales.monto_neto += pl.monto_neto || 0;
    });

    return totales;
  };

  const totales = calcularTotales();

  // Formatear fecha y hora para impresión
  const ahora = new Date();
  const fechaImpresion = ahora.toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const horaImpresion = ahora.toLocaleTimeString('es-SV', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // ===== RENDERIZADO =====
  if (!periodoSeleccionado) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Selecciona un período para ver la planilla mensual</h2>
        <select
          value=""
          onChange={e => setPeriodoSeleccionado(parseInt(e.target.value))}
          style={{ padding: "10px", fontSize: "16px", marginTop: "20px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option value="">-- Seleccionar período --</option>
          {periodos.map(p => (
            <option key={p.id} value={p.id}>
              {p.mes}/{p.año} (corte {p.fecha_corte})
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (planillasFiltradas.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Planilla del período {periodo?.mes}/{periodo?.año}</h2>
        <p>No hay planillas registradas para este período.</p>
        <button
          onClick={() => setPeriodoSeleccionado(null)}
          style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer", borderRadius: "8px", border: "none", background: "#6c757d", color: "white" }}
        >
          Volver a seleccionar período
        </button>
      </div>
    );
  }

  // Función para imprimir
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      <div style={{ maxWidth: "100%", margin: "auto", background: "white", borderRadius: "12px", padding: "20px" }}>
        
        {/* Encabezado visible en pantalla y en impresión */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <h2 style={{ color: "#d71920" }}>
            Planilla Mensual - {periodo?.mes}/{periodo?.año}
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handlePrint}
              style={{
                padding: "8px 20px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              🖨️ Imprimir
            </button>
            <button
              onClick={() => setPeriodoSeleccionado(null)}
              style={{
                padding: "8px 20px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Cambiar Período
            </button>
          </div>
        </div>

        {/* Encabezado para impresión (solo visible al imprimir) */}
        <div className="print-header" style={{ display: "none", textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "24px", margin: 0, color: "#000" }}>TEXACO EL SALVADOR</h1>
          <p style={{ fontSize: "16px", margin: "4px 0", color: "#000" }}>
            Planilla Mensual - {periodo?.mes}/{periodo?.año}
          </p>
          <p style={{ fontSize: "12px", color: "#555", margin: "2px 0" }}>
            Fecha de impresión: {fechaImpresion} - Hora: {horaImpresion}
          </p>
          <hr style={{ border: "1px solid #000", margin: "10px 0" }} />
        </div>

        <div style={{ overflowX: "auto" }} className="print-table-container">
          <table className="print-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Empleado</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Sueldo Base</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>HE Diurnas</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Monto HE D</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>HE Nocturnas</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Monto HE N</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Hrs Nocturnas</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Monto Hrs Noc</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Subsidio</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Bono</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Vacaciones</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Aguinaldo</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Q.25</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Total Ingresos</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>ISSS</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>AFP</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>ISR</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Total Deducc.</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Neto</th>
                <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planillasFiltradas.map(pl => {
                const emp = empleados.find(e => e.id === pl.empleado_id);
                return (
                  <tr key={pl.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px", textAlign: "center", fontWeight: "500" }}>{emp ? emp.nombre : "?"}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.sueldo_base?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{pl.horas_extras_diurnas ?? 0}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_horas_extras_diurnas?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{pl.horas_extras_nocturnas ?? 0}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_horas_extras_nocturnas?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{pl.horas_nocturnas ?? 0}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_horas_nocturnas?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.subsidio_alimentacion?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.bono_extra?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_vacaciones?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_aguinaldo?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_quincena25?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right", fontWeight: "bold" }}>${pl.total_ingresos?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_isss?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_afp?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_isr?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>${pl.total_deducciones?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "right", fontWeight: "bold", color: "#d71920" }}>${pl.monto_neto?.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <button
                        onClick={() => onVerDetalle(pl.id)}
                        style={{
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Detalle
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* ===== FILA DE TOTALES ===== */}
              {totales && (
                <tr style={{ borderTop: "3px solid #d71920", fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td style={{ padding: "8px", textAlign: "center", fontSize: "14px", color: "#d71920" }}>
                    <strong>Totales del período</strong>
                  </td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.sueldo_base.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>{totales.horas_extras_diurnas.toFixed(1)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.monto_horas_extras_diurnas.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>{totales.horas_extras_nocturnas.toFixed(1)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.monto_horas_extras_nocturnas.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>{totales.horas_nocturnas.toFixed(1)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.monto_horas_nocturnas.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.subsidio_alimentacion.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.bono_extra.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.monto_vacaciones.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.monto_aguinaldo.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.monto_quincena25.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right", fontWeight: "bold", fontSize: "14px" }}>
                    ${totales.total_ingresos.toFixed(2)}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.monto_isss.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.monto_afp.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.monto_isr.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>${totales.total_deducciones.toFixed(2)}</td>
                  <td style={{ padding: "8px", textAlign: "right", fontWeight: "bold", fontSize: "14px", color: "#d71920" }}>
                    ${totales.monto_neto.toFixed(2)}
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}