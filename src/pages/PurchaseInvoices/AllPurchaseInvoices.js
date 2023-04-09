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

const AllPurchaseInvoices = (props) => {
  const refForFormAddProductToReceive = useRef(null);
  const refSelectProduct = useRef(null);
  const { SearchBar } = Search;
  const [loading, setLoading] = useState(false);
  const [piStatus, setPIStatus] = useState("All");
  useEffect(() => {
    loadAllPI();
  }, [piStatus]);

  const [allPI, setAllPI] = useState([]);
  const loadAllPI = async () => {
    setLoading(true);
    let url = process.env.REACT_APP_BASEURL + "purchaseinvoices/get_by_status";
    const response = await postSubmitForm(url, { status: piStatus });

    if (response && response.status === 1) {
      setAllPI(response.data);
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
  const handleSubmitInvoiceDetails = async (e, v) => {
    let formData = new FormData();
    formData.set("po_id", purchaseInvoiceDetails.po_details._id);
    formData.set("invoice_number", v.invoice_number);
    formData.set("invoice_date", v.invoice_date);
    if (invoiceDoc) formData.append("invoice_doc", invoiceDoc);

    let url =
      process.env.REACT_APP_BASEURL + "purchaseinvoices/submit_invoice_details";
    const response = await postSubmitForm_withformdata(url, formData);

    if (response.status === 1 && response.data) {
      loadAllPI();
      setPurchaseInvoiceModal(!purchaseInvoiceModal);
      showNotification(response.message, "Success");
    } else {
      showNotification(response.message, "Error");
    }
  };

  const [productsToReceive, setProductsToReceive] = useState([]);
  const [selectedProductToReceive, setSelectedProductToReceive] = useState();
  const handleAddProductToReceive = async (e, v) => {
    var new_array_products = JSON.parse(JSON.stringify(productsToReceive));
    const existing_product = new_array_products.filter(function (product) {
      return product._id === selectedProductToReceive._id;
    });

    if (existing_product.length > 0) {
      showNotification(
        props.t("This product is already added."),
        props.t("Error")
      );
    } else if (selectedProductToReceive) {
      let product_to_add = {};
      product_to_add = Object.assign(product_to_add, selectedProductToReceive);
      product_to_add.quantity = v.quantity;
      product_to_add.total_price = +product_to_add.price * +v.quantity;
      setProductsToReceive([...productsToReceive, product_to_add]);
      refSelectProduct.current.select.clearValue();
      refForFormAddProductToReceive.current.reset();
    } else {
      showNotification(props.t("Select a product first."), props.t("Error"));
    }
  };

  const [receiptDoc, setReceiptDoc] = useState();
  const handleSubmitReceiptDetails = async (e, v) => {
    if (productsToReceive.length > 0) {
      let formData = new FormData();
      formData.set("po_id", purchaseInvoiceDetails.po_details._id);
      formData.set("product_details", JSON.stringify(productsToReceive));
      formData.set("delivery_date", v.delivery_date);
      formData.set("receipt_date", v.receipt_date);
      formData.set("receipt_number", v.receipt_number);
      formData.set("remarks", v.remarks);
      formData.set("received_by", v.received_by);
      if (receiptDoc) formData.append("receipt_doc", receiptDoc);

      let url =
        process.env.REACT_APP_BASEURL +
        "purchaseinvoices/submit_delivery_details";
      const response = await postSubmitForm_withformdata(url, formData);

      if (response.status === 1 && response.data) {
        loadAllPI();
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
  const [selectedPI, setSelectedPI] = useState();
  const [purchaseInvoiceDetails, setPurchaseInvoiceDetails] = useState();

  const [purchaseInvoiceModal, setPurchaseInvoiceModal] = useState();
  function editFormatter(cell, row) {
    return (
      <>
        {row.status === "Active" && (
          <span className="text-info mr-2">
            <i
              className="mdi mdi-file-document-edit font-size-20"
              title="Details"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                setSelectedPI(row);

                let url =
                  process.env.REACT_APP_BASEURL + "purchaseinvoices/get_by_id";
                const response = await postSubmitForm(url, { id: row._id });

                if (response && response.status === 1) {
                  setPurchaseInvoiceDetails(response.data);
                }

                setPurchaseInvoiceModal(!purchaseInvoiceModal);
              }}
            ></i>
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
      text: props.t("PI Number"),
      dataField: "invoice_number",
      sort: true,

      formatter: (cell, row, rowIndex) => {
        return row.invoice_doc ? (
          <a href={row.invoice_doc}>{row.invoice_number}</a>
        ) : (
          row.invoice_number
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
      text: props.t("Purchase Orders"),
      dataField: "invoice_number",
      formatter: (cell, row) => {
        let arr = row.po_details.map((obj) => obj.po_number);
        let unique = [...new Set(arr)].join(", ");
        return unique;
      },
      sort: true,
    },

    {
      dataField: "invoice_date",
      text: props.t("Date"),
      formatter: (cell, row) => moment(row.po_date).format("DD/MM/YYYY"),
      sort: true,
    },
    {
      text: props.t("Action"),
      formatter: editFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
  ];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      {" "}
      Showing {from} - {to} of {size} records.
    </span>
  );

  const columns_po = [
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
      dataField: "sub_category",
      text: props.t("Sub-Category"),
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
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
        value: selectedPI && selectedPI.items && selectedPI.items.length,
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
            title={props.t("All Purchase Invoices")}
            alternateTitle={props.t("Purchase")}
            breadcrumbItem1={props.t("All Purchase Invoices")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Purchase Invoices")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all generated purchase invoices here")}
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
                      data={allPI && allPI}
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
                              {/* <select
                                className="form-control"
                                value={piStatus}
                                onChange={(e) => {
                                  setPIStatus(e.target.value);
                                }}
                              >
                                <option>All</option>
                                <option>Active</option>
                                <option>Closed</option>
                              </select> */}
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
                      PI Number:{" "}
                      {purchaseInvoiceDetails &&
                        purchaseInvoiceDetails.invoice_number}
                    </ModalHeader>
                    <ModalBody>
                      {purchaseInvoiceDetails && (
                        <>
                          <Row>
                            <Col lg={12}>
                              <ToolkitProvider
                                keyField="_id"
                                data={selectedPI && selectedPI.po_details}
                                columns={columns_po}
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
  connect(mapStatetoProps, {})(withNamespaces()(AllPurchaseInvoices))
);
