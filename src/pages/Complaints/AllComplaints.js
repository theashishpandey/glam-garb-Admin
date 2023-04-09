
import React, { useEffect, useState } from "react";
//i18n
import { withNamespaces } from "react-i18next";
import exportFromJSON from "export-from-json";

import {
     Row,
     Col,
     FormGroup,
     Modal,
     ModalHeader,
     ModalBody,
     Card,
     CardBody,
     CardTitle,
     CardSubtitle,
     Container,
     Button,
} from "reactstrap";
import swal from "sweetalert2";
import { AvForm, AvField } from "availity-reactstrap-validation";
// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { postSubmitForm } from "../../helpers/forms_helper";

const AllComplaints = (props) => {
     const { SearchBar } = Search;

     useEffect(() => {
          loadComplaints();
     }, []);






     function showNotification(message, type) {
          if (type === "Success") swal.fire(type, message, "success");
          else swal.fire(type, message, "error");
     }

     const [allComplaints, setAllComplaints] = useState([]);
     const [editModal, setEditModal] = useState(false);
     const [selectedComplaint, setselectedComplaint] = useState()
     const loadComplaints = async () => {
          let url = process.env.REACT_APP_BASEURL + "complaint/getall";
          let response = await postSubmitForm(url, "");
          if (response.status === 1) {
               console.log(response);
               setAllComplaints(response.data);
          } else {
               showNotification(response.message, "Error");
          }
     };


     const handleValidSubmit = async (e, v) => {
          let url = process.env.REACT_APP_BASEURL + "complaint/update";

          let data_to_send = {
               id: selectedComplaint._id,
               status: v.status
          }
          console.log(data_to_send);
          const response = await postSubmitForm(url, data_to_send);
          if (response && response.status === 1) {
               showNotification(response.message, "Success");
               loadComplaints();
               setEditModal(false);

          } else {
               showNotification(response.message, "Error");
          }

     };


     function editFormatter(cell, row) {
          return (
               <span className="text-info">
                    <i
                         className="bx bxs-edit font-size-15"
                         title="Click to Edit"
                         style={{ cursor: "pointer" }}
                         onClick={() => {
                              setEditModal(!editModal);
                              setselectedComplaint(row);

                         }}
                    ></i>
               </span>
          );
     }

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
               text: props.t("Complain no."),
               dataField: "complain_no",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
          {
               text: props.t("Customer Name"),
               formatter: (cell, row) => {
                    return row.customer_details[0].name
               },
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
          {
               text: props.t("Mobile"),
               formatter: (cell, row) => {
                    return row.customer_details[0].mobile
               },
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "8%" };
               },
          },
          {
               text: props.t("Email"),
               formatter: (cell, row) => {
                    return row.customer_details[0].email
               },
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
               },
          },
          {
               text: props.t("Massage"),
               dataField: "message",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "14%" };
               },
          },
          {
               text: props.t("Status"),
               dataField: "status",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "8%" };
               },
          },
          {
               text: props.t("Created By"),
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "8%" };
               },
               dataField: "createdBy.employee_details.name",
               formatter: ((cell, row) => {
                    return row.createdBy && row.createdBy.employee_details && row.createdBy.employee_details.name ? row.createdBy.employee_details.name : <span style={{ color: "green", fontWeight: "bold" }}>Online</span>
               })
          },
          {
               text: props.t("Date"),

               formatter: (colum, colIndex) => {
                    return moment(colIndex.createdAt).format("YYYY-MM-DD HH:mm");
               },
               dataField: "createdAt",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "12%" };
               },
          },
          {
               text: props.t("Action"),
               formatter: editFormatter,
               sort: false,
               headerStyle: (colum, colIndex) => {
                    return { width: "7%" };
               },
          },

     ];

     const handleDownload = () => {
          const fileName = "complaints";
          const exportType = "xls";
          if (allComplaints) {
               var data = JSON.parse(JSON.stringify(allComplaints));
               data.forEach(function (v) {
                    v.customer_name = allComplaints.map((i) => {
                         return i.customer_details[0].name
                    })
                    v.customer_mobile = allComplaints.map((i) => {
                         return i.customer_details[0].mobile
                    })
                    delete v.customer_details;
                    delete v.is_active;
                    delete v.createdBy;
                    delete v._id;
                    delete v.label;
                    delete v.value;
                    delete v.createdAt;
                    delete v.updatedAt;
                    delete v.__v;
                    delete v.image_url;
               });
               exportFromJSON({ data, fileName, exportType });
          }
     };
     return (
          <React.Fragment>
               <div className="page-content">
                    <Container fluid={true}>
                         <Breadcrumbs
                              title={props.t("Complaints")}
                              breadcrumbItem={props.t("All Complaints")}
                         />
                         <Row>
                              <Col className="col-12">
                                   <Card>
                                        <CardBody>
                                             <CardTitle>{props.t("All Complaints")} </CardTitle>
                                             <CardSubtitle className="mb-3">
                                                  {props.t("View all your existing complaints here")}
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
                                                       <div className="search-box mr-2 mb-2 d-inline-block">
                                                            <div className="position-relative"></div>
                                                       </div>
                                                  </Col>
                                             </Row>
                                             <ToolkitProvider
                                                  bootstrap4
                                                  keyField="_id"
                                                  data={allComplaints && allComplaints}
                                                  columns={columns}
                                                  noDataIndication={props.t("No data to display.")}
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
                                                            />
                                                       </div>
                                                  )}
                                             </ToolkitProvider>
                                             <Modal
                                                  size="md"
                                                  isOpen={editModal}
                                                  toggle={() => setEditModal(!editModal)}
                                             >
                                                  <ModalHeader
                                                       toggle={() => setEditModal(!editModal)}
                                                  >
                                                       Status:
                                                  </ModalHeader>
                                                  <ModalBody>

                                                       <>
                                                            <Row>
                                                                 <Col lg={12}>
                                                                      <Card>
                                                                           <CardBody>
                                                                                <AvForm
                                                                                     onValidSubmit={(e, v) => {
                                                                                          handleValidSubmit(e, v);
                                                                                     }}
                                                                                >
                                                                                     <Row>
                                                                                          <Col lg={12}>
                                                                                               <AvField
                                                                                                    name="status"
                                                                                                    label={props.t("Status") + " *"}
                                                                                                    value={selectedComplaint && selectedComplaint.status}
                                                                                                    type="select"
                                                                                                    //onChange={handleChange}
                                                                                                    validate={{ required: { value: true } }}
                                                                                                    errorMessage={props.t("Select status")}
                                                                                               >
                                                                                                    <option value="">
                                                                                                         -- {props.t("Select status")} --
                                                                                                    </option>

                                                                                                    <option value="Inprogress">
                                                                                                         {props.t("Inprogress")}
                                                                                                    </option>
                                                                                                    <option value="Resolved">
                                                                                                         {props.t("Resolved")}
                                                                                                    </option>


                                                                                               </AvField>
                                                                                          </Col>

                                                                                          <Col lg={12}>
                                                                                               <FormGroup className="mb-0 text-center">
                                                                                                    <div>
                                                                                                         <Button
                                                                                                              type="submit"
                                                                                                              color="primary"
                                                                                                              className="mr-1"
                                                                                                         >
                                                                                                              {props.t("Update")}
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
export default withRouter(connect(null, {})(withNamespaces()(AllComplaints)));
