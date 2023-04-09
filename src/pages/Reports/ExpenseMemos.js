import React, { useState, useRef, useEffect } from "react";
//i18n
import { withNamespaces } from "react-i18next";

import {
     Row,
     Col,
     Card,
     CardBody,
     Modal,
     ModalHeader,
     ModalBody,
     FormGroup,
     Button,
     CardTitle,
     CardSubtitle,
     Container,
} from "reactstrap";
import swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { AvForm, AvField } from "availity-reactstrap-validation";
// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { postSubmitForm } from "../../helpers/forms_helper";

const ExpenseMemos = (props) => {
     const refContainer = useRef(null);
     const [user, setuser] = useState();
     const [expenseModal, setExpenseModal] = useState();
     const [expense, setExpense] = useState([]);
     const [isEdit, setisEdit] = useState(false);
     const [selectedMemo, setselectedMemo] = useState();
     const [allmemos, setAllMemos] = useState([]);

     useEffect(() => {
          setuser(localStorage.getItem('username'))
          loadMemos();
     }, []);

     const handleValidSubmit = async (e, v) => {

          let payload = {
               product_id: '',
               createdBy: user,
               total_expenditure: v.total_expenditure,
               total_sales: v.total_sales,
               message: v.message
          }
          if (isEdit && selectedMemo) {
               payload['id'] = selectedMemo._id
          }
          console.log(payload);

          let url = process.env.REACT_APP_BASEURL + `${isEdit ? 'memos/update' : 'memos/insert'}`;
          const response = await postSubmitForm(url, payload);
          if (response && response.status === 1) {
               showNotification(response.message, "Success");
               setExpense([]);
               loadMemos();
               setExpenseModal(!expenseModal);
               refContainer.current.reset();
          } else {
               showNotification(response.message, "Error");
          }
     };

     const loadMemos = async () => {
          let url = process.env.REACT_APP_BASEURL + "memos/getall";
          let response = await postSubmitForm(url, "");
          if (response.status === 1) {
               console.log(response);
               setAllMemos(response.data);
          } else {
               showNotification(response.message, "Error");
          }
     };

     const deleteMemos = async (memoId) => {
          let url = process.env.REACT_APP_BASEURL + "memos/delete";
          let response = await postSubmitForm(url, { id: memoId });
          if (response.status === 1) {
               console.log(response);
               showNotification(response.message, "Success");
               loadMemos()
          } else {
               showNotification(response.message, "Error");
          }
     };
     function showNotification(message, type) {
          if (type === "Success") swal.fire(type, message, "success");
          else swal.fire(type, message, "error");
     }

     const expenseFormatter = (cell, row, rowIndex, extra) => {
          return (
               <Row>
                    <Col md={6}>
                         <span className="text-danger">
                              <i
                                   className="bx bxs-trash font-size-15"
                                   title="Click to Delete"
                                   style={{ cursor: "pointer" }}
                                   onClick={() => {
                                        deleteMemos(row._id);
                                   }}
                              ></i>
                         </span>
                    </Col>
                    <Col md={6}>
                         <span className="text-primary">
                              <i
                                   className="bx bxs-edit font-size-15"
                                   title="Click to Edit"
                                   style={{ cursor: "pointer" }}
                                   onClick={() => {
                                        setisEdit(true);
                                        setselectedMemo(row);
                                        setExpenseModal(!expenseModal);

                                   }}
                              ></i>
                         </span>
                    </Col>
               </Row>

          );
     };

     const columns = [
          {
               dataField: "_id",
               hidden: true,
          },
          {
               text: props.t("Amount"),
               dataField: "total_expenditure",
               sort: true,
          },
          // {
          //      text: props.t("Total Sales"),
          //      dataField: "total_sales",
          //      sort: true,
          // },

          {

               text: props.t("Message"),
               dataField: "message",
               sort: true,
          },
          {

               text: props.t("Created By"),
               dataField: "createdBy",
               headerStyle: (colum, colIndex) => {
                    return { width: "13%" };
               },
               sort: true,
          },
          {
               text: props.t("Created At"),

               formatter: (colum, colIndex) => {
                    return moment(colIndex.createdAt).format("YYYY-MM-DD HH:mm");
               },
               dataField: "createdAt",
               sort: true,
               headerStyle: (colum, colIndex) => {
                    return { width: "15%" };
               },
          },
          {
               text: props.t("Action"),
               formatter: expenseFormatter,
               formatExtraData: expense,

               sort: false,
               headerStyle: (colum, colIndex) => {
                    return { width: "70px" };
               },
          },
     ];
     return (
          <React.Fragment>
               <div className="page-content">
                    <Container fluid={true}>
                         <Breadcrumbs
                              title={props.t("Expense")}
                              breadcrumbItem={props.t("Add ")}
                         />
                         <Row>
                              <Col lg={12}>
                                   <Card>
                                        <CardBody>
                                             <AvForm

                                                  ref={refContainer}
                                             >
                                                  <CardTitle>{props.t("Expense Memos")}</CardTitle>
                                                  <Row>


                                                       <Col lg={4}>
                                                            <button
                                                                 type="button"
                                                                 color="primary"
                                                                 className="btn btn-success"
                                                                 onClick={() => {
                                                                      setExpenseModal(!expenseModal);
                                                                      setExpense([]);
                                                                 }}
                                                            >
                                                                 <i class="bx bx-plus  font-size-16 align-middle me-2"></i>{" "}
                                                                 Add Memos
                                                            </button>
                                                       </Col>

                                                       <Col lg={12} className="mt-2">
                                                            <BootstrapTable
                                                                 bootstrap4
                                                                 keyField="_id"
                                                                 data={allmemos && allmemos}
                                                                 columns={columns}
                                                                 noDataIndication={props.t("No data to display.")}
                                                            />
                                                       </Col>

                                                  </Row>
                                             </AvForm>



                                             <Modal
                                                  size="lg"
                                                  isOpen={expenseModal}
                                                  toggle={() => setExpenseModal(!expenseModal)}
                                             >
                                                  <ModalHeader toggle={() => setExpenseModal(!expenseModal)}>
                                                       Add Memos:
                                                  </ModalHeader>
                                                  <ModalBody>
                                                       <>
                                                            <Row>
                                                                 <Col lg={12}>
                                                                      <Card>
                                                                           <CardBody>
                                                                                <AvForm
                                                                                     ref={refContainer}
                                                                                     onValidSubmit={(e, v) => {
                                                                                          handleValidSubmit(e, v);
                                                                                     }}
                                                                                >
                                                                                     <Row>

                                                                                          <Col lg={6}>
                                                                                               <AvField
                                                                                                    name="total_expenditure"
                                                                                                    label={props.t("Amount")}
                                                                                                    placeholder={props.t(
                                                                                                         "Enter amount"
                                                                                                    )}
                                                                                                    type="text"
                                                                                                    errorMessage="cannot be empty."
                                                                                                    value={selectedMemo && selectedMemo.total_expenditure ? selectedMemo.total_expenditure : ''}
                                                                                                    required
                                                                                               />
                                                                                          </Col>
                                                                                          {/* <Col lg={6}>
                                                                                               <AvField
                                                                                                    name="total_sales"
                                                                                                    label={props.t("Total Sales")}
                                                                                                    placeholder={props.t(
                                                                                                         "Enter sales"
                                                                                                    )}
                                                                                                    type="text"
                                                                                                    errorMessage="cannot be empty."
                                                                                                    value={selectedMemo && selectedMemo.total_sales ? selectedMemo.total_sales : ''}
                                                                                                    required
                                                                                               />
                                                                                          </Col> */}
                                                                                          <Col lg={6}>
                                                                                               <AvField
                                                                                                    name="message"
                                                                                                    label={props.t("Message")}
                                                                                                    placeholder={props.t(
                                                                                                         "Enter message"
                                                                                                    )}
                                                                                                    type="textarea"
                                                                                                    value={selectedMemo && selectedMemo.message ? selectedMemo.message : ''}
                                                                                                    errorMessage="cannot be empty."
                                                                                                    required
                                                                                               />
                                                                                          </Col>



                                                                                          <Col lg={12}>
                                                                                               <hr />
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
export default withRouter(connect(null, {})(withNamespaces()(ExpenseMemos)));
