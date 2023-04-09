import React, { useEffect, useState } from "react";
//i18n
import { withNamespaces } from "react-i18next";
import exportFromJSON from "export-from-json";

import {
     Row,
     Col,
     Card,
     CardBody,

     Container,

     Button,
     Label,
} from "reactstrap";
import swal from "sweetalert2";

import {
     AvForm,
     AvField,

} from "availity-reactstrap-validation";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "../../../node_modules/react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

import { postSubmitForm } from "../../helpers/forms_helper";
import moment from "moment";

const SupplierPurchaseReport = (props) => {
     function preloader(status) {
          if (status) {
               document.getElementById("preloader").style.display = "block";
               document.getElementById("status").style.display = "block";
          } else {
               document.getElementById("preloader").style.display = "none";
               document.getElementById("status").style.display = "none";
          }
     }
     const { SearchBar } = Search;

     const [dateFrom, setDateFrom] = useState();
     const [dateTo, setDateTo] = useState();
     const [allSupplier, setAllSupplier] = useState([]);
     const [selectedSupplier, setSelectedSupplier] = useState("");

     const [supplierPurchaseReport, setSupplierPurchaseReport] = useState([]);
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
          loadAllSupplier();

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
               loadSupplierPurchaseReport();
          }
     }, []);

     const loadAllSupplier = async () => {
          let url = process.env.REACT_APP_BASEURL + "suppliers/getall";
          const response = await postSubmitForm(url, {});
          if (response && response.status === 1) {
               setAllSupplier(response.data);
          } else {
               showNotification(response.message, "Error");
          }
     };



     const loadSupplierPurchaseReport = async () => {
          preloader(true)

          let url = process.env.REACT_APP_BASEURL + "reports/supplier_purchase_report";

          let payload = {
               date_from: dateFrom || '',
               date_to: dateTo || '',
               // supplier_id: selectedSupplier ? selectedSupplier : ""
          }

          let response = await postSubmitForm(url, payload);
          if (response.status === 1) {
               preloader(false)
               console.log(response);
               setSupplierPurchaseReport(response.data);


          } else {

               preloader(false)
               showNotification(response.message, "Error");
          }

     };

     function showNotification(message, type) {
          if (type === "Success") swal.fire(type, message, "success");
          else swal.fire(type, message, "error");
     }
     //  total prod
     //      po no
     //      pomdate 
     //      store
     //      suppliername
     //      total amt
     //      date
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
               text: props.t("Total Product"),

               formatter: (cell, row) => {
                    return row.product_details ? row.product_details.length : ""
               },
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
          {
               text: props.t("Store Name"),

               formatter: (cell, row) => {
                    return row.store_details ? row.store_details.name : ""
               },
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
          {
               text: props.t("Supplier Name"),

               // formatter: (cell, row) => {
               //      return row.supplier_details ? row.supplier_details.company_name : ""
               // },
               dataField: "supplier_details.company_name",
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
                                             supplierPurchaseReport.map(({ supplier_details: value }) => ({
                                                  value: value.company_name,
                                                  label: value.company_name,
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
               text: props.t("Total Amount"),

               formatter: (cell, row) => {
                    return row.total_amount
               },
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
          {
               text: props.t("Po Date"),

               formatter: (colum, colIndex) => {
                    return moment(colIndex.po_date).format("YYYY-MM-DD");
               },
               dataField: "po_date",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
          {
               text: props.t("Created At"),

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
          const fileName = "supplier_purchase_report";
          const exportType = "xls";
          var data = JSON.parse(JSON.stringify(supplierPurchaseReport));
          data.forEach(function (v) {

               v.total_product = v.product_details.length
               v.store_name = v.store_details.name
               v.company_name = v.supplier_details.company_name
               v.total_amount = v.total_amount
               v.po_date = moment(v.po_date).format("DD/MM/YYYY hh:mm");
               v.date = moment(v.createdAt).format("DD/MM/YYYY hh:mm");
               v.store_name = supplierPurchaseReport.map((i) => {
                    return i.store_details.name
               })
               v.supplier_name = supplierPurchaseReport.map((i) => {
                    return i.supplier_details.company_name
               })
               delete v.store_details;
               delete v.supplier_details;
               delete v._id;
               delete v.appointment_id;
               delete v.sold_product_details;
               delete v.procedure_amount;
               delete v.sold_product_amount;
               delete v.total_amount;
               delete v.paid_amount;
               delete v.discount;
               delete v.final_amount;
               delete v.paid_by_cash;
               delete v.paid_by_card;
               delete v.from_wallet;
               delete v.remarks;
               delete v.invoice_number;
               delete v.patient_details;
               delete v.product_details;
               delete v.is_active;
               delete v.createdAt;
               delete v.updatedAt;
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
                              breadcrumbItem={props.t("Supplier Purchase Report")}
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

                                                                           loadSupplierPurchaseReport();
                                                                           loadSupplierPurchaseReport();

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
                                                            supplierPurchaseReport &&
                                                            supplierPurchaseReport
                                                       }
                                                       columns={columns}
                                                       noDataIndication={props.t("No data to display.")}
                                                       bootstrap4
                                                       search
                                                  >
                                                       {(props) => (
                                                            <div>
                                                                 <Row>
                                                                      <Col lg={4} md={4} sm={4} xl={4}>
                                                                           <SearchBar
                                                                                {...props.searchProps}
                                                                                style={{ width: "300px" }}
                                                                           />
                                                                      </Col>
                                                                      <Col lg={4} md={4} sm={4} xl={4}>
                                                                           {" "}
                                                                           <strong>
                                                                                {" "}
                                                                                <h5>Supplier Purchase Report</h5>
                                                                           </strong>{" "}
                                                                      </Col>
                                                                      {/* <Col lg={4} md={4} sm={4} xl={4}>
                                                                           <select
                                                                                name="supplier"
                                                                                className="form-control"
                                                                                onChange={(e, v) => {
                                                                                     setSelectedSupplier(e.target.value);
                                                                                     console.log(e.target.value);
                                                                                }}
                                                                           >
                                                                                <option value="">All Supplier</option>
                                                                                {allSupplier &&
                                                                                     allSupplier.map((item) => {
                                                                                          return (
                                                                                               <option value={item._id}>
                                                                                                    {item.company_name}
                                                                                               </option>
                                                                                          );
                                                                                     })}
                                                                           </select>
                                                                      </Col> */}



                                                                 </Row>
                                                                 <BootstrapTable
                                                                      style={{ fontSize: "4rem" }}
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

export default withRouter(
     connect(null, {})(withNamespaces()(SupplierPurchaseReport))
);
