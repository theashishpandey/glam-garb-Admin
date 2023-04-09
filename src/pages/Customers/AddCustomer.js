import React, { useState, useRef } from "react";
//i18n
import { withNamespaces } from "react-i18next";

import {
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button,
  CardTitle,
  CardSubtitle,
  Container,
} from "reactstrap";
import swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

import { AvForm, AvField } from "availity-reactstrap-validation";
// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { postSubmitForm } from "../../helpers/forms_helper";

const AddCustomer = (props) => {
  const refContainer = useRef(null);

  const [addressModal, setAddressModal] = useState();
  const [addresses, setAddresses] = useState([]);

  const handleValidSubmit = async (e, v) => {
    v.addresses = addresses;

    let url = process.env.REACT_APP_BASEURL + "customers/insert";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      setAddresses([]);
      refContainer.current.reset();
    } else {
      showNotification(response.message, "Error");
    }
  };

  const handleValidAddress = async (e, v) => {
    v._id = uuidv4();

    setAddresses([...addresses, v]);
    setAddressModal(!addressModal);
  };

  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const deleteAddressFormatter = (cell, row, rowIndex, extra) => {
    return (
      <span className="text-danger">
        <i
          className="bx bxs-trash font-size-15"
          title="Click to Delete"
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleAddressDelete(row, extra);
          }}
        ></i>
      </span>
    );
  };

  const handleAddressDelete = async (row, extra) => {
    const filteredAddresses = extra.filter((item) => item._id != row._id);

    setAddresses(filteredAddresses);
  };

  const columns = [
    {
      dataField: "id",
      hidden: true,
    },
    {
      text: props.t("Apartment / House No."),
      dataField: "apartment_house_number",
      sort: true,
    },
    {
      text: props.t("Street Address"),
      dataField: "street_address",
      sort: true,
    },

    {
      text: props.t("City"),
      dataField: "city",
      sort: true,
    },
    {
      text: props.t("Province"),
      dataField: "province",
      sort: true,
    },
    {
      text: props.t("Pincode"),
      dataField: "pincode",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
    },
    {
      text: props.t("Action"),
      formatter: deleteAddressFormatter,
      formatExtraData: addresses,

      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "70px" };
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Customers")}
            breadcrumbItem={props.t("Add Customer")}
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
                    <CardTitle>{props.t("Add Customer")}</CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t(
                        "Enter the following details to add a new customer"
                      )}
                    </CardSubtitle>
                    <Row>
                      <Col lg={4}>
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

                      <Col lg={4}>
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
                              value: 10,
                              errorMessage: props.t(
                                "Mobile should be of 10 digits."
                              ),
                            },
                            minLength: {
                              value: 10,
                              errorMessage: props.t(
                                "Mobile should be of 10 digits."
                              ),
                            },
                          }}
                        />
                      </Col>

                      <Col lg={4}>
                        <AvField
                          name="email"
                          label={props.t("Email *")}
                          placeholder={props.t("Enter Email")}
                          errorMessage={props.t("Please enter valid email.")}
                          type="email"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: props.t("Email cannot be empty."),
                            },
                          }}
                        />
                      </Col>
                      <hr />
                      <Col lg={4}>
                        <button
                          type="button"
                          color="primary"
                          className="btn btn-success"
                          onClick={() => {
                            setAddressModal(!addressModal);
                          }}
                        >
                          <i class="bx bx-plus  font-size-16 align-middle me-2"></i>{" "}
                          Address
                        </button>
                      </Col>
                      <Col lg={12}>
                        <BootstrapTable
                          bootstrap4
                          keyField="id"
                          data={addresses && addresses}
                          columns={columns}
                          noDataIndication={props.t("No address to display.")}
                        />
                      </Col>
                      <hr />
                      <Col lg={12}>
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

                  {/* address Modal */}

                  <Modal
                    size="lg"
                    isOpen={addressModal}
                    toggle={() => setAddressModal(!addressModal)}
                  >
                    <ModalHeader toggle={() => setAddressModal(!addressModal)}>
                      Addresses:
                    </ModalHeader>
                    <ModalBody>
                      <>
                        <Row>
                          <Col lg={12}>
                            <Card>
                              <CardBody>
                                <AvForm
                                  onValidSubmit={(e, v) => {
                                    handleValidAddress(e, v);
                                  }}
                                >
                                  <Row>
                                    <Col lg={6}>
                                      <AvField
                                        name="apartment_house_number"
                                        label={props.t("Apartment/House No. *")}
                                        placeholder={props.t(
                                          "Enter Apartment/House No."
                                        )}
                                        type="text"
                                        errorMessage="Apartment/House No. cannot be empty."
                                        required
                                      />
                                    </Col>
                                    <Col lg={6}>
                                      <AvField
                                        name="street_address"
                                        label={props.t("Street Address *")}
                                        placeholder={props.t(
                                          "Enter Street Address"
                                        )}
                                        type="text"
                                        errorMessage="Street address cannot be empty."
                                        required
                                      />
                                    </Col>
                                    <Col lg={6}>
                                      <AvField
                                        name="city"
                                        label={props.t("City *")}
                                        placeholder={props.t(
                                          "Enter City Address"
                                        )}
                                        type="text"
                                        errorMessage="City cannot be empty."
                                        required
                                      />
                                    </Col>
                                    <Col lg={6}>
                                      <AvField
                                        name="province"
                                        label={props.t("Province") + " *"}
                                        placeholder={props.t("Select")}
                                        type="select"
                                        validate={{ required: { value: true } }}
                                        errorMessage="Province cannot be empty."
                                      >
                                        <option value="">
                                          -- {props.t("Select")} --
                                        </option>
                                        <option value="Alberta">
                                          {props.t("Alberta")}
                                        </option>
                                        <option value="British Columbia">
                                          {props.t("British Columbia")}
                                        </option>
                                        <option value="Manitoba">
                                          {props.t("Manitoba")}
                                        </option>
                                        <option value="New Brunswick">
                                          {props.t("New Brunswick")}
                                        </option>
                                        <option value="Nova Scotia">
                                          {props.t("Nova Scotia")}
                                        </option>
                                        <option value="Newfoundland and Labrador">
                                          {props.t("Newfoundland and Labrador")}
                                        </option>
                                        <option value="Ontario">
                                          {props.t("Ontario")}
                                        </option>
                                        <option value="Prince Edward Island">
                                          {props.t("Prince Edward Island")}
                                        </option>
                                        <option value="Quebec">
                                          {props.t("Quebec")}
                                        </option>
                                        <option value="Saskatchewan">
                                          {props.t("Saskatchewan")}
                                        </option>
                                        <option value="Yukon">
                                          {props.t("Yukon")}
                                        </option>
                                      </AvField>
                                    </Col>
                                    <Col lg={6}>
                                      <AvField
                                        name="pincode"
                                        label={props.t("Pincode *")}
                                        placeholder={props.t("Enter Pincode")}
                                        type="text"
                                        validate={{
                                          required: {
                                            value: true,
                                            errorMessage: props.t(
                                              "Pincode cannot be empty."
                                            ),
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
                                            {props.t("Add")}
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
export default withRouter(connect(null, {})(withNamespaces()(AddCustomer)));
