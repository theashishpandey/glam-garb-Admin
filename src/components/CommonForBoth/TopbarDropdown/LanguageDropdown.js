import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { connect } from "react-redux";

//i18n
//import i18n from "../../../i18n";
import { withNamespaces } from "react-i18next";

// falgs
import usFlag from "../../../assets/images/flags/us.jpg";
import qatar from "../../../assets/images/flags/qatar.jpg";
// import germany from "../../../assets/images/flags/germany.jpg";
// import italy from "../../../assets/images/flags/italy.jpg";
// import russia from "../../../assets/images/flags/russia.jpg";

// actions
import { changeAlignment } from "../../../store/actions";
const LanguageDropdown = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const [flag, setFlag] = useState(qatar);
  const [lng, setLng] = useState("Arabic");

  function changeLanguageAction(lng) {
    //set language as i18n

    //i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    if (lng === "qr") {
      props.changeAlignment("rtl");
      setFlag(qatar);
      setLng("Arabic");
    } else if (lng === "eng") {
      props.changeAlignment("ltr");
      setFlag(usFlag);
      setLng("English");
    }
    window.location.reload();
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle className="btn header-item waves-effect" tag="button">
          <img
            src={
              localStorage.getItem("lang") === null
                ? flag
                : localStorage.getItem("lang") === "eng"
                ? usFlag
                : flag
            }
            alt="Sales Management"
            height="16"
            className="mr-1"
          />
          <span className="align-middle">
            {localStorage.getItem("lang") === null
              ? lng
              : localStorage.getItem("lang") === "eng"
              ? "English"
              : "Arabic"}
          </span>
        </DropdownToggle>
        <DropdownMenu className="language-switch" right>
          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction("qr")}
            className="notify-item"
          >
            <img src={qatar} alt="Qatar" className="mr-1" height="12" />
            <span className="align-middle">Arabic</span>
          </DropdownItem>
          <DropdownItem
            tag="a"
            href="#"
            onClick={() => changeLanguageAction("eng")}
            className="notify-item"
          >
            <img src={usFlag} alt="USA" className="mr-1" height="12" />
            <span className="align-middle">English</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, { changeAlignment })(
  withNamespaces()(LanguageDropdown)
);
