import React from "react";

export default function ModalBaseImponible({ isOpen, onClose, planilla }) {
  if (!isOpen) return null;

  // Calcular valores para mostrar
  const sueldoBase = planilla.sueldo_base || 0;
  const heDiurnas = planilla.monto_horas_extras_diurnas || 0;
  const heNocturnas = planilla.monto_horas_extras_nocturnas || 0;
  const hrsNocturnas = planilla.monto_horas_nocturnas || 0;
  const vacaciones = planilla.monto_vacaciones || 0;
  const bonoExtra = planilla.bono_extra || 0;
  const aguinaldoGravado = planilla.aguinaldo_gravado || 0;
  const montoCotizable = planilla.monto_cotizable || 0;
  const isss = planilla.monto_isss || 0;
  const afp = planilla.monto_afp || 0;
  const baseImponible = montoCotizable - isss - afp;

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
          maxWidth: "550px",
          width: "90%",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#d71920", textAlign: "center" }}>
          🧮 Cálculo de la Base Imponible
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            marginTop: "15px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                Sueldo base
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                ${sueldoBase.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                + Horas extras diurnas
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                ${heDiurnas.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                + Horas extras nocturnas
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                ${heNocturnas.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                + Horas nocturnas normales
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                ${hrsNocturnas.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                + Vacaciones
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                ${vacaciones.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                + Bono extra
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                ${bonoExtra.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                + Aguinaldo Gravado
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                ${aguinaldoGravado.toFixed(2)}
              </td>
            </tr>
            <tr
              style={{ backgroundColor: "#f9f9f9", fontWeight: "bold" }}
            >
              <td
                style={{
                  padding: "10px",
                  borderBottom: "2px solid #d71920",
                }}
              >
                = Monto Cotizable
              </td>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "2px solid #d71920",
                  textAlign: "right",
                  color: "#d71920",
                }}
              >
                ${montoCotizable.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                − ISSS (3%)
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                −${isss.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                − AFP (7.25%)
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                −${afp.toFixed(2)}
              </td>
            </tr>
            <tr
              style={{ backgroundColor: "#f9f9f9", fontWeight: "bold" }}
            >
              <td
                style={{
                  padding: "10px",
                  borderBottom: "2px solid #d71920",
                }}
              >
                = Base Imponible
              </td>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "2px solid #d71920",
                  textAlign: "right",
                  color: "#d71920",
                }}
              >
                ${baseImponible.toFixed(2)}
              </td>
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
          <strong>💡 Nota:</strong> La base imponible es el monto sobre el cual
          se aplica la tabla de ISR (Renta). Si es menor a $550.00, no se
          descuenta ISR.
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