import React, { useEffect } from "react";
import { withNamespaces } from "react-i18next";
import swal from "sweetalert2";

const ShowNotification1 = (props) => {
  const { t, tReady } = props;
  console.log(props);
  const showNotification = (message, type) => {
    if (type === "Success" || type === "نجاح")
      swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  };
  useEffect(() => {
    console.log("helo");
    showNotification(props.type, props.message);
  }, []);
  return (
    <div>
      <h1>keyFromDefault</h1>
      <p>
        {t("Password updated successfully.", {
          /* options t options */
        })}
      </p>
      {showNotification(props.type, props.message)}
    </div>
  );
};
export default withNamespaces()(ShowNotification1);

var showNot_from_saga = function (message, type) {
  console.log(message);
  return (
    <React.Fragment>
      <ShowNotification1 type={type} message={message}></ShowNotification1>
    </React.Fragment>
  );
};

export { showNot_from_saga };

// export { showNotification };

// const showNotification = (message, type) => {
//   if (type === "Success" || type === "نجاح")
//     swal.fire(type, message, "success");
//   else swal.fire(type, message, "error");
// };
