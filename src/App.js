import React, { useEffect } from "react";

import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"; //userRoutes

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import i18n from "./i18n";

//import ltrTheme from "./themes/rtl";

// Import scss
//import "./assets/scss/theme.scss";

const App = (props) => {
  useEffect(() => {
    console.log(props.layout.alignment);
    if (localStorage.getItem("lang") === null) {
      localStorage.setItem(
        "lang",
        props.layout.alignment === "rtl" ? "qr" : "eng"
      );
      i18n.changeLanguage(props.layout.alignment === "rtl" ? "qr" : "eng");
      if (props.layout.alignment === "rtl") {
        import("./themes/rtl").then((module) => {
          module.default();
        });
      } else if (props.layout.alignment === "ltr") {
        import("./themes/ltr").then((module) => {
          module.default();
        });
      }
    } else {
      if (localStorage.getItem("lang") === "eng") {
        import("./themes/ltr").then((module) => {
          module.default();
        });
      } else if (localStorage.getItem("lang") === "qr") {
        import("./themes/rtl").then((module) => {
          module.default();
        });
      }
      i18n.changeLanguage(localStorage.getItem("lang"));
    }
  }, [props.layout.alignment]);
  function getLayout() {
    let layoutCls = VerticalLayout;

    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout();

  const NonAuthmiddleware = ({ component: Component, layout: Layout }) => (
    <Route
      render={(props) => {
        return (
          <Layout>
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );

  return (
    <React.Fragment>
      <Router>
        <Switch>
          {authRoutes.map((route, idx) => (
            <NonAuthmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
            />
          ))}

          {props.loginState.userRoutes
            ? props.loginState.userRoutes.map((route, idx) => (
                <Authmiddleware
                  path={route.path}
                  layout={Layout}
                  component={route.component}
                  key={idx}
                />
              ))
            : userRoutes.map((route, idx) => (
                <Authmiddleware
                  path={route.path}
                  layout={Layout}
                  component={route.component}
                  key={idx}
                />
              ))}
        </Switch>
      </Router>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
    loginState: state.Login,
  };
};

export default connect(mapStateToProps, null)(App);
