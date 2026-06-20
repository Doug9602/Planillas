import React from "react";

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
  // Función para obtener el último día del mes
  const obtenerUltimoDia = (mes, año) => {
    if (!mes || !año) return "";
    return new Date(año, mes, 0).getDate();
  };

  // Manejar cambio de mes o año
  const handleMesChange = (e) => {
    const mes = parseInt(e.target.value);
    const año = nuevoPeriodo.año || new Date().getFullYear();
    const ultimoDia = obtenerUltimoDia(mes, año);
    const fechaCorte = `${año}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;
    setNuevoPeriodo({
      ...nuevoPeriodo,
      mes: mes,
      fecha_corte: fechaCorte
    });
  };

  const handleAñoChange = (e) => {
    const año = parseInt(e.target.value);
    const mes = nuevoPeriodo.mes || 1;
    const ultimoDia = obtenerUltimoDia(mes, año);
    const fechaCorte = `${año}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;
    setNuevoPeriodo({
      ...nuevoPeriodo,
      año: año,
      fecha_corte: fechaCorte
    });
  };

  // Generar años para el select (desde 2020 hasta 2030)
  const añoActual = new Date().getFullYear();
  const años = Array.from({ length: 11 }, (_, i) => añoActual - 5 + i);

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
            {/* Fila: Mes y Año */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Mes</label>
                <select
                  value={nuevoPeriodo.mes || ""}
                  onChange={handleMesChange}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                >
                  <option value="">Seleccione mes</option>
                  {meses.map((nombre, index) => (
                    <option key={index + 1} value={index + 1}>
                      {nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>Año</label>
                <select
                  value={nuevoPeriodo.año || ""}
                  onChange={handleAñoChange}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd" }}
                >
                  <option value="">Seleccione año</option>
                  {años.map((año) => (
                    <option key={año} value={año}>
                      {año}
                    </option>
                  ))}
                </select>
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
            {periodos.map(per => {
              const fecha = new Date(per.fecha_corte);
              const dia = fecha.getDate();
              const mes = meses[fecha.getMonth()];
              const año = fecha.getFullYear();
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