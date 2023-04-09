import React, { useEffect, useState, useRef } from "react";
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
import Select from "react-select";
import makeAnimated from "react-select/animated";

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
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import { postSubmitForm } from "../../helpers/forms_helper";
import moment from "moment";

const animatedComponents = makeAnimated();
const AllProductReport = (props) => {
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
     const refSelectProduct = useRef(null);

     const [dateFrom, setDateFrom] = useState();
     const [dateTo, setDateTo] = useState();
     const [selectedProduct, setSelectedProduct] = useState();
     const [allProducts, setAllProducts] = useState([]);
     const [selectedColor, setSelectedColor] = useState();
     const [selectedSize, setSelectedSize] = useState();

     const [selectedCategory, setSelectedCategory] = useState();
     const [selectedSubCategory, setSelectedSubCategory] = useState();

     const [productReport, setProductReport] = useState([]);

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
          loadAllProducts();

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
               loadProductsReport();
          }
     }, []);
     const loadAllProducts = async () => {

          let url = process.env.REACT_APP_BASEURL + "products/getall";
          let response = await postSubmitForm(url, "");

          if (response.status === 1) {

               setAllProducts(response.data);

          } else {

               showNotification(response.message, "Error");
          }
     };
     const loadProductsReport = async () => {
          preloader(true)
          let url = process.env.REACT_APP_BASEURL + "reports/allproducts_report";
          console.log(selectedProduct)
          const response = await postSubmitForm(url, {
               date_to: dateTo || '',
               date_from: dateFrom || '',
               // color: selectedColor || '',
               // size: selectedSize || '',
               // category: selectedCategory || '',
               // subcategory: selectedSubCategory || '',
               // product_id: selectedProduct && selectedProduct._id ? selectedProduct._id : ''
          });
          if (response && response.status === 1) {
               preloader(false);
               console.log(response);
               setProductReport(response.data);

          } else {
               preloader(false);
               showNotification(response.message, "Error");
          }
     };

     function showNotification(message, type) {
          if (type === "Success") swal.fire(type, message, "success");
          else swal.fire(type, message, "error");
     }

     const columns_external = [
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
               text: props.t("Product Name"),
               dataField: "name",
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
                                             productReport.map(({ name: value }) => ({
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
               dataField: "category",
               text: props.t("Category"),
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
                                             productReport.map(({ category: value }) => ({
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
               dataField: "sub_category",
               text: props.t("Sub-Category"),
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
                                             productReport.map(({ sub_category: value }) => ({
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
               dataField: "model_name",
               text: props.t("Model Name"),
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
                                             productReport.map(({ model_name: value }) => ({
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
               dataField: "is_online",
               text: props.t("Published"),

               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
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
          const fileName = "product_sales_report";
          const exportType = "xls";
          var data = JSON.parse(JSON.stringify(productReport));
          data.forEach(function (v) {
               v.name = v.name;
               v.category = v.category;
               v.model_name = v.model_name;

               v.billed_at = moment(v.createdAt).format("DD/MM/YYYY hh:mm");

               delete v._id;
               delete v.variant_details;
               delete v.descriptions;

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
                              breadcrumbItem={props.t("All Products Report")}
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

                                                                           loadProductsReport();
                                                                           loadProductsReport();

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
                                                  <Col sm={4}>


                                                       {" "}
                                                       <strong>
                                                            {" "}
                                                            <h5>All Products Report</h5>
                                                       </strong>{" "}


                                                  </Col>


                                             </Row>


                                             <div id="printDiv">
                                                  <ToolkitProvider
                                                       keyField="_id"
                                                       data={
                                                            productReport &&
                                                            productReport
                                                       }
                                                       columns={columns_external}
                                                       noDataIndication={props.t("No data to display.")}
                                                       bootstrap4
                                                       search
                                                  >
                                                       {(props) => (
                                                            <AvForm>
                                                                 <Row>
                                                                      {/* <Col lg={3} md={3} sm={3} xl={3}>
                                                                           <SearchBar
                                                                                {...props.searchProps}
                                                                                style={{ width: "200px" }}
                                                                           />
                                                                      </Col> */}
                                                                      {/* <Col lg={4} >
                                                                           <Label>Select Product</Label>
                                                                           <Select
                                                                                ref={refSelectProduct}
                                                                                value={selectedProduct && selectedProduct}
                                                                                onChange={(selected) => {
                                                                                     setSelectedProduct(selected);
                                                                                     console.log(selected)
                                                                                }}
                                                                                placeholder="Select Product"
                                                                                options={allProducts}
                                                                                classNamePrefix="select2-selection"
                                                                                components={animatedComponents}

                                                                                validate={{ required: { value: true } }}
                                                                                errorMessage="Select Product"
                                                                           />
                                                                      </Col>

                                                                      <Col sm={4} >

                                                                           <Label>Select Product Color</Label>
                                                                           <AvField
                                                                                name="selected_color"

                                                                                placeholder="Select Color"
                                                                                type="select"


                                                                                onChange={(e, v) => {
                                                                                     // let selectedVariant = selectedProduct && selectedProduct.variant_details && selectedProduct.variant_details.find(ele => ele.variantColor == selected.target.value)
                                                                                     setSelectedColor(e.target.value)
                                                                                     console.log(e.target.value)
                                                                                }}
                                                                           >
                                                                                <option value=""> Select Size</option>
                                                                                {selectedProduct &&
                                                                                     selectedProduct.variant_details.map((r) => (
                                                                                          <option key={r.variantColor} value={r.variantColor}>
                                                                                               {`${r.variantColor && r.variantColor}`}
                                                                                          </option>
                                                                                     ))}
                                                                           </AvField>
                                                                      </Col>

                                                                      <Col sm={4}>
                                                                           <Label>Select Product Size</Label>
                                                                           <AvField
                                                                                name="selected_size"

                                                                                placeholder="Select Size"
                                                                                type="select"
                                                                                validate={{ required: { value: true } }}

                                                                                onChange={(e, v) => {
                                                                                     // let selectedVariant = selectedProduct && selectedProduct.variant_details && selectedProduct.variant_details.find(ele => ele.variantSize == selected.target.value)
                                                                                     setSelectedSize(e.target.value)
                                                                                     console.log(e.target.value)
                                                                                }}
                                                                           >
                                                                                <option value=""> Select Size</option>
                                                                                {selectedProduct &&
                                                                                     selectedProduct.variant_details.map((r) => (
                                                                                          <option key={r.variantSize} value={r.variantSize}>
                                                                                               {`${r.variantSize && r.variantSize}`}
                                                                                          </option>
                                                                                     ))}
                                                                           </AvField>
                                                                      </Col> */}


                                                                 </Row>
                                                                 {/* <hr />
                                                                 <Row className="mb-2">
                                                                      <Col sm="4">
                                                                           <Label>Select Product Category</Label>
                                                                           <AvField
                                                                                name="selected_sub_category"

                                                                                placeholder="Select Category"
                                                                                type="select"


                                                                                onChange={(e, v) => {
                                                                                     //let selectedCategory = allProducts && allProducts.find(ele => ele.category == selected.target.value)
                                                                                     setSelectedCategory(e.target.value)
                                                                                     console.log(e.target.value)
                                                                                }}
                                                                           >
                                                                                <option value=""> Select Category</option>
                                                                                {allProducts &&
                                                                                     allProducts.map((r) => (
                                                                                          <option key={r.category} value={r.category}>
                                                                                               {`${r.category && r.category}`}
                                                                                          </option>
                                                                                     ))}
                                                                           </AvField>

                                                                      </Col>

                                                                      <Col sm="4">
                                                                           <Label>Select Product Sub-Category</Label>
                                                                           <AvField
                                                                                name="selected_sub_category"

                                                                                placeholder="Select Sub-Category"
                                                                                type="select"


                                                                                onChange={(e, v) => {
                                                                                     // let selectedSubCategory = allProducts && allProducts.find(ele => ele.sub_category == selected.target.value)
                                                                                     setSelectedSubCategory(e.target.value)
                                                                                     console.log(e.target.value)
                                                                                }}
                                                                           >
                                                                                <option value=""> Select Sub-Category</option>
                                                                                {allProducts &&
                                                                                     allProducts.map((r) => (
                                                                                          <option key={r.sub_category} value={r.sub_category}>
                                                                                               {`${r.sub_category && r.sub_category}`}
                                                                                          </option>
                                                                                     ))}
                                                                           </AvField>
                                                                      </Col>

                                                                      <Col sm="3">

                                                                      </Col>
                                                                 </Row> */}





                                                                 <BootstrapTable
                                                                      style={{ fontSize: "4rem" }}
                                                                      striped
                                                                      hover
                                                                      condensed
                                                                      {...props.baseProps}
                                                                      filter={filterFactory()}
                                                                 />
                                                            </AvForm>
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
     connect(null, {})(withNamespaces()(AllProductReport))
);
