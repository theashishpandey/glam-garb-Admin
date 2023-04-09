import React, { Suspense } from "react";

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

import ltrTheme from "./themes/ltr";

//const OtherComponent = React.lazy(() => import("./themes/rtl"));

//import ltrTheme from "./themes/theme";
// Import scss
//import "./assets/scss/theme-rtl.scss";
// import rtlTheme from "./themes/rtl";
//import ltrTheme from "./themes/ltr";

//const rtlTheme = React.lazy(() => import("./themes/rtl"));
// const ltrTheme = React.lazy(() => import("./themes/ltr"));

// const ThemeSelector = ({ children }) => {
//   const CHOSEN_THEME = localStorage.getItem("themeType")
//     ? localStorage.getItem("themeType")
//     : "rtl";
//   return (
//     <>
//       <React.Suspense fallback={<></>}>
//         {CHOSEN_THEME === "rtl" && <rtlTheme />}
//         {CHOSEN_THEME === "ltr" && <ltrTheme />}
//       </React.Suspense>
//       {children}
//     </>
//   );
// };

const App = (props) => {
  const getLayout = async () => {
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
  };

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
