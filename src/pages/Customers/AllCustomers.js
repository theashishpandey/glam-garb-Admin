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
import { v4 as uuidv4 } from "uuid";

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

const AllCustomers = (props) => {
  const { SearchBar } = Search;
  const [addressModal, setAddressModal] = useState();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const [allCustomers, setAllCustomers] = useState([]);
  const loadCustomers = async () => {
    let url = process.env.REACT_APP_BASEURL + "customers/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllCustomers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const [editModal, setEditModal] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();

  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-edit font-size-15"
          title="Click to Edit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModal(!editModal);
            setSelectedCustomer(row);

            setAddresses(row.addresses);
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
    v.id = selectedCustomer._id;
    v.addresses = addresses;
    let url = process.env.REACT_APP_BASEURL + "customers/update";
    console.log(v);
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadCustomers();
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
      dataField: "_id",
      formatter: (cell, row, rowIndex) => {
        return rowIndex + 1;
      },
      text: props.t("#"),
      headerStyle: (colum, colIndex) => {
        return { width: "3%" };
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
      text: props.t("Action"),
      formatter: editFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
  ];

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

  const columnsAddresses = [
    {
      dataField: "_id",
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

  const handleAddressDelete = async (row, extra) => {
    const filteredAddresses = extra.filter((item) => item._id != row._id);

    setAddresses(filteredAddresses);
  };

  const handleDownload = () => {
    const fileName = "customers";
    const exportType = "xls";
    if (allCustomers) {
      var data = JSON.parse(JSON.stringify(allCustomers));
      data.forEach(function (v) {
        delete v.addresses;
        delete v.addresses;
        delete v.is_active;
        delete v._id;
        delete v.tokens;
        delete v.pwd;
        delete v.value;
        delete v.label;
        delete v.createdAt;
        delete v.updatedAt;
        delete v.__v;
        delete v.image_url;
      });
      console.log(data);
      exportFromJSON({ data, fileName, exportType });
    }
  };

  const handleValidAddress = async (e, v) => {
    v._id = uuidv4();
    setAddresses([...addresses, v]);
    setAddressModal(!addressModal);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Customers")}
            breadcrumbItem={props.t("All Customers")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Customers")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing customers here")}
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
                    data={allCustomers && allCustomers}
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

                  {/* Selected Customer Modal */}
                  <Modal
                    size="lg"
                    isOpen={editModal}
                    toggle={() => setEditModal(!editModal)}
                  >
                    <ModalHeader toggle={() => setEditModal(!editModal)}>
                      Customer Name: {selectedCustomer && selectedCustomer.name}
                    </ModalHeader>
                    <ModalBody>
                      {selectedCustomer && (
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
                                      <Col lg={4}>
                                        <AvField
                                          name="name"
                                          value={selectedCustomer.name}
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
                                          value={selectedCustomer.mobile}
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

                                      <Col lg={4}>
                                        <AvField
                                          name="email"
                                          value={selectedCustomer.email}
                                          label={props.t("Email")}
                                          placeholder={props.t("Enter Email")}
                                          errorMessage={props.t(
                                            "Please enter valid email."
                                          )}
                                          type="email"
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
                                          keyField="_id"
                                          data={addresses && addresses}
                                          columns={columnsAddresses}
                                          noDataIndication={props.t(
                                            "No address to display."
                                          )}
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

                  {/* address Modal */}
                  <Modal
                    size="md"
                    isOpen={addressModal}
                    toggle={() => setAddressModal(!addressModal)}
                  >
                    <ModalHeader toggle={() => setAddressModal(!addressModal)}>
                      Addresses :
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
                                          "Enter Street Address"
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
export default withRouter(connect(null, {})(withNamespaces()(AllCustomers)));
