import React from "react";

export default function Home({ onIrAEmpleados }) {
  return (
    <>
      <section className="hero">
        <div className="overlay">
          <h1>
            Bienvenido, Equipo de Recursos Humanos
            <br />
            <span style={{ fontSize: "28px" }}>Control de Planillas Texaco</span>
          </h1>
        </div>
      </section>
      <section style={{ padding: "40px 20px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "auto", display: "flex", flexWrap: "wrap", gap: "30px", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "280px" }}>
            <h2 style={{ color: "#d71920" }}>Texaco El Salvador</h2>
            <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
              Somos una empresa líder en la distribución de combustibles y lubricantes en El Salvador.
              Con más de 50 años de experiencia, ofrecemos productos de la más alta calidad y un servicio
              excepcional a nuestros clientes.
            </p>
            <p><strong>Misión:</strong> Proveer soluciones energéticas confiables y sostenibles.</p>
            <p><strong>Visión:</strong> Ser la empresa de energía preferida en la región.</p>
          </div>
          <div style={{ flex: 1, minWidth: "280px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <img src="https://c8.alamy.com/comp/2MY81H4/sultan-wa-usa-february-01-2023-texaco-gas-station-illuminated-at-dusk-with-no-people-2MY81H4.jpg" alt="Gasolinera" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
            <img src="https://media.istockphoto.com/id/157192063/es/foto/fillerup.jpg?s=2048x2048&w=is&k=20&c=1EIlqqe8YdV4fVF5agOOmKdttsCedXp13b7U6X03-Ko=" alt="Servicio" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
            <img src="https://media.istockphoto.com/id/1221074504/es/foto/central-de-gas-texaco.jpg?s=2048x2048&w=is&k=20&c=DVn4oWNt4gtTsQwU6SM7HnmdMld9gq58bLofo8BDses=" alt="Combustible" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
            <img src="https://images.unsplash.com/photo-1513828583688-c52646db42da?w=300&h=200&fit=crop" alt="Estación" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
          </div>
        </div>
      </section>
      <section style={{ background: "#efefef", padding: "40px 20px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>Nuestros Servicios</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", maxWidth: "1000px", margin: "auto" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", flex: "1 1 200px" }}>
            <h3>⛽ Combustibles</h3>
            <p>Gasolina, diésel y gas licuado de alta calidad.</p>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", flex: "1 1 200px" }}>
            <h3>🔧 Lubricantes</h3>
            <p>Aceites y grasas para todo tipo de vehículos.</p>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", flex: "1 1 200px" }}>
            <h3>🛠️ Mantenimiento</h3>
            <p>Servicios de mecánica y alineación.</p>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", flex: "1 1 200px" }}>
            <h3>💳 Pagos</h3>
            <p>Aceptamos tarjetas de crédito y aplicaciones móviles.</p>
          </div>
        </div>
      </section>
      <section className="cta">
        <h2>Accede al control de planillas del sistema</h2>
        <button className="cta-btn" onClick={onIrAEmpleados}>Ir a Empleados →</button>
      </section>
    </>
  );
}
