import React, { useEffect, useState, useRef } from "react";
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

// import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import { postSubmitForm } from "../../helpers/forms_helper";

const AddUser = (props) => {
  useEffect(() => {
    loadUsers();
    loadEmployees();
   
  }, []);
  const [employees, setEmployees] = useState();
  const loadEmployees = async () => {
    let url = process.env.REACT_APP_BASEURL + "employees/getall";
    const response = await postSubmitForm(url, {});
    if (response && response.status === 1) {
      setEmployees(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }
  const [allUsers, setAllUsers] = useState([]);
  const loadUsers = async () => {
    let url = process.env.REACT_APP_BASEURL + "adminusers/getall";
    const response = await postSubmitForm(url, {});
    if (response && response.status === 1) {
      setAllUsers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };

  
  
  const refContainer = useRef(null);

  const [userFor, setUserFor] = useState();
  const [selectedStore, setSelectedStore] = useState();
  
  const handleValidSubmit = async (e, v) => {
  
    let url = process.env.REACT_APP_BASEURL + "adminusers/insert";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadUsers();
    } else {
      showNotification(response.message, "Error");
    }
    refContainer.current.reset();
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Users")}
            breadcrumbItem={props.t("Add User")}
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
                    <CardTitle>{props.t("Add User")}</CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t("Enter the following details to add a new user")}
                    </CardSubtitle>
                    <Row>
                      <Col lg={6}>
                        <AvField
                          name="employee_id"
                          label={props.t("Employee") + " *"}
                          placeholder={props.t("Enter Employee")}
                          type="select"
                          validate={{ required: { value: true } }}
                          errorMessage={props.t("Select Employee")}
                        >
                          <option value="">
                            -- {props.t("Select Employee")} --
                          </option>
                          {employees &&
                            employees.map((r) => (
                              <option key={r._id} value={r._id}>
                                {r.name}
                              </option>
                            ))}
                        </AvField>
                      </Col>
                      <Col lg={6}>
                        <AvField
                          name="role"
                          label={props.t("Role") + " *"}
                          placeholder={props.t("Enter Role")}
                          type="select"
                          //onChange={handleChange}
                          validate={{ required: { value: true } }}
                          errorMessage={props.t("Select Role")}
                        >
                          <option value="">
                            -- {props.t("Select Role")} --
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
                      
                      

                      <Col lg={6}>
                        <AvField
                          name="username"
                          label={props.t("Username") + " *"}
                          placeholder={props.t("Enter Username")}
                          type="text"
                          errorMessage="Username cannot be empty."
                          validate={{
                            required: { value: true },
                            pattern: {
                              value: "^[0-9a-zA-Z]+$",
                              errorMessage: props.t(
                                "Cannot use space/special characters."
                              ),
                            },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <AvField
                          name="pwd"
                          label={props.t("Password") + " *"}
                          placeholder={props.t("Enter Password")}
                          type="password"
                          // value="123456"
                          // hidden={true}
                          validate={{
                            required: { value: true },
                          }}
                          errorMessage={props.t("Password cannot be empty.")}
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

export default withRouter(connect(null, {})(withNamespaces()(AddUser)));
