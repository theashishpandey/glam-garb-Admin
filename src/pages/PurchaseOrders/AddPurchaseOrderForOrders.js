import React, { useEffect, useState, useRef } from "react";
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
import cellEditFactory from "react-bootstrap-table2-editor";

import showNotification from "../../helpers/show_notification";

import { postSubmitForm } from "../../helpers/forms_helper";

import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const AddPurchaseOrderForOrders = (props) => {
  const refForForm = useRef(null);
  const refSelectProduct = useRef(null);
  const refSelectSuppliers = useRef(null);
  const refSelectStore = useRef(null);
  useEffect(() => {
    loadAllProducts();
    getSuppliers();
    if (localStorage.getItem("role") === "admin") loadStores();
  }, []);

  const [ordersModal, setOrdersModal] = useState();
  const [allOrders, setAllOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedDate, setSelectedDate] = useState();
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
  const handleAddProductForOrder = async () => {
    console.log(productsForOrder);
    // var new_array_products = JSON.parse(JSON.stringify(productsForOrder));

    // const existing_product = new_array_products.filter(function (product) {
    //   return product._id === selectedProduct._id;
    // });

    // if (existing_product.length > 0) {
    //   showNotification(
    //     props.t("This product is already added."),
    //     props.t("Error")
    //   );
    // } else if (selectedProduct) {
    //   let product_to_add = {};
    //   product_to_add = Object.assign(product_to_add, selectedProduct);
    //   product_to_add.quantity = v.quantity;
    //   product_to_add.price = v.price;
    //   product_to_add.total_price = +v.price * +v.quantity;
    //   setProductsForOrder([...productsForOrder, product_to_add]);
    //   refSelectProduct.current.select.clearValue();
    //   refForForm.current.reset();
    // } else {
    //   showNotification(props.t("Select a product first."), props.t("Error"));
    // }
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
      if (!selectedSupplier) {
        return showNotification(props.t("Please select supplier."), "Error");
      }

      if (!selectedStore) {
        return showNotification(props.t("Please select store."), "Error");
      }

      if (!selectedDate) {
        return showNotification(props.t("Please select PO date."), "Error");
      }

      if (productsForOrder.length == 0) {
        return showNotification(props.t("Please select orders."), "Error");
      }
      let arr = [];
      productsForOrder.forEach((element) => {
        let obj = element.product_details;
        obj.order_number = element.order_number;
        obj.invoice_number = element.invoice_number;
        arr.push(obj);
      });

      const object = {
        product_details: arr,
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

        showNotification(response.message, "Success");
      } else {
        showNotification(response.message, "Error");
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

  const handleOnSelect = (row, isSelect) => {
    row.product_details.price = 0;
    row.product_details.total_price = 0;
    if (isSelect) {
      setProductsForOrder([...productsForOrder, row]);
    } else {
      setProductsForOrder(productsForOrder.filter((x) => x._id !== row._id));
    }
  };

  const handleOnSelectAll = (isSelect, rows) => {
    if (isSelect) {
      rows.forEach((element) => {
        element.product_details.price = 0;
        element.product_details.total_price = 0;
      });
      setProductsForOrder(rows);
    } else {
      setProductsForOrder([]);
    }
  };
  const columns = [
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
      dataField: "order_number",
      text: props.t("Order"),
      editable: false,
    },
    {
      dataField: "invoice_number",
      text: props.t("Invoice"),
      editable: false,
    },
    {
      dataField: "product_details.name",
      text: props.t("Name"),
      editable: false,
    },
    {
      dataField: "product_details.category",
      text: props.t("Category"),
      editable: false,
    },

    {
      dataField: "product_details.qty",
      text: props.t("Quantity"),
      editable: false,
    },
    {
      dataField: "product_details.price",
      text: props.t("Price"),
      editable: true,
      validator: (newValue, row, column) => {
        if (newValue < 0 || isNaN(newValue)) {
          return {
            valid: false,
            message: "Invalid Input.",
          };
        }

        return true;
      },
      style: (cell, row, rowIndex, colIndex) => {
        return {
          backgroundColor: "#FFFBAC",
        };
      },
    },
    {
      dataField: "product_details.total_price",
      text: props.t("Total Price"),
      editable: false,
    },
    {
      formatter: deleteFormatter,
      formatExtraData: productsForOrder,
      editable: false,
      headerStyle: (colum, colIndex) => {
        return { width: "5%" };
      },
    },
  ];
  const columnsOrders = [
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
      dataField: "order_number",
      text: props.t("Order"),
    },
    {
      dataField: "invoice_number",
      text: props.t("Invoice"),
    },
    {
      dataField: "product_details.name",
      text: props.t("Product"),
    },

    {
      dataField: "product_details.qty",
      text: props.t("Quantity"),
    },
  ];

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,

    onSelect: handleOnSelect,
    onSelectAll: handleOnSelectAll,
  };

  const handleGetOrders = async () => {
    setProductsForOrder([]);
    if (!selectedStore)
      return showNotification("Please select Store.", "Error");
    if (!selectedSupplier)
      return showNotification("Please select Supplier.", "Error");
    if (!selectedDate)
      return showNotification("Please select PO date.", "Error");

    let url = process.env.REACT_APP_BASEURL + "orders/get_for_purchaseorder";
    let response = await postSubmitForm(url, {
      supplier_id: selectedSupplier._id,
      store_id: selectedStore._id,
    });
    if (response.status === 1) {
      let arr = JSON.parse(JSON.stringify(response.data));
      for (let i = 0; i < arr.length; i++) {
        arr[i]._id = arr[i]._id + arr[i].product_details._id;
      }

      setAllOrders(arr);
    } else {
      showNotification(response.message, "Error");
    }

    setOrdersModal(!ordersModal);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb_2Items
            alternateTitle={props.t("Purchase Order")}
            title={props.t("Purchase")}
            breadcrumbItem1={props.t("Add Purchase Order For orders")}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle>
                    {props.t("Add New Purchase Order For Orders")}
                  </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t(
                      "Enter the following details to add a new purchase order"
                    )}
                  </CardSubtitle>
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
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                          }}
                          required
                          errorMessage="Purchase order date cannot be empty"
                        />
                      </Col>
                      <Col lg={4}>
                        <button
                          type="button"
                          color="primary"
                          className="btn btn-success"
                          onClick={() => {
                            handleGetOrders();
                          }}
                        >
                          <i class="bx bx-plus  font-size-16 align-middle me-2"></i>{" "}
                          Orders
                        </button>
                      </Col>
                      <Col lg={12}>
                        {productsForOrder && productsForOrder.length > 0 && (
                          <>
                            <BootstrapTable
                              bootstrap4
                              keyField="_id"
                              data={productsForOrder && productsForOrder}
                              columns={columns}
                              cellEdit={cellEditFactory({
                                mode: "click",
                                blurToSave: true,
                                afterSaveCell: async (
                                  oldValue,
                                  newValue,
                                  row,
                                  column
                                ) => {
                                  row.product_details.total_price =
                                    +row.product_details.price *
                                    +row.product_details.qty;
                                },
                              })}
                              noDataIndication="No data to display."
                              striped
                              hover
                              condensed
                            />
                          </>
                        )}
                      </Col>
                      <Col lg={12}>
                        <hr />
                        <FormGroup className="mb-0 text-center">
                          <Button
                            type="submit"
                            color="primary"
                            className="mr-1"
                          >
                            {props.t("Submit")}
                          </Button>{" "}
                        </FormGroup>
                      </Col>
                    </Row>
                  </AvForm>
                  {/* order Modal */}

                  <Modal
                    size="lg"
                    isOpen={ordersModal}
                    toggle={() => setOrdersModal(!ordersModal)}
                  >
                    <ModalHeader toggle={() => setOrdersModal(!ordersModal)}>
                      Orders:
                    </ModalHeader>
                    <ModalBody>
                      <>
                        <Row>
                          <Col lg={12}>
                            <Card>
                              <CardBody>
                                <Row>
                                  <Col lg={12}>
                                    <BootstrapTable
                                      bootstrap4
                                      keyField="_id"
                                      data={allOrders && allOrders}
                                      columns={columnsOrders}
                                      selectRow={selectRow}
                                      noDataIndication={props.t(
                                        "No data to display."
                                      )}
                                    />
                                  </Col>
                                </Row>
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

const mapStatetoProps = (state) => {
  const { store_warehouse_details, role, token } = state.Login;
  return {
    store_warehouse_details,
    role,
    token,
  };
};
export default withRouter(
  connect(mapStatetoProps, {})(withNamespaces()(AddPurchaseOrderForOrders))
);
