import React from "react";

import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";
//i18n
import { withNamespaces } from "react-i18next";

// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// actions
import { loginUser, apiError } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo-sm-light.png";
import Label from "reactstrap/lib/Label";
import banner from "../../assets/images/banner.png";
import users_icon from "../../assets/images/users_icon.png";

const Login = (props) => {
  // handleValidSubmit
  function handleValidSubmit(event, values) {
    props.loginUser(values, props.history);
  }
  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2"></i>
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-soft-primary">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">{props.t("Welcome")} </h5>
                        <p>{props.t("Sign in to ECom")}</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0 login-page-gradient">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="65"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="p-2">
                    <AvForm
                      className="form-horizontal"
                      onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v);
                      }}
                    >
                      {props.error && props.error !== "Invalid credentials" ? (
                        <Alert color="danger">{props.t(props.error)}</Alert>
                      ) : null}
                      <div className="mb-3">
                        <AvField
                          name="username"
                          label="Username"
                          placeholder={props.t("Enter Username")}
                          type="text"
                          required
                          errorMessage={props.t("Username cannot be blank")}
                        />
                      </div>
                      <div className="mb-3">
                        <AvField
                          name="pwd"
                          type="password"
                          label="Password"
                          required
                          placeholder={props.t("Enter Password")}
                          errorMessage={props.t("Password cannot be blank")}
                        />
                      </div>
                      <div className="mt-4 d-grid">
                        <button
                          className="btn btn-primary btn-block waves-effect waves-light"
                          type="submit"
                        >
                          {props.t("Login")}
                        </button>
                      </div>
                    </AvForm>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  withNamespaces()(connect(mapStatetoProps, { loginUser, apiError })(Login))
);
