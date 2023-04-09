import React, { useEffect, useRef } from "react";
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

// actions
import { submitEmployee, loadEmployees } from "../../store/actions";

const AddEmployee = (props) => {
  const refContainer = useRef(null);
  useEffect(() => {
    props.loadEmployees();
  }, []);

  const handleValidSubmit = async (e, v) => {

    let url = process.env.REACT_APP_BASEURL + "employees/insert";
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
            title={props.t("Employees")}
            breadcrumbItem={props.t("Add Employee")}
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
                    <CardTitle>{props.t("Add Employee")}</CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t(
                        "Enter the following details to add a new employee"
                      )}
                    </CardSubtitle>
                    <Row>
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
                      <Col lg={3}>
                        <AvField
                          name="code"
                          label={props.t("Code") + " *"}
                          placeholder={props.t("Enter Employee Code")}
                          type="text"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: props.t("Code cannot be empty."),
                            },
                            pattern: {
                              value: "^[0-9]+$",
                              errorMessage: props.t(
                                "Only numbers are allowed."
                              ),
                            },
                            maxLength: {
                              value: 6,
                              errorMessage: props.t("Enter valid code."),
                            },
                          }}
                        />
                      </Col>
                      <Col lg={3}>
                        <AvField
                          name="mobile"
                          label={props.t("Mobile") + " *"}
                          placeholder={props.t("Enter Mobile")}
                          type="mobile"
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
                              value: 10,
                              errorMessage: props.t("Enter valid mobile."),
                            },
                            minLength: {
                              value: 10,
                              errorMessage: props.t("Enter valid mobile."),
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
                          name="designation"
                          label={props.t("Designation") + " *"}
                          type="select"
                          validate={{ required: { value: true } }}
                          errorMessage={props.t("Select Designation")}
                        >
                          <option value="">
                            -- {props.t("Select Designation")} --
                          </option>
                          <option value="Manager">{props.t("Manager")}</option>
                          <option value="Accountant">
                            {props.t("Accountant")}
                          </option>
                          <option value="Sales Representative">
                            {props.t("Sales Representative")}
                          </option>
                          <option value="Sales Executive">
                            {props.t("Sales Executive")}
                          </option>
                        </AvField>
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
const mapStatetoProps = (state) => {
  const { error, message, message_type, employees } = state.Employees;
  return { error, message, message_type, employees };
};
export default withRouter(
  connect(mapStatetoProps, {
    submitEmployee,
    loadEmployees,
  })(withNamespaces()(AddEmployee))
);
