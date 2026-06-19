import React from "react";

export default function ModalISR({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "90%",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#d71920", textAlign: "center" }}>
          📊 Tabla de ISR (Renta) - El Salvador
        </h3>
        <p style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
          Tramos mensuales vigentes (base imponible)
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Desde (USD)
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Hasta (USD)
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Cuota Fija
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                % Excedente
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$0.01</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$550.00</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$0.00</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>0%</td>
            </tr>
            <tr style={{ backgroundColor: "#f9f9f9" }}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$550.01</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$895.24</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$17.67</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>10%</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$895.25</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$2,038.10</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$60.00</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>20%</td>
            </tr>
            <tr style={{ backgroundColor: "#f9f9f9" }}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$2,038.11</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>∞</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>$288.57</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>30%</td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#856404",
          }}
        >
          <strong>💡 Nota:</strong> El ISR se calcula sobre la base imponible (
          monto cotizable - ISSS - AFP). Estos tramos aplican para ingresos
          mensuales. Verificar actualizaciones según ley vigente.
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#d71920",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}