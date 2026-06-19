import React from "react";

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const partes = fecha.split("-");
  const año = partes[0];
  const mes = parseInt(partes[1], 10);
  const dia = partes[2];
  return `${dia}/${meses[mes - 1]}/${año}`;
};

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

  if (!periodoSeleccionado) {
    return (
      <>
        <section className="hero" style={{ height: "200px" }}>
          <div className="overlay">
            <h1 style={{ fontSize: "32px" }}>Planilla Mensual</h1>
            <p style={{ color: "#ddd", marginTop: "8px" }}>
              Selecciona un período para visualizar la planilla consolidada
            </p>
          </div>
        </section>
        <div style={{ padding: "40px 20px", background: "#f5f5f5", textAlign: "center" }}>
          <div style={{ maxWidth: "600px", margin: "auto", background: "white", borderRadius: "12px", padding: "30px" }}>
            <h2>Selecciona un período para ver la planilla mensual</h2>
            <select
              value=""
              onChange={e => setPeriodoSeleccionado(parseInt(e.target.value))}
              style={{
                padding: "10px",
                fontSize: "16px",
                marginTop: "20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%"
              }}
            >
              <option value="">-- Seleccionar período --</option>
              {periodos.map(p => (
                <option key={p.id} value={p.id}>
                  {formatearFecha(p.fecha_corte)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </>
    );
  }

  if (planillasFiltradas.length === 0) {
    return (
      <>
        <section className="hero" style={{ height: "200px" }}>
          <div className="overlay">
            <h1 style={{ fontSize: "32px" }}>Planilla Mensual</h1>
            <p style={{ color: "#ddd", marginTop: "8px" }}>
              {formatearFecha(periodo?.fecha_corte)} - No hay planillas registradas
            </p>
          </div>
        </section>
        <div style={{ padding: "40px 20px", background: "#f5f5f5", textAlign: "center" }}>
          <div style={{ maxWidth: "600px", margin: "auto", background: "white", borderRadius: "12px", padding: "30px" }}>
            <h2>Planilla del período {formatearFecha(periodo?.fecha_corte)}</h2>
            <p>No hay planillas registradas para este período.</p>
            <button
              onClick={() => setPeriodoSeleccionado(null)}
              style={{
                padding: "10px 20px",
                marginTop: "10px",
                cursor: "pointer",
                borderRadius: "8px",
                border: "none",
                background: "#6c757d",
                color: "white"
              }}
            >
              Volver a seleccionar período
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="hero" style={{ height: "200px" }}>
        <div className="overlay">
          <h1 style={{ fontSize: "32px" }}>Planilla Mensual</h1>
          <p style={{ color: "#ddd", marginTop: "8px" }}>
            {formatearFecha(periodo?.fecha_corte)} - Resumen consolidado
          </p>
        </div>
      </section>

      <div style={{ padding: "20px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: "100%", margin: "auto", background: "white", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ color: "#d71920" }}>
              Planilla Mensual - {formatearFecha(periodo?.fecha_corte)}
            </h2>
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

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
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
                  <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Aguinaldo Gravado</th>
                  <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Q.25</th>
                  <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Total Ingresos</th>
                  <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>ISSS</th>
                  <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>AFP</th>
                  <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>ISR</th>
                  <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Total Deducc.</th>
                  <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Neto</th>
                  <th style={{ padding: "8px", textAlign: "center", whiteSpace: "nowrap" }}>Planilla Única</th>
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
                      <td style={{ padding: "8px", textAlign: "right" }}>${pl.aguinaldo_gravado?.toFixed(2)}</td>
                      <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_quincena25?.toFixed(2)}</td>
                      <td style={{ padding: "8px", textAlign: "right", fontWeight: "bold" }}>${pl.total_ingresos?.toFixed(2)}</td>
                      <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_isss?.toFixed(2)}</td>
                      <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_afp?.toFixed(2)}</td>
                      <td style={{ padding: "8px", textAlign: "right" }}>${pl.monto_isr?.toFixed(2)}</td>
                      <td style={{ padding: "8px", textAlign: "right" }}>${pl.total_deducciones?.toFixed(2)}</td>
                      <td style={{ padding: "8px", textAlign: "right", fontWeight: "bold", color: "#d71920" }}>${pl.monto_neto?.toFixed(2)}</td>
                      <td style={{ padding: "8px", textAlign: "right", fontWeight: "bold" }}>${pl.monto_planilla_unica?.toFixed(2)}</td>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}