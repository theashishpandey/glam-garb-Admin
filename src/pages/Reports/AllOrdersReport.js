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
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "../../../node_modules/react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

import { postSubmitForm } from "../../helpers/forms_helper";
import moment from "moment";

const AllOrdersReport = (props) => {


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



     const loadOrderSalesReport = async () => {

          preloader(true)
          let url = process.env.REACT_APP_BASEURL + "reports/allorders_report";
          let payload = {
               date_from: dateFrom || '',
               date_to: dateTo || '',
               // customer_id: selectedCustomer != "All" ? selectedCustomer : '',
               // store_id: selectedStore != 'All' ? selectedStore : '',
               // payment_type: selectedPayment != 'All' ? selectedPayment : "",
               // via: selectedVia != 'All' ? selectedVia : ""

          }
          let response = await postSubmitForm(url, payload);
          console.log(response);

          if (response.status === 1) {

               preloader(false)
               console.log(response);
               setOrderSalesReport(response.data);


          } else {

               preloader(false)
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
     const [orderSalesReport, setOrderSalesReport] = useState([]);

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

          loadAllCustomers();
          loadAllStores();

          const currentDay = new Date();
          const firstDay = new Date(
               currentDay.getFullYear(),
               currentDay.getMonth(),
               1
          );
          setDateFrom(formatDate(firstDay));
          setDateTo(formatDate(currentDay));
     }, []);


     useEffect(() => {
          if (dateFrom > dateTo) {
               loadOrderSalesReport();
          }
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
                    return { width: "3%" };
               },
          },
          {
               dataField: "order_number",

               text: props.t("Order No."),
               headerStyle: (colum, colIndex) => {
                    return { width: "6%" };
               },
          },
          {
               text: props.t("All Products"),
               formatter: (cell, row) => {
                    let allProducts = ''
                    row.product_details.map((ele, idx) => {
                         allProducts += ele.name + "; ";

                    })
                    return allProducts;
               },
               // filter: selectFilter({
               //      options: () => {
               //           const unique = [
               //                ...new Map(
               //                     [
               //                          ...new Set(
               //                               orderSalesReport.map(({ product_details: value }) => ({
               //                                    value: value.name,
               //                                    label: value.name,
               //                               }))
               //                          ),
               //                     ].map((item) => [item["value"], item])
               //                ).values(),
               //           ];

               //           console.log(unique);
               //           return unique;
               //      },
               // }),
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
          // {
          //      text: props.t("Products Color"),
          //      formatter: (cell, row) => {
          //           let allProducts = ''
          //           row.product_details.map((ele, idx) => {
          //                allProducts += ele.variant_details.variantColor

          //           })
          //           return allProducts;
          //      },

          //      headerStyle: (colum, colIndex) => {
          //           return { width: "10%" };
          //      },
          // },
          {
               text: props.t("Via"),
               dataField: 'via',
               headerStyle: (colum, colIndex) => {
                    return { width: "7%" };
               },
               filter: selectFilter({
                    options: () => {
                         const unique = [
                              ...new Map(
                                   [
                                        ...new Set(
                                             orderSalesReport.map(({ via: value }) => ({
                                                  value: value,
                                                  label: value,
                                             }))
                                        ),
                                   ].map((item) => [item["value"], item])
                              ).values(),
                         ];

                         console.log(unique);
                         return unique;
                    },
               }),
          },
          {
               text: props.t("Status"),
               dataField: 'status',
               headerStyle: (colum, colIndex) => {
                    return { width: "8%" };
               },
               filter: selectFilter({
                    options: () => {
                         const unique = [
                              ...new Map(
                                   [
                                        ...new Set(
                                             orderSalesReport.map(({ status: value }) => ({
                                                  value: value,
                                                  label: value,
                                             }))
                                        ),
                                   ].map((item) => [item["value"], item])
                              ).values(),
                         ];

                         console.log(unique);
                         return unique;
                    },
               }),
          },

          {
               text: props.t("Customer Name"),
               // formatter: (cell, row) => {
               //      return row.customer_details.name
               // },
               dataField: "customer_details.name",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
               filter: selectFilter({
                    options: () => {
                         const unique = [
                              ...new Map(
                                   [
                                        ...new Set(
                                             orderSalesReport.map(({ customer_details: value }) => ({
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
          },

          {
               text: props.t("Store Name"),
               dataField: "store_details.name",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "12%" };
               },
               filter: selectFilter({
                    options: () => {
                         const unique = [
                              ...new Map(
                                   [
                                        ...new Set(
                                             orderSalesReport.map(({ store_details: value }) => ({
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
          },
          {
               text: props.t("Created By"),
               dataField: "createdBy.employee_details.name",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "12%" };
               },
               // filter: selectFilter({
               //      options: () => {
               //           const unique = [
               //                ...new Map(
               //                     [
               //                          ...new Set(
               //                               orderSalesReport.map(({ createdBy: value }) => ({
               //                                    value: value.employee_details.name,
               //                                    label: value.employee_details.name,
               //                               }))
               //                          ),
               //                     ].map((item) => [item["value"], item])
               //                ).values(),
               //           ];

               //           console.log(unique);
               //           return unique;
               //      },
               // }),
          },
          {
               text: props.t("IsPaymentPartial"),
               formatter: (cell, row) => {
                    return row.isPaymentPartial ? "Yes" : "No";
               },
               headerStyle: (colum, colIndex) => {
                    return { width: "8%" };
               },
               // filter: selectFilter({
               //      options: () => {
               //           const unique = [
               //                ...new Map(
               //                     [
               //                          ...new Set(
               //                               orderSalesReport.map(({ isPaymentPartial: value }) => ({
               //                                    value: value,
               //                                    label: value,
               //                               }))
               //                          ),
               //                     ].map((item) => [item["value"], item])
               //                ).values(),
               //           ];

               //           console.log(unique);
               //           return unique;
               //      },
               // }),
          },
          {
               text: props.t("Payment Type"),
               // formatter: (cell, row) => {
               //      return row.payment_type ? row.payment_type : "";
               // },
               dataField: "payment_type",
               headerStyle: (colum, colIndex) => {
                    return { width: "8%" };
               },
               filter: selectFilter({
                    options: () => {
                         const unique = [
                              ...new Map(
                                   [
                                        ...new Set(
                                             orderSalesReport.map(({ payment_type: value }) => ({
                                                  value: value,
                                                  label: value,
                                             }))
                                        ),
                                   ].map((item) => [item["value"], item])
                              ).values(),
                         ];

                         console.log(unique);
                         return unique;
                    },
               }),
          },
          {
               text: props.t("Due Amount"),

               formatter: (cell, row) => {
                    if (row.isPaymentPartial) {
                         let payments = 0
                         row.partial_payment.map((ele, idx) => {
                              payments = +ele.amount_due

                         })
                         return payments;
                    }
               },
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "8%" };
               },
          },
          {
               text: props.t("Paid Amount"),
               formatter: (cell, row) => {
                    if (row.isPaymentPartial) {
                         let payments = 0
                         row.partial_payment.map((ele, idx) => {
                              payments = +ele.amount_paid

                         })
                         return payments;
                    }
               },
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "8%" };
               },
          },
          {
               text: props.t("Total Amount"),
               formatter: (cell, row) => {
                    if (row.isPaymentPartial) {
                         let payments = 0
                         row.partial_payment.map((ele, idx) => {
                              payments = +ele.total

                         })
                         return payments;
                    } else {
                         return row.total_amount
                    }
               },
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "8%" };
               },
          },
          {
               text: props.t("Date"),

               formatter: (colum, colIndex) => {
                    return moment(colIndex.createdAt).format("YYYY-MM-DD HH:mm");
               },
               dataField: "createdAt",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
     ];

     const handleDownload = async () => {
          const fileName = "all_orders_report";
          const exportType = "xls";
          var data = JSON.parse(JSON.stringify(orderSalesReport));
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
                              breadcrumbItem={props.t("All Orders Report")}
                         />
                         <Row>
                              <Col lg={6}>
                                   <Card>
                                        <CardBody>
                                             <AvForm>
                                                  <Row>
                                                       <Col lg={4}>
                                                            <AvField
                                                                 name="dateFrom"
                                                                 label={props.t("From Date")}
                                                                 placeholder={props.t("Select")}
                                                                 type="date"
                                                                 value={dateFrom}
                                                                 onChange={(e, v) => {
                                                                      setDateFrom(formatDate(e.target.value));
                                                                 }}
                                                                 errorMessage={props.t("Date cannot be empty.")}
                                                                 validate={{
                                                                      required: { value: true },
                                                                 }}
                                                            />
                                                       </Col>
                                                       <Col lg={4}>
                                                            <AvField
                                                                 name="dateTo"
                                                                 label={props.t("To Date")}
                                                                 placeholder={props.t("Select")}
                                                                 type="date"
                                                                 value={dateTo}
                                                                 onChange={(e, v) => {
                                                                      setDateTo(formatDate(e.target.value));
                                                                 }}
                                                                 errorMessage={props.t("Date cannot be empty.")}
                                                                 validate={{
                                                                      required: { value: true },
                                                                 }}
                                                            />
                                                       </Col>
                                                       <Col lg={4}>
                                                            <Button
                                                                 type="submit"
                                                                 className="btn btn-md btn-success mt-4"
                                                                 onClick={() => {
                                                                      if (dateFrom && dateTo) {

                                                                           loadOrderSalesReport();
                                                                           loadOrderSalesReport();

                                                                      }
                                                                 }}
                                                            >
                                                                 <i className="mdi mdi-checkbox-marked-circle"></i>{" "}
                                                                 {props.t("Check")}
                                                            </Button>
                                                       </Col>
                                                  </Row>

                                             </AvForm>
                                        </CardBody>
                                   </Card>
                              </Col>

                         </Row>

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
                                                       data={
                                                            orderSalesReport &&
                                                            orderSalesReport
                                                       }
                                                       columns={columns_external}
                                                       noDataIndication={props.t("No data to display.")}
                                                       bootstrap4
                                                       search
                                                  >
                                                       {
                                                            // (props) => (
                                                            //      <div>
                                                            //           <Row>
                                                            //                <Col lg={4} md={4} sm={4} xl={4}>
                                                            //                     <SearchBar
                                                            //                          {...props.searchProps}
                                                            //                          style={{ width: "300px" }}
                                                            //                     />
                                                            //                </Col>
                                                            //                <Col lg={4} md={4} sm={4} xl={4}>
                                                            //                     {" "}
                                                            //                     <strong>
                                                            //                          {" "}
                                                            //                          <h5>All Orders Report</h5>
                                                            //                     </strong>{" "}
                                                            //                </Col>



                                                            //           </Row>

                                                            //           {/* <hr />
                                                            //           <Row className="mb-3">
                                                            //                <Col lg={3} md={3} sm={3} xl={3}>
                                                            //                     <select
                                                            //                          name="customer"
                                                            //                          className="form-control"
                                                            //                          onChange={(e, v) => {
                                                            //                               setSelectedCustomer(e.target.value);
                                                            //                               console.log(e.target.value);
                                                            //                          }}
                                                            //                     >
                                                            //                          <option value="All">All Customers</option>
                                                            //                          {allCustomers &&
                                                            //                               allCustomers.map((item) => {
                                                            //                                    return (
                                                            //                                         <option value={item._id}>
                                                            //                                              {item.name}
                                                            //                                         </option>
                                                            //                                    );
                                                            //                               })}
                                                            //                     </select>
                                                            //                </Col>
                                                            //                <Col lg={3} md={3} sm={3} xl={3}>
                                                            //                     <select
                                                            //                          name="store"
                                                            //                          className="form-control"
                                                            //                          onChange={(e, v) => {
                                                            //                               setSelectedStore(e.target.value);
                                                            //                               console.log(e.target.value);
                                                            //                          }}
                                                            //                     >
                                                            //                          <option value="All">All Stores</option>
                                                            //                          {allStores &&
                                                            //                               allStores.map((item) => {
                                                            //                                    return (
                                                            //                                         <option value={item._id}>
                                                            //                                              {item.name}
                                                            //                                         </option>
                                                            //                                    );
                                                            //                               })}
                                                            //                     </select>
                                                            //                </Col>
                                                            //                <Col lg={3} md={3} sm={3} xl={3}>
                                                            //                     <select
                                                            //                          name="payment_type"
                                                            //                          className="form-control"
                                                            //                          onChange={(e, v) => {
                                                            //                               setSelectedPayment(e.target.value);
                                                            //                               console.log(e.target.value);
                                                            //                          }}
                                                            //                     >
                                                            //                          <option value="All">Payment Type</option>
                                                            //                          <option value="cash">Cash</option>
                                                            //                          <option value="card">Card</option>
                                                            //                     </select>
                                                            //                </Col>
                                                            //                <Col lg={3} md={3} sm={3} xl={3}>
                                                            //                     <select
                                                            //                          name="via"
                                                            //                          className="form-control"
                                                            //                          onChange={(e, v) => {
                                                            //                               setSelectedVia(e.target.value);
                                                            //                               console.log(e.target.value);
                                                            //                          }}
                                                            //                     >
                                                            //                          <option value="All">Via</option>
                                                            //                          <option value="Online">Online</option>
                                                            //                          <option value="Offline">Offline</option>
                                                            //                     </select>
                                                            //                </Col>
                                                            //           </Row> */}

                                                            //           <BootstrapTable

                                                            //                style={{ fontSize: "4rem", }}
                                                            //                striped
                                                            //                hover
                                                            //                condensed
                                                            //                {...props.baseProps}
                                                            //                filter={filterFactory()}
                                                            //           />
                                                            //      </div>
                                                            // )

                                                            (props) => (
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
                                                            )



                                                       }
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

export default withRouter(
     connect(null, {})(withNamespaces()(AllOrdersReport))
);
