import React, { useRef } from "react";
//i18n
import { withNamespaces } from "react-i18next";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  CardTitle,
  Container,
} from "reactstrap";

import { AvForm, AvField } from "availity-reactstrap-validation";
// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../components/Common/Breadcrumb";

// actions
import { changePassword } from "../store/actions";

const ChangePassword = (props) => {
  const refContainer = useRef(null);
  function handleValidSubmit(e, v) {
    props.changePassword(v, props.history);
    refContainer.current.reset();
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("User Profile")}
            breadcrumbItem={props.t("Change Password")}
          />
          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle>{props.t("Change Password")}</CardTitle>

                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidSubmit(e, v);
                    }}
                    ref={refContainer}
                  >
                    <Row>
                      <Col lg={12}>
                        <AvField
                          name="oldpwd"
                          label={props.t("Old Password") + " *"}
                          placeholder={props.t("Enter Old Password")}
                          type="text"
                          required={true}
                          errorMessage={props.t("Old password cannot be empty")}
                        />
                        <AvField
                          name="newpwd"
                          label={props.t("New Password") + " *"}
                          placeholder={props.t("Enter New Password")}
                          type="text"
                          validate={{
                            required: { value: true },
                            // minLength: {
                            //   value: 5,
                            //   errorMessage: props.t("Min 5 chars."),
                            // },
                            // maxLength: {
                            //   value: 12,
                            //   errorMessage: props.t("Max 12 chars."),
                            // },
                          }}
                          errorMessage={props.t("New password cannot be empty")}
                        />
                        <FormGroup className="mb-0">
                          <div>
                            <Button
                              type="submit"
                              color="primary"
                              className="mr-1"
                            >
                              {props.t("Submit")}
                            </Button>{" "}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </AvForm>
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
  const { error, message, message_type } = state.Login;
  return { error, message, message_type };
};
export default withRouter(
  connect(mapStatetoProps, {
    changePassword,
  })(withNamespaces()(ChangePassword))
);
