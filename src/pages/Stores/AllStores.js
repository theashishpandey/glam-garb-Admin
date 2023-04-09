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
  Button,
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

const AllStores = (props) => {
  const { SearchBar } = Search;

  useEffect(() => {
    loadStores();
  }, []);

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

  const [editModal, setEditModal] = useState();
  const [selectedStore, setSelectedStore] = useState();
  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-edit font-size-15"
          title="Click to Edit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModal(!editModal);
            setSelectedStore(row);
          }}
        ></i>
      </span>
    );
  }
  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }
  const handleValidUpdate = async (e, v) => {
    v.id = selectedStore._id;
    let url = process.env.REACT_APP_BASEURL + "stores/update";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadStores();
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
      text: props.t("Tax Reg. #"),
      dataField: "tax_registration_number",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "11%" };
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
      dataField: "pincode",
      text: props.t("Pincode"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "16%" };
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
    const fileName = "stores";
    const exportType = "xls";
    if (allStores) {
      var data = JSON.parse(JSON.stringify(allStores));
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
            title={props.t("Stores")}
            breadcrumbItem={props.t("All Stores")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Stores")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing stores here")}
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
                    data={allStores && allStores}
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
                      Store Code: {selectedStore && selectedStore.code}
                    </ModalHeader>
                    <ModalBody>
                      {selectedStore && (
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
                                          value={selectedStore.name}
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
                                          value={
                                            selectedStore.tax_registration_number
                                          }
                                          label={
                                            props.t("Tax Reg. Number") + " *"
                                          }
                                          placeholder={props.t(
                                            "Enter Tax Reg. Number"
                                          )}
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
                                          value={selectedStore.mobile}
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
                                          value={selectedStore.phone}
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
                                          value={selectedStore.email}
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
                                          value={selectedStore.address}
                                          label={props.t("Address")}
                                          placeholder={props.t("Enter Address")}
                                          type="textarea"
                                        />
                                      </Col>

                                      <Col lg={6}>
                                        <AvField
                                          name="pincode"
                                          value={selectedStore.pincode}
                                          label={props.t("Pincode")}
                                          placeholder={props.t("Enter Pincode")}
                                          type="text"
                                          validate={{
                                            required: { value: true },
                                            pattern: {
                                              value: "^[a-zA-Z0-9_]",
                                              errorMessage: props.t(
                                                "Pincode is required 6 characters ."
                                              ),
                                            },

                                            maxLength: {
                                              value: 6,
                                              errorMessage: props.t(
                                                "Pincode is required 6 characters ."
                                              ),
                                            },
                                            minLength: {
                                              value: 6,
                                              errorMessage: props.t(
                                                "Pincode is required 6 characters ."
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
export default withRouter(connect(null, {})(withNamespaces()(AllStores)));
