import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { logoutUser, changeAlignment } from "../../store/actions";
//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";

const Logout = (props) => {
  useEffect(() => {
    let url = process.env.REACT_APP_BASEURL + "adminusers/logout";

    const response = postSubmitForm(url, {});

    if (response && response.status === 1) {
      //localStorage.clear();
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("mobile");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("ro");
      localStorage.removeItem("userToken");
      // localStorage.setItem("lang", "qr");
      // props.changeAlignment("rtl");

      props.history.push("/login");
    } else {
      //localStorage.clear();
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("mobile");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("ro");
      localStorage.removeItem("userToken");
      // localStorage.setItem("lang", "qr");
      // props.changeAlignment("rtl");

      props.history.push("/login");
    }
    //props.logoutUser(props.history);
  }, []);

  return <></>;
};

export default withRouter(
  connect(null, { logoutUser, changeAlignment })(Logout)
);
