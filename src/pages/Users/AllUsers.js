import React, { useEffect, useState } from "react";
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
  Modal,
  ModalHeader,
  ModalBody,
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

import { postSubmitForm } from "../../helpers/forms_helper";

const AllUsers = (props) => {
  useEffect(() => {
    loadUsers();
    loadStores();
    loadWarehouses();
  }, []);
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
  const [allStores, setAllStores] = useState([]);
  const loadStores = async () => {
    let url = process.env.REACT_APP_BASEURL + "stores/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllStores(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  const [allWarehouses, setAllWarehouses] = useState([]);
  const loadWarehouses = async () => {
    let url = process.env.REACT_APP_BASEURL + "warehouses/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllWarehouses(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }
  const handleUserStatusUpdate = async (user) => {
    let url = process.env.REACT_APP_BASEURL + "adminusers/activate_deactivate";
    const response = await postSubmitForm(url, {
      username: user.username,
      is_active: !user.is_active,
    });
    if (response && response.status === 1) {
      loadUsers();
    } else {
      showNotification(response.message, "Error");
    }
  };

  const [userFor, setUserFor] = useState();
  const [selectedStore, setSelectedStore] = useState();
  const [selectedWarehouse, setSelectedWarehouse] = useState();
  const handleUpdateUser = async (e, v) => {
    let url = process.env.REACT_APP_BASEURL + "adminusers/update";
    const data_to_send = {
      username: selectedUser.username,
      role: v.role,
      user_for: userFor,
      store_warehouse_details:
        userFor === "Store" ? selectedStore : selectedWarehouse,
    };
    console.log(data_to_send);
    const response = await postSubmitForm(url, data_to_send);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      setRoleModal(false);
      loadUsers();
    } else {
      showNotification(response.message, "Error");
    }
  };
  const [passwordModal, setPasswordModal] = useState(false);
  const handleResetPassword = async (e, v) => {
    let url = process.env.REACT_APP_BASEURL + "adminusers/resetpassword";
    const data_to_send = {
      username: selectedUser.username,
      newpwd: v.password,
    };
    const response = await postSubmitForm(url, data_to_send);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      setPasswordModal(false);
      loadUsers();
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
              handleUserStatusUpdate(row);
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
  const [roleModal, setRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  const columns = [
    {
      dataField: "_id",
      hidden: true,
    },
    {
      text: props.t("Username"),
      dataField: "username",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      text: props.t("Name"),
      dataField: "employee_details.name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      dataField: "employee_details.mobile",
      text: props.t("Mobile"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "employee_details.designation",
      text: props.t("Designation"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      dataField: "role",
      text: props.t("Role"),
      sort: false,

      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
   

    {
      dataField: "",
      text: props.t("Actions"),
      sort: false,
      formatter: (cell, row) => {
        return (
          <>
            <i
              className="mdi mdi-lock-open-alert font-size-20 mr-2"
              title="Reset Password"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPasswordModal(!passwordModal);
                setSelectedUser(row);
              }}
            ></i>
           
          </>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
    {
      text: props.t("Status"),
      formatter: showStatusFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Users")}
            breadcrumbItem={props.t("All Users")}
          />

          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("Existing Users")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing users here")}
                  </CardSubtitle>
                  <BootstrapTable
                    bootstrap4
                    keyField="_id"
                    data={allUsers && allUsers}
                    columns={columns}
                    noDataIndication="No data to display."
                    striped
                    hover
                    condensed
                  />{" "}
                  
                  <Modal
                    size="md"
                    isOpen={passwordModal}
                    toggle={() => setPasswordModal(!passwordModal)}
                  >
                    <ModalHeader
                      toggle={() => setPasswordModal(!passwordModal)}
                    >
                      Username: {selectedUser && selectedUser.username}
                    </ModalHeader>
                    <ModalBody>
                      {selectedUser && (
                        <>
                          <Row>
                            <Col lg={12}>
                              <Card>
                                <CardBody>
                                  <AvForm
                                    onValidSubmit={(e, v) => {
                                      handleResetPassword(e, v);
                                    }}
                                  >
                                    <Row>
                                      <Col lg={12}>
                                        <AvField
                                          name="password"
                                          placeholder={props.t(
                                            "Enter Password"
                                          )}
                                          type="text"
                                          validate={{
                                            required: { value: true },
                                          }}
                                          errorMessage={props.t(
                                            "Password cannot be empty."
                                          )}
                                        />
                                        <hr />
                                      </Col>

                                      <Col lg={12}>
                                        <FormGroup className="mb-0 text-center">
                                          <div>
                                            <Button
                                              type="submit"
                                              color="primary"
                                              className="mr-1"
                                            >
                                              {props.t("Reset")}
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
const mapStatetoProps = (state) => { };
export default withRouter(
  connect(mapStatetoProps, {})(withNamespaces()(AllUsers))
);
