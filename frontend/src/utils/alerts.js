import Swal from "sweetalert2";

export const confirmarAccion = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true
  }).then((result) => {
    return result.isConfirmed;
  });
};