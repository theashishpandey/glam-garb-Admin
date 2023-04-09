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
  CardSubtitle,
  Container,
} from "reactstrap";
import swal from "sweetalert2";

import { AvForm, AvField } from "availity-reactstrap-validation";
// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { postSubmitForm } from "../../helpers/forms_helper";

const AddStore = (props) => {
  const refContainer = useRef(null);

  const handleValidSubmit = async (e, v) => {
    let url = process.env.REACT_APP_BASEURL + "stores/insert";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      refContainer.current.reset();
    } else {
      showNotification(response.message, "Error");
    }
  };
  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Stores")}
            breadcrumbItem={props.t("Add Store")}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidSubmit(e, v);
                    }}
                    ref={refContainer}
                  >
                    <CardTitle>{props.t("Add Store")}</CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t(
                        "Enter the following details to add a new store"
                      )}
                    </CardSubtitle>
                    <Row>
                      <Col lg={6}>
                        <AvField
                          name="code"
                          label={props.t("Store Code") + " *"}
                          placeholder={props.t("Enter Code")}
                          type="text"
                          errorMessage="Code cannot be empty."
                          validate={{
                            required: { value: true },
                            pattern: {
                              value: "^[a-zA-Z0-9_]*$",
                              errorMessage: props.t(
                                "Special characters and space is not allowed."
                              ),
                            },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <AvField
                          name="name"
                          label={props.t("Name") + " *"}
                          placeholder={props.t("Enter Name")}
                          type="text"
                          errorMessage="Name cannot be empty."
                          validate={{
                            required: { value: true },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <AvField
                          name="tax_registration_number"
                          label={props.t("Tax Reg. Number") + " *"}
                          placeholder={props.t("Enter Tax Reg. Number")}
                          type="text"
                          errorMessage="Tax reg. number cannot be empty."
                          validate={{
                            required: { value: true },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <AvField
                          name="mobile"
                          label={props.t("Mobile") + " *"}
                          placeholder={props.t("Enter Mobile")}
                          type="text"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: props.t("Mobile cannot be empty."),
                            },
                            pattern: {
                              value: "^[0-9]+$",
                              errorMessage: props.t(
                                "Only numbers are allowed."
                              ),
                            },
                            maxLength: {
                              value: 11,
                              errorMessage: props.t("Enter valid mobile."),
                            },
                            minLength: {
                              value: 11,
                              errorMessage: props.t("Enter valid mobile."),
                            },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <AvField
                          name="phone"
                          label={props.t("Phone") + " *"}
                          placeholder={props.t("Enter Phone")}
                          type="text"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: props.t("Phone cannot be empty."),
                            },
                            pattern: {
                              value: "^[0-9]+$",
                              errorMessage: props.t(
                                "Only numbers are allowed."
                              ),
                            },
                            maxLength: {
                              value: 12,
                              errorMessage: props.t("Enter valid phone."),
                            },
                            minLength: {
                              value: 12,
                              errorMessage: props.t("Enter valid phone."),
                            },
                          }}
                        />
                      </Col>

                      <Col lg={6}>
                        <AvField
                          name="email"
                          label={props.t("Email")}
                          placeholder={props.t("Enter Email")}
                          errorMessage={props.t("Please enter valid email.")}
                          type="email"
                        />
                      </Col>

                      <Col lg={6}>
                        <AvField
                          name="address"
                          label={props.t("Address")}
                          placeholder={props.t("Enter Address")}
                          type="textarea"
                        />
                      </Col>

                      <Col lg={6}>
                        <AvField
                          name="pincode"
                          label={props.t("Pincode")}
                          placeholder={props.t("Enter Pincode")}
                          type="text"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: props.t("Pincode cannot be empty."),
                            },
                            pattern: {
                              value: "^[a-zA-Z0-9_]",
                              errorMessage: props.t(
                                "Pincode require 6 characters."
                              ),
                            },

                            maxLength: {
                              value: 6,
                              errorMessage: props.t(
                                "Pincode require 6 characters."
                              ),
                            },
                            minLength: {
                              value: 6,
                              errorMessage: props.t(
                                "Pincode require 6 characters."
                              ),
                            },
                          }}
                        />
                      </Col>

                      <Col lg={12}>
                        <hr />
                        <FormGroup className="mb-0 text-center">
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
export default withRouter(connect(null, {})(withNamespaces()(AddStore)));
