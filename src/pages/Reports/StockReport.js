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
  Label,
} from "reactstrap";
import swal from "sweetalert2";

import {
  AvForm,
  AvField,
  AvRadio,
  AvRadioGroup,
} from "availity-reactstrap-validation";
import Select from "react-select";
import makeAnimated from "react-select/animated";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import filterFactory, { selectFilter, textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "../../../node_modules/react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

import { postSubmitForm } from "../../helpers/forms_helper";
import moment from "moment";

const StockReport = (props) => {
  function preloader(status) {
    if (status) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  }

  const loadAllCustomers = async () => {
    let url = process.env.REACT_APP_BASEURL + "customers/getall";
    const response = await postSubmitForm(url, {});
    if (response && response.status === 1) {
      setAllCustomers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const loadAllStores = async () => {
    let url = process.env.REACT_APP_BASEURL + "stores/getall";
    const response = await postSubmitForm(url, {});
    if (response && response.status === 1) {
      setAllStores(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const loadStockReport = async () => {
    preloader(true);
    let url = process.env.REACT_APP_BASEURL + "reports/stock_report";
    let payload = {
      //   date_from: dateFrom || "",
      //   date_to: dateTo || "",
      // customer_id: selectedCustomer != "All" ? selectedCustomer : '',
      // store_id: selectedStore != 'All' ? selectedStore : '',
      // payment_type: selectedPayment != 'All' ? selectedPayment : "",
      // via: selectedVia != 'All' ? selectedVia : ""
    };
    let response = await postSubmitForm(url, payload);
    console.log(response);

    if (response.status === 1) {
      preloader(false);

      setStockReport(response.data);
    } else {
      preloader(false);
      showNotification(response.message, "Error");
    }
  };

  const { SearchBar } = Search;
  const [allStores, setAllStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("All");
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [selectedVia, setSelectedVia] = useState("All");
  const [stockReport, setStockReport] = useState([]);

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  useEffect(() => {
    loadAllStores();
    loadStockReport();
    loadStockReport();
    const currentDay = new Date();
    const firstDay = new Date(
      currentDay.getFullYear(),
      currentDay.getMonth(),
      1
    );
    setDateFrom(formatDate(firstDay));
    setDateTo(formatDate(currentDay));
  }, []);

  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const columns_external = [
    {
      dataField: "_id",
      formatter: (cell, row, rowIndex) => {
        return rowIndex + 1;
      },
      text: props.t("#"),
      headerStyle: (colum, colIndex) => {
        return { width: "5%" };
      },
    },
    {
      dataField: "store_details.name",
      sort: true,
      text: props.t("Store"),
      filter: selectFilter({
        options: () => {
          const unique = [
            ...new Map(
              [
                ...new Set(
                  stockReport.map(({ store_details: value }) => ({
                    value: value.name,
                    label: value.name,
                  }))
                ),
              ].map((item) => [item["value"], item])
            ).values(),
          ];

          console.log(unique);
          return unique;
        },
      }),
      headerStyle: (colum, colIndex) => {
        return { width: "14%" };
      },
    },
    {
      dataField: "product_details.name",
      sort: true,
      text: props.t("Product"),
      filter: textFilter(),
      headerStyle: (colum, colIndex) => {
        return { width: "14%" };
      },
    },
    {
      dataField: "available",
      sort: true,
      text: props.t("Available"),
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      dataField: "blocked",
      sort: true,
      text: props.t("Blocked"),
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      dataField: "available",
      sort: true,
      text: props.t("Total"),
      formatter: (cell, row, rowIndex) => {
        return Number(row.available) + Number(row.blocked);
      },
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
  ];

  const handleDownload = async () => {
    const fileName = "all_orders_report";
    const exportType = "xls";
    var data = JSON.parse(JSON.stringify(stockReport));
    data.forEach(function (v) {
      v.billed_at = moment(v.createdAt).format("DD/MM/YYYY hh:mm");

      delete v._id;
      delete v.appointment_id;
      delete v.sold_product_details;
      delete v.procedure_amount;
      delete v.sold_product_amount;
      delete v.total_amount;
      delete v.paid_amount;
      delete v.discount;
      delete v.final_amount;
      delete v.payment_details;
      delete v.coupon_discount;
      delete v.store_details;
      delete v.product_supplier_joint;
      delete v.customer_details;
      delete v.product_details;
      delete v.createdBy;
      delete v.coupon_details;
      delete v.shipping_address;
      delete v.is_active;
      delete v.paid_by_cash;
      delete v.paid_by_card;
      delete v.from_wallet;
      delete v.remarks;
      delete v.invoice_number;
      delete v.patient_details;
      delete v.product_details;
      delete v.is_active;

      delete v.__v;
      delete v.sales_transactions;
      delete v.use_transactions;
      delete v.status;
      delete v.quantity;
      delete v.procedure_details;
      delete v.sale_id;
    });
    exportFromJSON({ data, fileName, exportType });
  };
  function printDiv(divName) {
    let printContents = document.getElementById(divName);
    let searchelement = printContents.getElementsByClassName("sr-only");
    // let searchelement = printdoc.getElementById("search-bar-0-label");
    // const savedChild = searchelement;
    // console.log(searchelement);
    if (searchelement && searchelement[0]?.parentNode) {
      searchelement[0].parentNode.removeChild(searchelement[0]);
    }
    // printContents.getElementsByClassName(".col-lg-5 .search-label").remove();

    var winPrint = window.open(
      "",
      "",
      "left=0,top=0,toolbar=0,scrollbars=0,status=0"
    );
    // winPrint.document.body.innerHTML = printContents;
    winPrint.document.write(
      `<title>${divName} Report</title>
      <head>
        <style>
          table {
            table-layout: fixed;
            font-family: "Poppins", sans-serif;
            border: 1px solid #eff2f7;
            font-size: 12px;
            border-collapse: collapse;
            max-width: 100%;
            color: #495057;
        
          
            margin-bottom: 1rem;
            margin-top: 1rem;
          }
          
          for-print-heading {
            font-size: 16px;
            margin: 0 0 7px 0;
            font-weight: bold;
          }

          for-print-sub_heading {
            font-size: 14px;
            margin: 0 0 7px 0;
            font-weight: normal !important;
          }

          table td, table th {
            border: 1px solid #ddd;
            padding: 8px;
          }
          
          table tr:nth-child(even){background-color: #f2f2f2;}
          
          table tr:hover {background-color: #ddd;}
          
          table th {            
            text-align: left;
          }
        </style>
      </head>
      <body>
        ${printContents.innerHTML}
      </body>
      `
    );
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    //winPrint.close();
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Reports")}
            breadcrumbItem={props.t("Stock Report")}
          />

          <Row className="fontbigger">
            <Col className="col-12">
              <Card>
                <CardBody>
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
                      {"   "}
                      <Link
                        to="#"
                        onClick={() => {
                          printDiv("printDiv");
                        }}
                        className="btn btn-sm btn-success mr-2"
                      >
                        <i className="fa fa-print"></i> Print
                      </Link>
                      <div className="search-box mr-2 mb-2 d-inline-block">
                        <div className="position-relative"></div>
                      </div>
                    </Col>
                  </Row>
                  <div id="printDiv">
                    <ToolkitProvider
                      keyField="_id"
                      data={stockReport && stockReport}
                      columns={columns_external}
                      noDataIndication={props.t("No data to display.")}
                      bootstrap4
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
                            filter={filterFactory()}
                          />
                        </div>
                      )}
                    </ToolkitProvider>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(connect(null, {})(withNamespaces()(StockReport)));
