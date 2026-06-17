// ========== FUNCIÓN AUXILIAR PARA MANEJAR ERRORES ==========
export const manejarError = (error) => {
  if (error.detail) {
    if (typeof error.detail === "string") {
      return error.detail;
    } else if (Array.isArray(error.detail)) {
      return error.detail.map(err => {
        const campo = err.loc ? err.loc.join('.') : 'campo desconocido';
        return `${campo}: ${err.msg}`;
      }).join('\n');
    }
  }
  if (error.message) return error.message;
  return "Error desconocido";
};
