// src/utils/helpers.js
export const calcularAntiguedad = (fechaIngreso) => {
  if (!fechaIngreso) return 0;
  const ingreso = new Date(fechaIngreso);
  const ahora = new Date();
  const diffMs = ahora - ingreso;
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25); // promedio con bisiestos
  return Math.round(diffYears * 10) / 10; // redondear a 1 decimal
};