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

const AllSuppliers = (props) => {
  const { SearchBar } = Search;

  useEffect(() => {
    loadSuppliers();
  }, []);

  const [allSuppliers, setAllSuppliers] = useState([]);
  const loadSuppliers = async () => {
    let url = process.env.REACT_APP_BASEURL + "suppliers/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllSuppliers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const [editModal, setEditModal] = useState();
  const [selectedSupplier, setSelectedSupplier] = useState();
  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-edit font-size-15"
          title="Click to Edit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModal(!editModal);
            setSelectedSupplier(row);
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
    v.id = selectedSupplier._id;
    v.code = selectedSupplier.code;
    let url = process.env.REACT_APP_BASEURL + "suppliers/update";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadSuppliers();
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
        return { width: "10%" };
      },
    },
    {
      text: props.t("Company Name"),
      dataField: "company_name",
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
    // {
    //   dataField: "phone_number",
    //   text: props.t("Phone"),
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "12%" };
    //   },
    // },
    // {
    //   dataField: "email",
    //   text: props.t("Email"),
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "18%" };
    //   },
    // },
    // {
    //   dataField: "secondary_email",
    //   text: props.t("Secondary Email"),
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "18%" };
    //   },
    // },
    // {
    //   dataField: "fax",
    //   text: props.t("Fax"),
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "18%" };
    //   },
    // },
    {
      dataField: "address",
      text: props.t("Address"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "25%" };
      },
    },
    {
      text: props.t("Contact Name"),
      dataField: "contact_person_name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "13%" };
      },
    },
    {
      text: props.t("Contact Phone"),
      dataField: "contact_person_number",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "13%" };
      },
    },
    // {
    //   text: props.t("Contact Person Email"),
    //   dataField: "contact_person_email",
    //   sort: true,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "13%" };
    //   },
    // },
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
    const fileName = "suppliers";
    const exportType = "xls";
    if (allSuppliers) {
      var data = JSON.parse(JSON.stringify(allSuppliers));
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
      console.log(data);
      exportFromJSON({ data, fileName, exportType });
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Suppliers")}
            breadcrumbItem={props.t("All Suppliers")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Suppliers")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing suppliers here")}
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
                    data={allSuppliers && allSuppliers}
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
                      Supplier Code: {selectedSupplier && selectedSupplier.code}
                    </ModalHeader>
                    <ModalBody>
                      {selectedSupplier && (
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
                                          name="company_name"
                                          value={selectedSupplier.company_name}
                                          label={props.t("Company Name") + " *"}
                                          placeholder={props.t(
                                            "Enter Company Name"
                                          )}
                                          type="text"
                                          errorMessage="Company name cannot be empty."
                                          validate={{
                                            required: { value: true },
                                          }}
                                        />
                                      </Col>
                                      <Col lg={6}>
                                        <AvField
                                          name="phone_number"
                                          value={selectedSupplier.phone_number}
                                          label={props.t("Phone Number")}
                                          placeholder={props.t(
                                            "Enter Phone Number"
                                          )}
                                          type="text"
                                          validate={{
                                            pattern: {
                                              value: "^[0-9]+$",
                                              errorMessage: props.t(
                                                "Only numbers are allowed."
                                              ),
                                            },
                                            maxLength: {
                                              value: 11,
                                              errorMessage: props.t(
                                                "Enter valid phone number."
                                              ),
                                            },
                                            minLength: {
                                              value: 11,
                                              errorMessage: props.t(
                                                "Enter valid phone number."
                                              ),
                                            },
                                          }}
                                        />
                                      </Col>

                                      <Col lg={6}>
                                        <AvField
                                          name="mobile"
                                          value={selectedSupplier.mobile}
                                          label={props.t("Mobile") + " *"}
                                          placeholder={props.t("Enter Mobile")}
                                          type="text"
                                          validate={{
                                            required: {
                                              value: true,
                                              errorMessage: props.t(
                                                "Mobile cannot be empty."
                                              ),
                                            },
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
                                          name="email"
                                          value={selectedSupplier.email}
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
                                          name="secondary_email"
                                          value={
                                            selectedSupplier.secondary_email
                                          }
                                          label={props.t("Secondary Email")}
                                          placeholder={props.t(
                                            "Enter Secondary Email"
                                          )}
                                          errorMessage={props.t(
                                            "Please enter valid email."
                                          )}
                                          type="email"
                                        />
                                      </Col>
                                      <Col lg={6}>
                                        <AvField
                                          name="fax"
                                          value={selectedSupplier.fax}
                                          label={props.t("Fax")}
                                          placeholder={props.t("Enter Fax")}
                                          type="text"
                                          validate={{
                                            pattern: {
                                              value: "^[0-9]+$",
                                              errorMessage: props.t(
                                                "Only numbers are allowed."
                                              ),
                                            },
                                            maxLength: {
                                              value: 15,
                                              errorMessage:
                                                props.t("Enter valid fax."),
                                            },
                                          }}
                                        />
                                      </Col>
                                      <Col lg={6}>
                                        <AvField
                                          name="address"
                                          value={selectedSupplier.address}
                                          label={props.t("Address")}
                                          placeholder={props.t("Enter Address")}
                                          type="textarea"
                                        />
                                      </Col>
                                      <Col lg={6}>
                                        <AvField
                                          name="contact_person_name"
                                          value={
                                            selectedSupplier.contact_person_name
                                          }
                                          label={
                                            props.t("Contact Person Name") +
                                            " *"
                                          }
                                          placeholder={props.t(
                                            "Enter Contact Person Name"
                                          )}
                                          type="text"
                                          errorMessage="Contact person cannot be empty."
                                          validate={{
                                            required: { value: true },
                                          }}
                                        />
                                      </Col>
                                      <Col lg={6}>
                                        <AvField
                                          name="contact_person_number"
                                          value={
                                            selectedSupplier.contact_person_number
                                          }
                                          label={props.t(
                                            "Contact Person's Phone"
                                          )}
                                          placeholder={props.t(
                                            "Enter Contact Person's Phone"
                                          )}
                                          type="text"
                                          validate={{
                                            pattern: {
                                              value: "^[0-9]+$",
                                              errorMessage: props.t(
                                                "Only numbers are allowed."
                                              ),
                                            },
                                            maxLength: {
                                              value: 11,
                                              errorMessage: props.t(
                                                "Enter valid phone number."
                                              ),
                                            },
                                            minLength: {
                                              value: 11,
                                              errorMessage: props.t(
                                                "Enter valid phone number."
                                              ),
                                            },
                                          }}
                                        />
                                      </Col>
                                      <Col lg={6}>
                                        <AvField
                                          name="contact_person_email"
                                          value={
                                            selectedSupplier.contact_person_email
                                          }
                                          label={props.t(
                                            "Contact Person's Email"
                                          )}
                                          placeholder={props.t(
                                            "Enter Contact Person's Email"
                                          )}
                                          errorMessage={props.t(
                                            "Please enter valid email."
                                          )}
                                          type="email"
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
export default withRouter(connect(null, {})(withNamespaces()(AllSuppliers)));
