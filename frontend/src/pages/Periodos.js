import React from "react";

export default function Periodos({
  periodos,
  nuevoPeriodo,
  setNuevoPeriodo,
  periodoCargado,
  crearPeriodo,
  eliminarPeriodo,
  cargarPeriodo,
  limpiarFormularioPeriodo,
  generarProximoPeriodo
}) {
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
          <form onSubmit={crearPeriodo}>
            <input
              type="number"
              placeholder="Mes (1-12)"
              value={nuevoPeriodo.mes}
              onChange={e => setNuevoPeriodo({ ...nuevoPeriodo, mes: parseInt(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Año"
              value={nuevoPeriodo.año}
              onChange={e => setNuevoPeriodo({ ...nuevoPeriodo, año: parseInt(e.target.value) })}
              required
            />
            <input
              type="date"
              placeholder="Fecha corte (YYYY-MM-DD)"
              value={nuevoPeriodo.fecha_corte}
              onChange={e => setNuevoPeriodo({ ...nuevoPeriodo, fecha_corte: e.target.value })}
              required
            />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="submit" style={{ flex: 1 }}>
                {periodoCargado ? "Actualizar Período" : "Guardar Período"}
              </button>
              {periodoCargado && (
                <button type="button" onClick={limpiarFormularioPeriodo} style={{ background: "#666", flex: 1 }}>
                  Cancelar Edición
                </button>
              )}
              <button type="button" onClick={generarProximoPeriodo} style={{ background: "#28a745", flex: 1 }}>
                Generar Próximo Período
              </button>
            </div>
          </form>
          <hr style={{ margin: "30px 0" }} />
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Lista de Períodos</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {periodos.map(per => (
              <li key={per.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee" }}>
                <span><strong>Mes {per.mes}/{per.año}</strong> - Corte: {per.fecha_corte} {per.total_general > 0 && `(Total: $${per.total_general})`}</span>
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
