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

const AllWarehouses = (props) => {
  const { SearchBar } = Search;

  useEffect(() => {
    loadWarehouses();
  }, []);

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

  const [editModal, setEditModal] = useState();
  const [selectedWarehouse, setSelectedWarehouse] = useState();
  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-edit font-size-15"
          title="Click to Edit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModal(!editModal);
            setSelectedWarehouse(row);
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
    v.id = selectedWarehouse._id;
    let url = process.env.REACT_APP_BASEURL + "warehouses/update";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadWarehouses();
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
        return { width: "8%" };
      },
    },
    {
      text: props.t("Name"),
      dataField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "13%" };
      },
    },
    {
      text: props.t("Phone"),
      dataField: "phone",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "13%" };
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
        return { width: "18%" };
      },
    },
    {
      dataField: "address",
      text: props.t("Address"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "23%" };
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
    const fileName = "warehouses";
    const exportType = "xls";
    if (allWarehouses) {
      var data = JSON.parse(JSON.stringify(allWarehouses));
      data.forEach(function (v) {
        delete v.is_active;
        delete v._id;
        delete v.label;
        delete v.value;
        delete v.createdAt;
        delete v.updatedAt;
        delete v.__v;
        delete v.image_url;
      });
      exportFromJSON({ data, fileName, exportType });
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Warehouses")}
            breadcrumbItem={props.t("All Warehouses")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Warehouses")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing warehouses here")}
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
                    data={allWarehouses && allWarehouses}
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
                      Warehouse Code:{" "}
                      {selectedWarehouse && selectedWarehouse.code}
                    </ModalHeader>
                    <ModalBody>
                      {selectedWarehouse && (
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
                                          value={selectedWarehouse.name}
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
                                          value={selectedWarehouse.mobile}
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
                                              value: 11,
                                              errorMessage: props.t(
                                                "Enter valid mobile."
                                              ),
                                            },
                                            minLength: {
                                              value: 11,
                                              errorMessage: props.t(
                                                "Enter valid mobile."
                                              ),
                                            },
                                          }}
                                        />
                                      </Col>
                                      <Col lg={6}>
                                        <AvField
                                          name="phone"
                                          value={selectedWarehouse.phone}
                                          label={props.t("Phone") + " *"}
                                          placeholder={props.t("Enter Phone")}
                                          type="text"
                                          validate={{
                                            required: {
                                              value: true,
                                              errorMessage: props.t(
                                                "Phone cannot be empty."
                                              ),
                                            },
                                            pattern: {
                                              value: "^[0-9]+$",
                                              errorMessage: props.t(
                                                "Only numbers are allowed."
                                              ),
                                            },
                                            maxLength: {
                                              value: 12,
                                              errorMessage:
                                                props.t("Enter valid phone."),
                                            },
                                            minLength: {
                                              value: 12,
                                              errorMessage:
                                                props.t("Enter valid phone."),
                                            },
                                          }}
                                        />
                                      </Col>
                                      <Col lg={6}>
                                        <AvField
                                          name="email"
                                          value={selectedWarehouse.email}
                                          label={props.t("Email")}
                                          placeholder={props.t("Enter Email")}
                                          errorMessage={props.t(
                                            "Please enter valid email."
                                          )}
                                          type="email"
                                        />
                                      </Col>

                                      <Col lg={6}>
                                        <AvField
                                          name="address"
                                          value={selectedWarehouse.address}
                                          label={props.t("Address")}
                                          placeholder={props.t("Enter Address")}
                                          type="textarea"
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
export default withRouter(connect(null, {})(withNamespaces()(AllWarehouses)));
