import React, { useEffect, useState, useRef } from "react";
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
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import showNotification from "../../helpers/show_notification";
import { postSubmitForm } from "../../helpers/forms_helper";

const AddCategory = (props) => {
    
     useEffect(() => {
          loadAllCategories();
     }, []);

     const [allCategories, setAllCategories] = useState([]);
     const loadAllCategories = async (e, v) => {
          let url = process.env.REACT_APP_BASEURL + "productcategory/getall";
          let response = await postSubmitForm(url, "");
          if (response.status === 1) {
               setAllCategories(response.data);
          } else {
               showNotification(response.message, "Error");
          }
     };
     const refContainer = useRef(null);

     const handleValidSubmit = async (e, v) => {
          try {
               const object = {
                    name: v.name,
                   
               };
               let url = process.env.REACT_APP_BASEURL + "productcategory/insert";
               let response = await postSubmitForm(url, object);
               if (response.status === 1) {
                    loadAllCategories();
                   
                    showNotification(response.message, "Success");
                    refContainer.current.reset();
               } else {
                    showNotification(response.message, "Error");
               }
          } catch (error) {
               showNotification(error.message, "Error");
          }
     };

     const columns = [
          {
               dataField: "_id",
               hidden: true,
          },
          {
               text: props.t("Category Name"),

               dataField: "name",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "16%" };
               },
          },
        
     ];
     return (
          <React.Fragment>
               <div className="page-content">
                    <Container fluid={true}>
                         <Breadcrumbs
                              title={props.t("Product Categories")}
                              breadcrumbItem={props.t("Add Product Category")}
                         />
                         <Row>
                              <Col lg={12}>
                                   <Card>
                                        <CardBody>
                                             <AvForm   onValidSubmit={(e, v) => {
                                      handleValidSubmit(e, v);
                                    }} ref={refContainer}>
                                                  <CardTitle>{props.t("Add Product Category")}</CardTitle>
                                                  <CardSubtitle className="mb-3">
                                                       {props.t(
                                                            "Enter the following details to add a new Product category"
                                                       )}
                                                  </CardSubtitle>
                                                  <Row>
                                                       <Col lg={6}>
                                                            <AvField
                                                                 name="name"
                                                                 label={props.t("Category *")}
                                                                 placeholder={props.t("Enter Category Name")}
                                                                 type="text"
                                                                 validate={{
                                                                      required: {
                                                                           value: true,
                                                                           errorMessage: props.t(
                                                                                "Category cannot be empty."
                                                                           ),
                                                                      },
                                                                 }}
                                                            />
                                                       </Col>
                                                       {/* <Col lg={6}>
                                                            <Label>{props.t("Sub-Category Name")}</Label> (
                                                            {props.t("press ENTER/TAB to add")})
                                                            <TagsInput
                                                                 value={subCategories}
                                                                 onChange={(tags) => {
                                                                      setSubCategories(tags);
                                                                 }}
                                                                 onlyUnique={true}
                                                                 inputProps={{
                                                                      className: "react-tagsinput-input",
                                                                      placeholder: props.t("Add..."),
                                                                 }}
                                                            />
                                                       </Col> */}

                                                       <Col lg={12}>
                                                            <hr />
                                                            <FormGroup className="mb-0 text-center">
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
                                        </CardBody>
                                   </Card>
                              </Col>
                         </Row>
                         <Row>
                              <Col className="col-12">
                                   <Card>
                                        <CardBody>
                                             <CardTitle>
                                                  {props.t("Existing Product Categories")}{" "}
                                             </CardTitle>
                                             <CardSubtitle className="mb-3">
                                                  {props.t("View all your existing Product categories here")}
                                             </CardSubtitle>
                                             <BootstrapTable
                                                  bootstrap4
                                                  keyField="_id"
                                                  data={allCategories && allCategories}
                                                  columns={columns}
                                                  noDataIndication={props.t("No data to display.")}
                                                  striped
                                                  hover
                                                  condensed
                                             />
                                        </CardBody>
                                   </Card>
                              </Col>
                         </Row>
                    </Container>
               </div>
          </React.Fragment>
     );
};

export default withRouter(connect(null, {})(withNamespaces()(AddCategory)));
