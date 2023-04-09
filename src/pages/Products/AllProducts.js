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


const AllProducts = (props) => {
  const { SearchBar } = Search;

  useEffect(() => {
    loadProducts();
  }, []);
const [allproducts, setallProducts] = useState([])

  const loadProducts = async () => {
    let url = process.env.REACT_APP_BASEURL + "products/getall";
    const response = await postSubmitForm(url, {
     
    });
    if (response && response.status === 1) {
     setallProducts(response.data)
    } else {
      showNotification(response.message, "Error");
    }
  };

  const handleProductsStatusUpdate = async (products) => {
    let url = process.env.REACT_APP_BASEURL + "employees/activate_deactivate";
    const response = await postSubmitForm(url, {
      id: products._id,
      is_active: !products.is_active,
    });
    if (response && response.status === 1) {
      props.loadProducts();
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
              handleProductsStatusUpdate(row);
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
  const [selectedProducts, setSelectedProducts] = useState();
  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-edit font-size-15"
          title="Click to Edit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModal(!editModal);
            setSelectedProducts(row);
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
    v.products_id = selectedProducts._id;
    let url = process.env.REACT_APP_BASEURL + "products/update";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
    loadProducts();
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
      text: props.t("Name"),
      dataField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
    },
    {
      dataField: "brand",
      text: props.t("Brand"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },
   
    {
      dataField: "price",
      text: props.t("Price"),
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
    const fileName = "products";
    const exportType = "xls";
    if (allproducts) {
      var data = JSON.parse(JSON.stringify(allproducts));
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
            title={props.t("Products")}
            breadcrumbItem={props.t("All Products")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Products")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing products here")}
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
                    data={allproducts && allproducts}
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
                     Product Name: {selectedProducts && selectedProducts.name}
                    </ModalHeader>
                    <ModalBody>
                      {selectedProducts && (
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
                                          value={selectedProducts.name}
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
                                          value={selectedProducts.mobile}
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
                                          name="email"
                                          value={selectedProducts.email}
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
                                          value={selectedProducts.designation}
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
  const { error, message, message_type, employees } = state.Products;
  return { error, message, message_type, employees };
};
export default withRouter(
  connect(mapStatetoProps, {
   
  })(withNamespaces()(AllProducts))
);
