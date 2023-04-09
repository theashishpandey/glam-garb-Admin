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
  Modal,
  ModalHeader,
  ModalBody,
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

import {
  postSubmitForm,
  postSubmitForm_withformdata,
} from "../../helpers/forms_helper";

import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const AddPurchaseInvoice = (props) => {
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
  const [invoiceDoc, setInvoiceDoc] = useState();

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
      product_to_add.quantity = v.quantity;
      product_to_add.price = v.price;
      product_to_add.total_price = +v.price * +v.quantity;
      setProductsForOrder([...productsForOrder, product_to_add]);
      refSelectProduct.current.select.clearValue();
      refForForm.current.reset();
    } else {
      showNotification(props.t("Select a product first."), props.t("Error"));
    }
  };
  const [allOrders, setAllOrders] = useState([]);
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
  const columnsOrders = [
    {
      dataField: "_id",
      formatter: (cell, row, rowIndex) => {
        return rowIndex + 1;
      },
      text: props.t("#"),
      headerStyle: (colum, colIndex) => {
        return { width: "9%" };
      },
    },
    {
      dataField: "po_number",
      text: props.t("Purchase Order"),
    },
    {
      dataField: "product_details.order_number",
      text: props.t("Sales Order#"),
    },
    {
      dataField: "product_details.invoice_number",
      text: props.t("Sales Invoice#"),
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
    if (!selectedStore) {
      return showNotification(props.t("Please select store."), "Error");
    }

    if (!selectedSupplier) {
      return showNotification(props.t("Please select supplier."), "Error");
    }

    if (!v.invoice_date) {
      return showNotification(props.t("Please select PI date."), "Error");
    }

    if (productsForOrder.length == 0) {
      return showNotification(
        props.t("Please select purchase orders."),
        "Error"
      );
    }

    let formData = new FormData();

    formData.set("invoice_number", v.invoice_number);
    formData.set("invoice_date", v.invoice_date);
    formData.set("store_id", selectedStore._id);
    formData.set("supplier_id", selectedSupplier._id);
    formData.set("po_details", JSON.stringify(productsForOrder));
    if (invoiceDoc) formData.append("invoice_doc", invoiceDoc);

    let url =
      process.env.REACT_APP_BASEURL + "purchaseinvoices/submit_invoice_details";
    const response = await postSubmitForm_withformdata(url, formData);

    if (response.status === 1 && response.data) {
      setSelectedProduct();
      setProductsForOrder([]);

      showNotification(response.message, "Success");
    } else {
      showNotification(response.message, "Error");
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
    if (isSelect) {
      setProductsForOrder([...productsForOrder, row]);
    } else {
      setProductsForOrder(productsForOrder.filter((x) => x._id !== row._id));
    }
  };

  const handleOnSelectAll = (isSelect, rows) => {
    if (isSelect) {
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
      dataField: "po_number",
      text: props.t("Purchase Order"),
      editable: false,
    },
    {
      dataField: "product_details.order_number",
      text: props.t("Sales Order#"),
      editable: false,
    },
    {
      dataField: "product_details.invoice_number",
      text: props.t("Sales Invoice#"),
      editable: false,
    },
    {
      dataField: "product_details.name",
      text: props.t("Product"),
      editable: false,
    },

    {
      dataField: "product_details.qty",
      text: props.t("Quantity"),
      editable: true,
      style: (cell, row, rowIndex, colIndex) => {
        return {
          backgroundColor: "#FFFBAC",
        };
      },
    },
    {
      formatter: deleteFormatter,
      formatExtraData: productsForOrder,
      sort: false,
      editable: false,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
  ];

  const handleGetOrders = async () => {
    setProductsForOrder([]);
    if (!selectedStore)
      return showNotification("Please select Store.", "Error");
    if (!selectedSupplier)
      return showNotification("Please select Supplier.", "Error");
    let url =
      process.env.REACT_APP_BASEURL + "purchaseorders/get_for_purchaseinvoice";
    let response = await postSubmitForm(url, {
      supplier_id: selectedSupplier._id,
      store_id: selectedStore._id,
    });
    if (response.status === 1) {
      let arr = JSON.parse(JSON.stringify(response.data));
      for (let i = 0; i < arr.length; i++) {
        arr[i]._id =
          arr[i]._id +
          arr[i].product_details._id +
          arr[i].product_details.order_number;
      }
      console.log(arr);
      setAllOrders(arr);
    } else {
      showNotification(response.message, "Error");
    }

    setOrdersModal(!ordersModal);
  };

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,

    onSelect: handleOnSelect,
    onSelectAll: handleOnSelectAll,
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb_2Items
            alternateTitle={props.t("Purchase Invoice")}
            title={props.t("Purchase")}
            breadcrumbItem1={props.t("Add Purchase Invoice")}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm onValidSubmit={handleValidSubmit}>
                    <Row>
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
                          name="invoice_number"
                          label={props.t("Invoice Number")}
                          placeholder={props.t("Enter Invoice Number")}
                          type="text"
                        />
                      </Col>
                      <Col lg={4}>
                        <AvField
                          name="invoice_date"
                          label={props.t("Invoice Date")}
                          placeholder={props.t("Select Date")}
                          type="date"
                        />
                      </Col>
                      <Col lg={8}>
                        <Label>{props.t("Invoice Document")}</Label>
                        <br />
                        <input
                          type="file"
                          className="mb-2"
                          name="invoiceDoc"
                          onChange={(e) => {
                            setInvoiceDoc(e.target.files[0]);
                          }}
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
                          Purchase Orders
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
                          </Button>
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
                      Purchase Orders:
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
  connect(mapStatetoProps, {})(withNamespaces()(AddPurchaseInvoice))
);
