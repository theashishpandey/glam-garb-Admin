import React, { useEffect, useState } from "react";
//i18n
import { withNamespaces } from "react-i18next";
import exportFromJSON from "export-from-json";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button
} from "reactstrap";
import swal from "sweetalert2";

import { AvForm, AvField } from "availity-reactstrap-validation";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { postSubmitForm } from "../../helpers/forms_helper";

// actions
import { loadEmployees } from "../../store/actions";

const AllEmployees = (props) => {
  const { SearchBar } = Search;

  useEffect(() => {
    props.loadEmployees();
  }, []);

  const handleEmployeeStatusUpdate = async (employee) => {
    let url = process.env.REACT_APP_BASEURL + "employees/activate_deactivate";
    const response = await postSubmitForm(url, {
      id: employee._id,
      is_active: !employee.is_active,
    });
    if (response && response.status === 1) {
      props.loadEmployees();
    } else {
      showNotification(response.message, "Error");
    }
  };
  function showStatusFormatter(cell, row) {
    return (
      <>
        <div className="custom-control custom-switch mb-2" dir="ltr">
          <input
            type="checkbox"
            title="Click to change status."
            className="custom-control-input"
            id={"customSwitch1" + row._id}
            checked={row.is_active}
          />
          <label
            title="Click to change status."
            className="custom-control-label"
            htmlFor={"customSwitch1" + row._id}
            style={{ "font-weight": "100", cursor: "pointer" }}
            onClick={() => {
              handleEmployeeStatusUpdate(row);
            }}
          ></label>
        </div>

        {row.is_active ? (
          <span class="font-size-12 badge-soft-success badge badge-success badge-pill">
            Active
          </span>
        ) : (
          <span class="font-size-12 badge-soft-danger badge badge-danger badge-pill">
            Inactive
          </span>
        )}
      </>
    );
  }
  const [editModal, setEditModal] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState();
  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-edit font-size-15"
          title="Click to Edit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModal(!editModal);
            setSelectedEmployee(row);
          }}
        ></i>
      </span>
    );
  }
  function showNotification(message, type) {
    var title = type;
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }
  const handleValidUpdate = async (e, v) => {
    v.id = selectedEmployee._id;
    let url = process.env.REACT_APP_BASEURL + "employees/update";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      props.loadEmployees();
      setEditModal(!editModal);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const columns = [
    {
      dataField: "_id",
      hidden: true,
    },
    {
      text: props.t("Code"),
      dataField: "code",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
    {
      text: props.t("Name"),
      dataField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
    },
    {
      dataField: "designation",
      text: props.t("Designation"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },
    {
      dataField: "mobile",
      text: props.t("Mobile"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },
    {
      dataField: "email",
      text: props.t("Email"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "22%" };
      },
    },
    {
      text: props.t("Status"),
      formatter: showStatusFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      text: props.t("Action"),
      formatter: editFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
  ];

  const handleDownload = () => {
    const fileName = "employees";
    const exportType = "xls";
    if (props.employees) {
      var data = JSON.parse(JSON.stringify(props.employees));
      data.forEach(function (v) {
        delete v.is_active;
        delete v._id;
        delete v.createdAt;
        delete v.updatedAt;
        delete v.__v;
        delete v.image_url;
      });
      console.log(data);
      exportFromJSON({ data, fileName, exportType });
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Employees")}
            breadcrumbItem={props.t("All Employees")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Employees")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing employees here")}
                  </CardSubtitle>
                  <Row className="mb-2">
                    <Col sm="4">
                      <Button
                        type="submit"
                        className="btn btn-sm btn-secondary"
                        onClick={handleDownload}
                      >
                        <i className="mdi mdi-file-export"></i>{" "}
                        {props.t("Export CSV")}
                      </Button>
                      <div className="search-box mr-2 mb-2 d-inline-block">
                        <div className="position-relative"></div>
                      </div>
                    </Col>
                  </Row>
                  <ToolkitProvider
                    bootstrap4
                    keyField="_id"
                    data={props.employees && props.employees}
                    columns={columns}
                    noDataIndication={props.t("No data to display.")}
                    search
                  >
                    {(props) => (
                      <div>
                        <SearchBar
                          {...props.searchProps}
                          style={{ width: "300px" }}
                        />

                        <BootstrapTable
                          striped
                          hover
                          condensed
                          {...props.baseProps}
                        />
                      </div>
                    )}
                  </ToolkitProvider>

                  <Modal
                    size="lg"
                    isOpen={editModal}
                    toggle={() => setEditModal(!editModal)}
                  >
                    <ModalHeader toggle={() => setEditModal(!editModal)}>
                      Employee Name: {selectedEmployee && selectedEmployee.name}
                    </ModalHeader>
                    <ModalBody>
                      {selectedEmployee && (
                        <>
                          <Row>
                            <Col lg={12}>
                              <Card>
                                <CardBody>
                                  <AvForm
                                    onValidSubmit={(e, v) => {
                                      handleValidUpdate(e, v);
                                    }}
                                  >
                                    <Row>
                                      <Col lg={6}>
                                        <AvField
                                          name="name"
                                          value={selectedEmployee.name}
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
                                          name="mobile"
                                          value={selectedEmployee.mobile}
                                          label={props.t("Mobile") + " *"}
                                          placeholder={props.t("Enter Mobile")}
                                          errorMessage="Mobile cannot be empty."
                                          type="text"
                                          validate={{
                                            required: { value: true },
                                            pattern: {
                                              value: "^[0-9]+$",
                                              errorMessage: props.t(
                                                "Only numbers are allowed."
                                              ),
                                            },
                                            maxLength: {
                                              value: 10,
                                              errorMessage: props.t(
                                                "Enter valid mobile."
                                              ),
                                            },
                                            minLength: {
                                              value: 10,
                                              errorMessage: props.t(
                                                "Enter valid mobile."
                                              ),
                                            },
                                          }}
                                        />
                                      </Col>

                                      <Col lg={6}>
                                        <AvField
                                          name="email"
                                          value={selectedEmployee.email}
                                          label={props.t("Email")}
                                          placeholder={props.t("Enter Email")}
                                          errorMessage={props.t(
                                            "Please enter valid email."
                                          )}
                                          type="email"
                                        />
                                      </Col>
                                      <Col lg={6}>
                                        {" "}
                                        <AvField
                                          name="designation"
                                          label={props.t("Designation") + " *"}
                                          type="select"
                                          //value={selectedEmployee.designation}
                                          value={selectedEmployee.designation}
                                          validate={{
                                            required: { value: true },
                                          }}
                                          errorMessage={props.t(
                                            "Select Designation"
                                          )}
                                        >
                                          <option value="">
                                            -- {props.t("Select Designation")}{" "}
                                            --
                                          </option>
                                          <option value="Manager">
                                            {props.t("Manager")}
                                          </option>
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
                                              {props.t("Update")}
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
                        </>
                      )}
                    </ModalBody>
                  </Modal>
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
    loadEmployees,
  })(withNamespaces()(AllEmployees))
);
