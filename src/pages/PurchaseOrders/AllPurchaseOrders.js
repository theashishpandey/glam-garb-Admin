import React, { useEffect, useState, useRef } from "react";
//i18n
import { withNamespaces } from "react-i18next";

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
  Label,
  FormGroup,
  Button,
} from "reactstrap";
import swal from "sweetalert2";
import { AvForm, AvField } from "availity-reactstrap-validation";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import BreadCrumb_2Items from "../../components/Common/Breadcrumb_2Items";

import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import {
  postSubmitForm,
  postSubmitForm_withformdata,
} from "../../helpers/forms_helper";
import moment from "moment";

import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const AllPurchaseOrders = (props) => {
  const refForFormAddProductToReceive = useRef(null);
  const refSelectProduct = useRef(null);
  const { SearchBar } = Search;
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState();
  const [poStatus, setPOStatus] = useState("All");
  const [allLocations, setAllLocations] = useState([]);
  const loadLocations = async () => {
    let url = process.env.REACT_APP_BASEURL + "stores/get_locations";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllLocations(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };

  useEffect(() => {
    loadAllPO();
  }, [poStatus]);

  useEffect(() => {
    loadLocations();
  }, []);

  const [allPO, setAllPO] = useState([]);
  const loadAllPO = async () => {
    setLoading(true);
    let url = process.env.REACT_APP_BASEURL + "purchaseorders/get_by_status";
    const response = await postSubmitForm(url, { status: poStatus });
    //console.log(response);
    if (response && response.status === 1) {
      setAllPO(response.data);
      setLoading(false);
    } else {
      showNotification(response.message, "Error");
      setLoading(false);
    }
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  const [invoiceDoc, setInvoiceDoc] = useState();
  const [selectedInvoice, setSelectedInvoice] = useState();
  const handleSubmitInvoiceDetails = async (e, v) => {
    let formData = new FormData();
    formData.set("po_id", selectedPO._id);
    formData.set("invoice_number", v.invoice_number);
    formData.set("invoice_date", v.invoice_date);
    if (invoiceDoc) formData.append("invoice_doc", invoiceDoc);

    let url =
      process.env.REACT_APP_BASEURL + "purchaseinvoices/submit_invoice_details";
    const response = await postSubmitForm_withformdata(url, formData);

    if (response.status === 1 && response.data) {
      loadAllPO();
      //setPurchaseInvoiceModal(!purchaseInvoiceModal);
      getPurchaseInvoiceDetails(selectedPO._id);
      showNotification(response.message, "Success");
    } else {
      showNotification(response.message, "Error");
    }
  };

  const [productsToReceive, setProductsToReceive] = useState([]);
  const [selectedProductToReceive, setSelectedProductToReceive] = useState();
  const handleAddProductToReceive = async (e, v) => {
    //check product selected or not
    if (!selectedProductToReceive) {
      showNotification(props.t("Select a product first."), props.t("Error"));
      return;
    }

    //check if product already added
    var new_array_products = JSON.parse(JSON.stringify(productsToReceive));
    const existing_product = new_array_products.filter(function (product) {
      return (
        product._id === selectedProductToReceive._id &&
        product.invoice_number === selectedProductToReceive.invoice_number
      );
    });

    if (existing_product.length > 0) {
      showNotification(
        props.t("This product is already added."),
        props.t("Error")
      );
      return;
    }

    //check received quantity not more than ordered quantity
    const products = selectedPO.product_details.filter(
      (product) =>
        product._id === selectedProductToReceive._id &&
        product.invoice_number === selectedProductToReceive.invoice_number
    );
    const total_received =
      Number(products[0].received ? products[0].received : 0) +
      Number(v.quantity);
    if (total_received > products[0].qty) {
      showNotification(
        props.t("Received quantity cannot be more than ordered quantity."),
        props.t("Error")
      );
      return;
    }

    let product_to_add = {};
    product_to_add = Object.assign(product_to_add, selectedProductToReceive);
    product_to_add.quantity = v.quantity;
    product_to_add.total_price = +product_to_add.price * +v.quantity;

    setProductsToReceive([...productsToReceive, product_to_add]);
    //refSelectProduct.current.select.clearValue();
    //refForFormAddProductToReceive.current.reset();
  };

  const [receiptDoc, setReceiptDoc] = useState();
  const handleSubmitReceiptDetails = async (e, v) => {
    //console.log(productsToReceive);
    if (productsToReceive.length > 0) {
      let formData = new FormData();
      formData.set("po_id", selectedPO._id);
      formData.set("product_details", JSON.stringify(productsToReceive));
      formData.set("location_details", JSON.stringify(selectedLocation));
      formData.set("delivery_date", v.delivery_date);
      formData.set("receipt_date", v.receipt_date);
      formData.set("receipt_number", v.receipt_number);
      formData.set("remarks", v.remarks);
      formData.set("received_by", v.received_by);
      if (receiptDoc) formData.append("receipt_doc", receiptDoc);

      let url =
        process.env.REACT_APP_BASEURL +
        "purchaseorders/submit_delivery_details";
      const response = await postSubmitForm_withformdata(url, formData);

      if (response.status === 1) {
        loadAllPO();
        setProductsToReceive([]);
        setReceiptDoc();
        setPurchaseInvoiceModal(!purchaseInvoiceModal);
        showNotification(response.message, "Success");
      } else {
        showNotification(response.message, "Error");
      }
    } else {
      showNotification("Please add at least one product to receive.", "Error");
    }
  };

  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const [itemsModal, setItemsModal] = useState();
  const [selectedPO, setSelectedPO] = useState();
  const [purchaseInvoiceDetails, setPurchaseInvoiceDetails] = useState([]);

  const [deliveryReceipts, setDeliveryReceipts] = useState([]);

  const getPurchaseInvoiceDetails = async (id) => {
    let url = process.env.REACT_APP_BASEURL + "purchaseinvoices/get_by_po";
    const response = await postSubmitForm(url, { po_id: id });

    if (response && response.status === 1) {
      setPurchaseInvoiceDetails(response.data);
      let arr = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].delivery_receipts.length > 0)
          arr = arr.concat(response.data[i].delivery_receipts);
      }

      setDeliveryReceipts(arr);
    }
  };
  const [purchaseInvoiceModal, setPurchaseInvoiceModal] = useState();

  function editFormatter(cell, row) {
    return (
      <>
        {
          <span className="text-info mr-2">
            <i
              className="mdi mdi-file-document-edit font-size-20"
              title="Details"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                setSelectedPO(row);
                setSelectedLocation(row.store_details);
                console.log(row);

                //getPurchaseInvoiceDetails(row._id);

                setPurchaseInvoiceModal(!purchaseInvoiceModal);
              }}
            ></i>
          </span>
        }
      </>
    );
  }
  const handlePurchaseOrderStatusUpdate = async (purchaseorder) => {
    let url = process.env.REACT_APP_BASEURL + "purchaseorders/update_status";
    const response = await postSubmitForm(url, {
      po_id: purchaseorder._id,
      status: purchaseorder.status == "Active" ? "Closed" : "Active",
    });
    if (response && response.status === 1) {
      loadAllPO();
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
            checked={row.status == "Active" ? true : false}
          />
          <label
            title="Click to change status."
            className="custom-control-label"
            htmlFor={"customSwitch1" + row._id}
            style={{ "font-weight": "100", cursor: "pointer" }}
            onClick={() => {
              handlePurchaseOrderStatusUpdate(row);
            }}
          ></label>
        </div>

        {row.status == "Active" ? (
          <span class="font-size-12 badge-soft-success badge badge-success badge-pill">
            Active
          </span>
        ) : (
          <span class="font-size-12 badge-soft-danger badge badge-danger badge-pill">
            Closed
          </span>
        )}
      </>
    );
  }
  const columns = [
    {
      dataField: "_id",
      hidden: true,
    },
    {
      text: props.t("#"),
      dataField: "_id",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "5%" };
      },
    },
    {
      text: props.t("PO Number"),
      dataField: "po_number",
      sort: true,

      formatter: (cell, row) => {
        return (
          <a href={"/print_purchase_order?po_id=" + row._id} target="_blank">
            {row.po_number}
          </a>
        );
      },
    },

    {
      text: props.t("Store Name"),
      dataField: "store_details.name",
      formatter: (cell, row) =>
        `${row.store_details.name} (${row.store_details.code})`,
      sort: true,
    },

    {
      text: props.t("Supplier Name"),
      dataField: "supplier_details.company_name",
      formatter: (cell, row) =>
        `${row.supplier_details.company_name} (${row.supplier_details.code})`,
      sort: true,
    },

    {
      dataField: "po_date",
      text: props.t("Date"),
      formatter: (cell, row) => moment(row.po_date).format("DD/MM/YYYY"),
      sort: true,
    },
    {
      text: props.t("Purchase Invoices"),
      dataField: "purchaseinvoices",
      formatter: (cell, row) => row.purchaseinvoices.join(", "),
      sort: false,
    },
    {
      text: props.t("Status"),
      formatter: showStatusFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "9%" };
      },
      sort: false,
    },
    {
      text: props.t("Action"),
      formatter: editFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
      sort: false,
    },
  ];
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      {" "}
      Showing {from} - {to} of {size} records.
    </span>
  );
  const columns_items = [
    {
      dataField: "item_id",
      hidden: true,
    },
    {
      dataField: "name",
      text: props.t("Name"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },

    {
      text: props.t("Category"),
      dataField: "category",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
    {
      dataField: "order_number",
      text: props.t("Order"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "invoice_number",
      text: props.t("Sales Invoice"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "price",
      text: props.t("Price"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "qty",
      text: props.t("Ordered"),

      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "received",
      text: props.t("Received"),

      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
      formatter: (cell, row) => {
        if (row.received) {
          return row.received;
        } else {
          return 0;
        }
      },
    },
    {
      dataField: "total_price",
      text: props.t("Total Price"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
  ];

  const columns_delivery_items = [
    {
      dataField: "item_id",
      hidden: true,
    },
    {
      dataField: "name",
      text: props.t("Name"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      text: props.t("Category"),
      dataField: "category",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
    {
      dataField: "sub_category",
      text: props.t("Sub-Category"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "price",
      text: props.t("Price"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "quantity",
      text: props.t("Received"),

      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "total_price",
      text: props.t("Total Price"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
  ];
  const columns_delivery_receipts = [
    {
      dataField: "_id",
      hidden: true,
    },
    {
      dataField: "receipt_number",
      text: props.t("Receipt Number"),
      formatter: (cell, row) => (
        <span style={{ color: "blue" }}>{row.receipt_number}</span>
      ),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
      style: { cursor: "pointer" },
    },
    {
      text: props.t("Receipt Date"),
      dataField: "receipt_date",
      formatter: (cell, row) => moment(row.receipt_date).format("DD-MM-YYYY"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
      style: { cursor: "pointer" },
    },
    {
      dataField: "delivery_date",
      text: props.t("Delivery Date"),
      formatter: (cell, row) => moment(row.delivery_date).format("DD-MM-YYYY"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
      style: { cursor: "pointer" },
    },
    {
      dataField: "receipt_doc",
      text: props.t("Receipt Document"),
      formatter: (cell, row) =>
        row.receipt_doc ? (
          <a
            onClick={(e) => e.stopPropagation()}
            href={row.receipt_doc}
            target="_blank"
          >
            View
          </a>
        ) : (
          "Not Available"
        ),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "received_by",
      text: props.t("Received by"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
      style: { cursor: "pointer" },
    },
  ];
  const expandRow = {
    onlyOneExpanding: true,
    renderer: (row) => (
      <div>
        <BootstrapTable
          bootstrap4
          keyField="_id"
          data={row.product_details}
          columns={columns_delivery_items}
          noDataIndication="No data to display."
          striped
          hover
          condensed
        />
      </div>
    ),
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
              setProductsToReceive(arr);
            }}
          ></i>
        </span>
      </>
    );
  }
  const columns_products_to_receive = [
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
      dataField: "order_number",
      text: props.t("Order"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      dataField: "invoice_number",
      text: props.t("Invoice"),
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },

    {
      dataField: "quantity",
      text: props.t("Rec. Quantity"),

      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      dataField: "price",
      text: props.t("Price"),

      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "9%" };
      },
    },
    {
      dataField: "total_price",
      text: props.t("Total Price"),

      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      formatter: deleteFormatter,
      formatExtraData: productsToReceive,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "4%" };
      },
    },
  ];
  const pagination_options = {
    paginationSize: 5,
    pageStartIndex: 1,
    // alwaysShowAllBtns: true, // Always show next and previous button
    // withFirstAndLast: false, // Hide the going to First and Last page button
    // hideSizePerPage: true, // Hide the sizePerPage dropdown always
    // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    firstPageText: "First",
    prePageText: "Prev",
    nextPageText: "Next",
    lastPageText: "Last",
    nextPageTitle: "First",
    prePageTitle: "Pre page",
    firstPageTitle: "Next page",
    lastPageTitle: "Last page",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "5",
        value: 5,
      },
      {
        text: "100",
        value: 100,
      },
      {
        text: "200",
        value: 200,
      },
      {
        text: "All",
        value: selectedPO && selectedPO.items && selectedPO.items.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
    hideSizePerPage: true,
    ignoreSinglePage: true,
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb_2Items
            title={props.t("All Purchase Orders")}
            alternateTitle={props.t("Purchase")}
            breadcrumbItem1={props.t("All Purchase Orders")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Purchase Orders")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all generated purchase orders here")}
                  </CardSubtitle>
                  {loading ? (
                    <Col lg={12} className="text-center">
                      <div
                        class="spinner-border text-primary text-center m-1"
                        role="status"
                      >
                        <span class="sr-only">Loading...</span>
                      </div>
                    </Col>
                  ) : (
                    <ToolkitProvider
                      bootstrap4
                      keyField="_id"
                      data={allPO && allPO}
                      columns={columns}
                      search
                    >
                      {(props) => (
                        <div>
                          <Row>
                            <Col lg={4}>
                              <SearchBar
                                {...props.searchProps}
                                style={{ width: "300px" }}
                              />
                            </Col>
                            <Col lg={4}></Col>
                            <Col lg={4} className="text-right">
                              <select
                                className="form-control"
                                value={poStatus}
                                onChange={(e) => {
                                  setPOStatus(e.target.value);
                                }}
                              >
                                <option>All</option>
                                <option>Active</option>
                                <option>Closed</option>
                              </select>
                            </Col>
                          </Row>
                          <BootstrapTable
                            striped
                            hover
                            condensed
                            noDataIndication={"No data to display"}
                            {...props.baseProps}
                          />
                        </div>
                      )}
                    </ToolkitProvider>
                  )}

                  <Modal
                    size="lg"
                    style={{
                      width: "940px",
                      maxWidth: "950px",
                    }}
                    isOpen={purchaseInvoiceModal}
                    toggle={() =>
                      setPurchaseInvoiceModal(!purchaseInvoiceModal)
                    }
                  >
                    <ModalHeader
                      toggle={() =>
                        setPurchaseInvoiceModal(!purchaseInvoiceModal)
                      }
                    >
                      PO Number: {selectedPO && selectedPO.po_number}
                    </ModalHeader>
                    <ModalBody>
                      {selectedPO && (
                        <>
                          <Row>
                            <Col lg={12}>
                              <Card>
                                <CardBody>
                                  <Row>
                                    <Col lg={12}>
                                      <Label>Ordered Products</Label>
                                      <ToolkitProvider
                                        keyField="_id"
                                        data={
                                          selectedPO &&
                                          selectedPO.product_details
                                        }
                                        columns={columns_items}
                                      >
                                        {(props) => (
                                          <div>
                                            <BootstrapTable
                                              {...props.baseProps}
                                              noDataIndication="No data to display."
                                              striped
                                              hover
                                              condensed
                                            />
                                          </div>
                                        )}
                                      </ToolkitProvider>
                                    </Col>
                                  </Row>
                                  {/* <AvForm
                                    onValidSubmit={handleSubmitInvoiceDetails}
                                  >
                                    <hr />
                                    <Row>
                                      <Col lg={3}>
                                        <AvField
                                          name="invoice_number"
                                          label={props.t("Invoice Number")}
                                          placeholder={props.t(
                                            "Enter Invoice Number"
                                          )}
                                          type="text"
                                        />
                                      </Col>
                                      <Col lg={3}>
                                        <AvField
                                          name="invoice_date"
                                          label={props.t("Invoice Date")}
                                          placeholder={props.t("Select Date")}
                                          type="date"
                                        />
                                      </Col>
                                      <Col lg={4}>
                                        <Label>
                                          {props.t("Invoice Document")}
                                        </Label>
                                        <input
                                          type="file"
                                          className="mb-2"
                                          name="invoiceDoc"
                                          onChange={(e) => {
                                            // if (
                                            //   e.target.files[0].type ==
                                            //     "image/jpeg" ||
                                            //   e.target.files[0].type ==
                                            //     "image/jpg" ||
                                            //   e.target.files[0].type ==
                                            //     "image/png" ||
                                            //   e.target.files[0].type ==
                                            //     "doc/pdf"
                                            // ) {
                                            //   Object.assign(e.target.files[0], {
                                            //     preview: URL.createObjectURL(
                                            //       e.target.files[0]
                                            //     ),
                                            //     formattedSize: formatBytes(
                                            //       e.target.files[0].size
                                            //     ),
                                            //   });

                                            // }
                                            setInvoiceDoc(e.target.files[0]);
                                          }}
                                        />
                                      </Col>
                                      <Col lg={2}>
                                        <FormGroup className="mb-0 text-center">
                                          <div>
                                            <br />
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
                                      <Col lg={12}>
                                        {purchaseInvoiceDetails &&
                                          purchaseInvoiceDetails.map((item) => {
                                            return (
                                              <a
                                                className="btn btn-outline-dark"
                                                href={item.invoice_doc}
                                                target="_blank"
                                              >
                                                {item.invoice_number}
                                              </a>
                                            );
                                          })}
                                      </Col>
                                    </Row>
                                  </AvForm> */}
                                  {selectedPO && (
                                    <Row>
                                      <Col lg={12}>
                                        <hr />
                                        <Label>Delivery Receipts</Label>
                                        <ToolkitProvider
                                          keyField="_id"
                                          data={selectedPO.delivery_receipts}
                                          columns={columns_delivery_receipts}
                                        >
                                          {(props) => (
                                            <div>
                                              <BootstrapTable
                                                {...props.baseProps}
                                                noDataIndication="No data to display."
                                                striped
                                                hover
                                                condensed
                                                expandRow={expandRow}
                                              />
                                            </div>
                                          )}
                                        </ToolkitProvider>
                                      </Col>
                                    </Row>
                                  )}

                                  <hr />
                                  <CardTitle>Add Delivery Receipt</CardTitle>
                                  <CardSubtitle>
                                    Enter following details to add new delivery
                                    receipt
                                  </CardSubtitle>
                                  <CardBody>
                                    <AvForm
                                      onValidSubmit={handleAddProductToReceive}
                                      ref={refForFormAddProductToReceive}
                                    >
                                      <Row
                                        style={{
                                          backgroundColor: "#eee",
                                        }}
                                      >
                                        <Col lg={7}>
                                          <AvField
                                            name="product"
                                            label={props.t("Product")}
                                            type="select"
                                            onChange={(e) => {
                                              const arr =
                                                selectedPO.product_details.filter(
                                                  (obj) => {
                                                    let ar =
                                                      e.target.value.split("/");

                                                    if (ar[1] != "undefined")
                                                      return (
                                                        obj._id == ar[0] &&
                                                        obj.order_number ==
                                                          ar[1]
                                                      );
                                                    else
                                                      return obj._id == ar[0];
                                                  }
                                                );

                                              setSelectedProductToReceive(
                                                arr[0]
                                              );
                                            }}
                                            required
                                          >
                                            <option value="">
                                              Select Product
                                            </option>
                                            {selectedPO &&
                                              selectedPO.product_details.map(
                                                (item) => {
                                                  return (
                                                    <option
                                                      value={
                                                        item._id +
                                                        "/" +
                                                        item.order_number
                                                      }
                                                    >
                                                      {item.name}{" "}
                                                      {item.invoice_number
                                                        ? "(" +
                                                          item.invoice_number +
                                                          ")"
                                                        : ""}
                                                    </option>
                                                  );
                                                }
                                              )}
                                          </AvField>
                                        </Col>

                                        <Col lg={3}>
                                          <Label>
                                            {props.t("Received Quantity")}
                                          </Label>

                                          <AvField
                                            name="quantity"
                                            placeholder={props.t(
                                              "Enter Quantity"
                                            )}
                                            errorMessage="Quantity cannot be empty."
                                            type="text"
                                            validate={{
                                              required: { value: true },
                                              // max: {
                                              //   value:
                                              //     selectedProductToReceive &&
                                              //     selectedProductToReceive.quantity,
                                              //   errorMessage:
                                              //     "Quantity cannot be more than orderd quantity.",
                                              // },
                                              min: {
                                                value: 1,
                                                errorMessage:
                                                  "Quantity should be more than 0.",
                                              },
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
                                            <i class="bx bx-add-to-queue"></i>{" "}
                                            {props.t("Add")}
                                          </Button>
                                        </Col>
                                        {productsToReceive &&
                                          productsToReceive.length > 0 && (
                                            <BootstrapTable
                                              bootstrap4
                                              keyField="_id"
                                              data={
                                                productsToReceive &&
                                                productsToReceive
                                              }
                                              columns={
                                                columns_products_to_receive
                                              }
                                              noDataIndication="No data to display."
                                              striped
                                              hover
                                              condensed
                                            />
                                          )}
                                      </Row>
                                    </AvForm>
                                    <hr />
                                    <AvForm
                                      onValidSubmit={handleSubmitReceiptDetails}
                                    >
                                      <Row>
                                        <Col lg={4}>
                                          <AvField
                                            name="receipt_number"
                                            label={props.t("Receipt Number")}
                                            placeholder={props.t(
                                              "Enter Receipt Number"
                                            )}
                                            type="text"
                                            errorMessage="cannot be empty."
                                            required
                                          />
                                        </Col>
                                        <Col lg={4}>
                                          <AvField
                                            name="receipt_date"
                                            label={props.t("Receipt Date")}
                                            placeholder={props.t("Select Date")}
                                            type="date"
                                            errorMessage="cannot be empty."
                                            required
                                          />
                                        </Col>
                                        <Col lg={4}>
                                          <AvField
                                            name="delivery_date"
                                            label={props.t("Delivery Date")}
                                            placeholder={props.t("Select Date")}
                                            type="date"
                                            errorMessage="cannot be empty."
                                            required
                                          />
                                        </Col>
                                        <Col lg={4}>
                                          <AvField
                                            name="received_by"
                                            label={props.t("Received By")}
                                            placeholder={props.t(
                                              "Enter Recipient Name"
                                            )}
                                            type="text"
                                            errorMessage="cannot be empty."
                                            required
                                          />
                                        </Col>
                                        <Col lg={4}>
                                          <Label>Location</Label>
                                          <Select
                                            onChange={(selected) => {
                                              setSelectedLocation(selected);
                                            }}
                                            value={
                                              selectedLocation &&
                                              selectedLocation
                                            }
                                            options={allLocations}
                                            classNamePrefix="select2-selection"
                                            closeMenuOnSelect={true}
                                            components={animatedComponents}
                                            required
                                          />
                                        </Col>
                                        <Col lg={4}>
                                          <AvField
                                            name="remarks"
                                            label={props.t("Remarks")}
                                            placeholder={props.t(
                                              "Enter Remarks"
                                            )}
                                            type="textarea"
                                          />
                                        </Col>
                                        <Col lg={4}>
                                          <Label>
                                            {props.t("Receipt Document")}
                                          </Label>
                                          <input
                                            type="file"
                                            className="mb-2"
                                            name="receiptDoc"
                                            onChange={(e) => {
                                              // if (
                                              //   e.target.files[0].type ==
                                              //   "image/jpeg" ||
                                              //   e.target.files[0].type ==
                                              //   "image/jpg" ||
                                              //   e.target.files[0].type ==
                                              //   "image/png" ||
                                              //   e.target.files[0].type ==
                                              //   "doc/pdf"
                                              // ) {
                                              //   Object.assign(
                                              //     e.target.files[0],
                                              //     {
                                              //       preview:
                                              //         URL.createObjectURL(
                                              //           e.target.files[0]
                                              //         ),
                                              //       formattedSize: formatBytes(
                                              //         e.target.files[0].size
                                              //       ),
                                              //     }
                                              //   );

                                              // }
                                              setReceiptDoc(e.target.files[0]);
                                            }}
                                          />
                                        </Col>

                                        <Col lg={12}>
                                          <FormGroup className="mb-0 text-center">
                                            <div>
                                              <br />
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
                                  </CardBody>
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
const mapStatetoProps = (state) => {};
export default withRouter(
  connect(mapStatetoProps, {})(withNamespaces()(AllPurchaseOrders))
);
