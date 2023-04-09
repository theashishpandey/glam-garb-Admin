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
  Label,
  CardSubtitle,
  Container,
} from "reactstrap";

import { AvForm, AvField } from "availity-reactstrap-validation";
// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import BreadCrumb_2Items from "../../components/Common/Breadcrumb_2Items";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import showNotification from "../../helpers/show_notification";

import { postSubmitForm } from "../../helpers/forms_helper";

import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const AddPurchaseOrder = (props) => {
  const refForForm = useRef(null);
  const refSelectProduct = useRef(null);
  const refSelectSuppliers = useRef(null);
  const refSelectStore = useRef(null);
  useEffect(() => {
    loadAllProducts();
    getSuppliers();
    if (localStorage.getItem("role") === "admin") loadStores();
  }, []);

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const loadAllProducts = async () => {
    let url = process.env.REACT_APP_BASEURL + "products/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllProducts(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  const [productsForOrder, setProductsForOrder] = useState([]);
  const handleAddProductForOrder = async (e, v) => {
    var new_array_products = JSON.parse(JSON.stringify(productsForOrder));
    const existing_product = new_array_products.filter(function (product) {
      return product._id === selectedProduct._id;
    });

    if (existing_product.length > 0) {
      showNotification(
        props.t("This product is already added."),
        props.t("Error")
      );
    } else if (selectedProduct) {
      let product_to_add = {};
      product_to_add = Object.assign(product_to_add, selectedProduct);
      product_to_add.qty = v.qty;
      product_to_add.price = v.price;
      product_to_add.total_price = +v.price * +v.qty;
      setProductsForOrder([...productsForOrder, product_to_add]);
      refSelectProduct.current.select.clearValue();
      refForForm.current.reset();
    } else {
      showNotification(props.t("Select a product first."), props.t("Error"));
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

  const [allSuppliers, setAllSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState();
  const getSuppliers = async () => {
    let url = process.env.REACT_APP_BASEURL + "suppliers/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllSuppliers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  const [selectedStore, setSelectedStore] = useState();
  const handleValidSubmit = async (e, v) => {
    try {
      if (selectedSupplier) {
        const object = {
          product_details: productsForOrder,
          supplier_details: selectedSupplier,
          store_details:
            localStorage.getItem("role") !== "admin"
              ? JSON.parse(localStorage.getItem("store_warehouse_details"))
              : selectedStore,
          po_date: v.po_date,
        };
        let url = process.env.REACT_APP_BASEURL + "purchaseorders/generate";
        console.log(object);
        let response = await postSubmitForm(url, object);
        if (response.status === 1) {
          setProductsForOrder([]);
          setSelectedProduct();
          setSelectedSupplier();
          refForForm.current.reset();
          showNotification(response.message, "Success");
        } else {
          showNotification(response.message, "Error");
        }
      } else {
        showNotification(props.t("Select at least one supplier."), "Error");
      }
    } catch (error) {
      showNotification(error.message, "Error");
    }
  };
  function deleteFormatter(cell, row, rowIndex, extraData) {
    return (
      <>
        <span className="text-danger">
          <i
            className="bx bxs-trash font-size-15"
            title="Click to Delete"
            style={{ cursor: "pointer" }}
            onClick={() => {
              let arr = extraData.filter((product) => product._id !== row._id);
              setProductsForOrder(arr);
            }}
          ></i>
        </span>
      </>
    );
  }
  const columns = [
    {
      dataField: "name",
      text: props.t("Name"),
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
      sort: true,
    },
    {
      dataField: "category",
      text: props.t("Category"),
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },
    {
      dataField: "sub_category",
      text: props.t("Sub-Category"),
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },

    {
      dataField: "qty",
      text: props.t("Order Quantity"),

      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },
    {
      dataField: "price",
      text: props.t("Price"),

      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },
    {
      dataField: "total_price",
      text: props.t("Total Price"),

      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },
    {
      formatter: deleteFormatter,
      formatExtraData: productsForOrder,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb_2Items
            alternateTitle={props.t("Purchase Order")}
            title={props.t("Purchase")}
            breadcrumbItem1={props.t("Add Purchase Order For Inventory")}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm
                    onValidSubmit={handleAddProductForOrder}
                    ref={refForForm}
                  >
                    <CardTitle>
                      {props.t("Add New Purchase Order For Inventory")}
                    </CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t(
                        "Enter the following details to add a new purchase order"
                      )}
                    </CardSubtitle>
                    <Row>
                      <Col lg={3}>
                        <Label>{props.t("Product")}</Label>
                        <Select
                          ref={refSelectProduct}
                          value={selectedProduct}
                          onChange={(selected) => {
                            setSelectedProduct(selected);
                          }}
                          options={allProducts}
                          classNamePrefix="select2-selection"
                          components={animatedComponents}
                          required
                        />
                      </Col>

                      <Col lg={3}>
                        <Label>{props.t("Quantity")}</Label>

                        <AvField
                          name="qty"
                          placeholder={props.t("Enter Quantity")}
                          errorMessage="Quantity cannot be empty."
                          type="text"
                          validate={{
                            required: { value: true },
                            pattern: {
                              value: "^[0-9]+$",
                              errorMessage: props.t(
                                "Only numbers are allowed."
                              ),
                            },
                          }}
                        />
                      </Col>

                      <Col lg={3}>
                        <Label>{props.t("Price")}</Label>
                        <AvField
                          name="price"
                          placeholder={props.t("Enter Price")}
                          errorMessage="Price cannot be empty."
                          type="text"
                          validate={{
                            required: { value: true },
                            pattern: {
                              value: "^[0-9]+$",
                              errorMessage: props.t(
                                "Only numbers are allowed."
                              ),
                            },
                          }}
                        />
                      </Col>

                      <Col lg={2} className="mb-4">
                        <Label>&nbsp;</Label>
                        <br />
                        <Button
                          type="submit"
                          color="primary"
                          className="btn btn-info waves-effect waves-light btn-sm"
                        >
                          <i class="bx bx-add-to-queue"></i> {props.t("Add")}
                        </Button>
                      </Col>
                    </Row>
                  </AvForm>
                  <hr />
                  {productsForOrder && productsForOrder.length > 0 && (
                    <>
                      <BootstrapTable
                        bootstrap4
                        keyField="_id"
                        data={productsForOrder && productsForOrder}
                        columns={columns}
                        noDataIndication="No data to display."
                        striped
                        hover
                        condensed
                      />
                      <AvForm onValidSubmit={handleValidSubmit}>
                        <Row className="mt-4">
                          {localStorage.getItem("role") === "admin" && (
                            <Col lg={4}>
                              <Label>Store</Label>
                              <Select
                                ref={refSelectStore}
                                value={selectedStore}
                                onChange={(selected) => {
                                  setSelectedStore(selected);
                                }}
                                options={allStores}
                                classNamePrefix="select2-selection"
                                closeMenuOnSelect={true}
                                components={animatedComponents}
                                required
                              />
                            </Col>
                          )}
                          <Col lg={4}>
                            <Label>Suppliers</Label>
                            <Select
                              ref={refSelectSuppliers}
                              value={selectedSupplier}
                              onChange={(selected) => {
                                setSelectedSupplier(selected);
                              }}
                              options={allSuppliers}
                              classNamePrefix="select2-selection"
                              closeMenuOnSelect={true}
                              components={animatedComponents}
                              required
                            />
                          </Col>
                          <Col lg={4}>
                            <AvField
                              name="po_date"
                              label={props.t("Purchase Order Date")}
                              placeholder={props.t("Select Date")}
                              type="date"
                              required
                              errorMessage="Purchase order date cannot be empty"
                            />
                          </Col>
                          <Col lg={12}>
                            <hr />
                            <FormGroup className="mb-0 text-left">
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
                    </>
                  )}
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
  const { store_warehouse_details, role, token } = state.Login;
  return {
    store_warehouse_details,
    role,
    token,
  };
};
export default withRouter(
  connect(mapStatetoProps, {})(withNamespaces()(AddPurchaseOrder))
);
