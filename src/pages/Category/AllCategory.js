import React, { useEffect, useState, useRef } from "react";
import { withNamespaces } from "react-i18next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import {
     Row,
     Col,
     Card,
     CardBody,
     FormGroup,
     Button,
     CardTitle,
     CardSubtitle,
     Container,
     Modal,
     ModalHeader,
     ModalBody,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import showNotification from "../../helpers/show_notification";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import swal from "sweetalert2";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import exportFromJSON from "export-from-json";
import { postSubmitForm } from "../../helpers/forms_helper";

const AllCategory = (props) => {
     const { SearchBar } = Search;
     useEffect(() => {
          loadAllCategories();
     }, []);

     const [allCategories, setAllCategories] = useState([]);
     const [allSubCategories, setAllSubCategories] = useState([]);
     const loadAllCategories = async () => {
          let url = process.env.REACT_APP_BASEURL + "productcategory/getall";
          let response = await postSubmitForm(url, "");
          if (response.status === 1) {
               setAllCategories(response.data);
          } else {
               showNotification(response.message, "Error");
          }
     };
     const [selectedCategory, setSelecetedCategory] = useState([]);
     const [selectedSubCategory, setSelectedSubCategory] = useState();
     const [editModal, setEditModal] = useState();

     const deleteCourse = async (id) => {
          try {
               const object = {
                    product_category_id: id,
               };
               let url =
                    process.env.REACT_APP_BASEURL +
                    "productcategories/delete_product_category";
               let response = await postSubmitForm(url, object);
               if (response.status === 1) {
                    showNotification(response.message, "Success");
                    loadAllCategories();
               } else {
               }
          } catch (error) {
               showNotification("Something Went Wrong", "Error");
          }
     };

     const handleAddNewCategory = async (e, v) => {
          const object = {
               id: selectedCategory._id,
               category: v.category,
          };
          let url =
               process.env.REACT_APP_BASEURL + "productcategories/update_category";
          let response = await postSubmitForm(url, object);
          if (response.status === 1) {
               loadAllCategories();

               setEditModal(!editModal);
          } else {
               showNotification(response.message, "Error");
          }
     };
     const handleAddNewSubCategory = async (e, v) => {
          const object = {
               category: selectedCategory.category,
               sub_category: v.sub_category,
          };
          let url =
               process.env.REACT_APP_BASEURL + "productcategories/insert_subcategory";
          let response = await postSubmitForm(url, object);
          if (response && response.status === 1) {
               showNotification(response.message, "Success");
               loadAllCategories();
               setEditModal(!editModal);
          } else {
               showNotification(response.message, "Error");
          }
     };

     const handleDeleteSubCategory = async (category, subcategory) => {
          console.log(category, subcategory);
          const object = {
               category: category,
               sub_category: subcategory,
          };

          let url =
               process.env.REACT_APP_BASEURL + "productcategories/delete_subcategory";
          let response = await postSubmitForm(url, object);
          if (response && response.status === 1) {
               showNotification(response.message, "Success");
               loadAllCategories();
               // setEditModal(!editModal);
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
               text: props.t("Category Name"),
               dataField: "name",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "16%" };
               },
          },
        
          {
               text: props.t("Action"),
               sort: false,
               formatter: (cell, row) => {
                    return (
                         <Row>
                              <Col lg="6">
                                   <span className="text-info">
                                        <i
                                             className="bx bxs-trash font-size-15 text-danger"
                                             title="Click to Delete"
                                             style={{ cursor: "pointer" }}
                                             onClick={() => {
                                                  swal
                                                       .fire({
                                                            title: "Are you sure?",
                                                            text: "You will not be able to recover this Category!",
                                                            icon: "warning",
                                                            showCancelButton: true,
                                                            cancelButtonText: "No, cancel it!",
                                                            confirmButtonText: "Yes, I am sure!",
                                                            dangerMode: true,
                                                       })
                                                       .then((confirm) => {
                                                            if (confirm.isConfirmed) deleteCourse(row._id);
                                                       });
                                             }}
                                        ></i>
                                   </span>
                              </Col>

                         </Row>
                    );
               },
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
     ];
     const handleDownload = async () => {
          const fileName = "allItemCategories";
          const exportType = "xls";
          let data_to_export = allCategories;
          if (data_to_export) {
               var data = [];
               JSON.parse(JSON.stringify(data_to_export)).forEach(function (v) {
                    data.push({
                         category: v.category,
                         sub_category: v.sub_category,
                    });
               });
               exportFromJSON({ data, fileName, exportType });
          }
     };
     function printDiv(divName) {
          let printContents = document.getElementById(divName);
          let searchelement = printContents.getElementsByClassName("sr-only");
          if (searchelement && searchelement[0]?.parentNode) {
               searchelement[0].parentNode.removeChild(searchelement[0]);
          }
          var winPrint = window.open(
               "",
               "",
               "left=0,top=0,toolbar=0,scrollbars=0,status=0"
          );
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
     }
     return (
          <React.Fragment>
               <div className="page-content">
                    <Container fluid={true}>
                         <Breadcrumbs
                              title={props.t("Product Category")}
                              breadcrumbItem={props.t("All Product Category")}
                         />
                         <Row>
                              <Col className="col-12">
                                   <Card>
                                        <CardBody>
                                             <CardTitle>{props.t("All Product Categories")} </CardTitle>
                                             <CardSubtitle className="mb-3">
                                                  {props.t(
                                                       "View/Update all your existing course categories here"
                                                  )}
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
                                                       {"  "}
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
                                                       bootstrap4
                                                       keyField="_id"
                                                       data={allCategories && allCategories}
                                                       columns={columns}
                                                       noDataIndication={props.t("No data to display.")}
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
                                                                      <Col lg={4}>
                                                                           {" "}
                                                                           <CardTitle>Product Category</CardTitle>
                                                                      </Col>
                                                                 </Row>
                                                                 <BootstrapTable
                                                                      striped
                                                                      hover
                                                                      condensed
                                                                      {...props.baseProps}
                                                                 />
                                                            </div>
                                                       )}
                                                  </ToolkitProvider>
                                             </div>
                                             <Modal
                                                  size="md"
                                                  isOpen={editModal}
                                                  toggle={() => setEditModal(!editModal)}
                                             >
                                                  <ModalHeader toggle={() => setEditModal(!editModal)}>
                                                       Category: {selectedCategory && selectedCategory.category}
                                                  </ModalHeader>
                                                  <ModalBody>
                                                       <>
                                                            <Row>
                                                                 <Col lg={12}>
                                                                      <Card>
                                                                           <CardBody>
                                                                                <AvForm onValidSubmit={handleAddNewSubCategory}>
                                                                                     <Row>
                                                                                          <Col lg={12}>
                                                                                               <AvField
                                                                                                    name="sub_category"
                                                                                                    label={props.t("Add Sub Category")}
                                                                                                    placeholder={props.t(
                                                                                                         "Enter Sub Category Name"
                                                                                                    )}
                                                                                                    type="text"
                                                                                                    validate={{
                                                                                                         required: {
                                                                                                              value: true,
                                                                                                              errorMessage: props.t(
                                                                                                                   "Name cannot be empty"
                                                                                                              ),
                                                                                                         },
                                                                                                    }}
                                                                                               />
                                                                                          </Col>{" "}
                                                                                     </Row>
                                                                                     <Row>
                                                                                          <Col lg={12}>
                                                                                               <FormGroup className="mb-0 text-center">
                                                                                                    <div>
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
                                                                                     </Row>
                                                                                </AvForm>
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

export default withRouter(connect(null, {})(withNamespaces()(AllCategory)));
