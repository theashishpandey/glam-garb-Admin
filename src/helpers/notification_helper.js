import React from "react";
import swal from "sweetalert2";

const showNotification = (message, type) => {
  if (type === "Success" || type === "نجاح")
    swal.fire(type, message, "success");
  else swal.fire(type, message, "error");
};
export { showNotification };
