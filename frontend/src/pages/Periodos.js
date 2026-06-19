import React from "react";

// Array con nombres de meses en español
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
  // Función para formatear fecha a DD/MesTexto/AAAA
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const partes = fecha.split("-");
    const año = partes[0];
    const mes = parseInt(partes[1], 10);
    const dia = partes[2];
    return `${dia}/${meses[mes - 1]}/${año}`;
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

          <form onSubmit={periodoCargado ? actualizarPeriodo : crearPeriodo}>
            {/* Fecha de corte */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Fecha de corte
              </label>
              <input
                type="date"
                value={nuevoPeriodo.fecha_corte || ''}
                onChange={e => setNuevoPeriodo({ ...nuevoPeriodo, fecha_corte: e.target.value })}
                required
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            {/* Descripción (opcional) */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Descripción (opcional)
              </label>
              <input
                type="text"
                placeholder=""
                value={nuevoPeriodo.descripcion || ''}
                onChange={e => setNuevoPeriodo({ ...nuevoPeriodo, descripcion: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>

            {/* Botones */}
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
            {periodos.map(per => (
              <li key={per.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee" }}>
                <span>
                  <strong>{formatearFecha(per.fecha_corte)}</strong>
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
            ))}
          </ul>
          

        </div>
      </div>
    </>
  );
}