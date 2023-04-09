import React, { useEffect, useState, useRef } from "react";
//i18n
import { withNamespaces } from "react-i18next";

import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  CardTitle,
  CardSubtitle,
  Container,
} from "reactstrap";
import swal from "sweetalert2";

import { AvForm, AvField } from "availity-reactstrap-validation";
// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import { postSubmitForm } from "../../helpers/forms_helper";
import { v4 as uuidv4 } from "uuid";
const AddPincode = (props) => {
  useEffect(() => {
    loadPincode();
  }, []);
  const [pincodeModal, setPincodeModal] = useState();
  const [pincodes, setPincodes] = useState([]);

  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }
  const [allPincode, setAllPincode] = useState([]);
  const loadPincode = async () => {
    let url = process.env.REACT_APP_BASEURL + "pincodes/getall";
    const response = await postSubmitForm(url, {});
    if (response && response.status === 1) {
      setAllPincode(response.data);
    } else {
      showNotification(response.message, "Error");
    }
    refContainer.current.reset();
  };
  const refContainer = useRef(null);
  const handleValidSubmit = async (e, v) => {
    let url = process.env.REACT_APP_BASEURL + "pincodes/insert";
    console.log(v);
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadPincode();
    } else {
      showNotification(response.message, "Error");
    }
    refContainer.current.reset();
  };

  const handlePincodesDelete = async (pincode) => {
    try {
      let data_to_send = {};
      data_to_send.code = pincode.code;
      let url = process.env.REACT_APP_BASEURL + "pincodes/delete";
      const response = await postSubmitForm(url, data_to_send);
      if (response && response.status === 1) {
        loadPincode();

        showNotification(props.t(response.message), props.t("Success"));
      } else {
        showNotification(props.t(response.message), props.t("Error"));
      }
    } catch (error) {
      showNotification(error, "Error");
    }
  };
  const handleValidPincodes = async (e, v) => {
    v.code = uuidv4();

    setPincodes([...pincodes, v]);
    setPincodeModal(!pincodeModal);
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
        return { width: "5%" };
      },
    },

    {
      dataField: "code",
      text: props.t("Pincode"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "50%" };
      },
    },
    {
      dataField: "",
      text: props.t("Action"),
      formatter: (cell, row) => {
        return (
          <>
            <span className="text-danger">
              <i
                className="bx bxs-trash font-size-15"
                title="Click to Delete"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handlePincodesDelete(row);
                }}
              ></i>
            </span>
          </>
        );
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Pincodes")}
            breadcrumbItem={props.t("Add Pincode")}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidPincodes(e, v);
                    }}
                    ref={refContainer}
                  >
                    <Row>
                      <Col lg={4}>
                        <button
                          type="button"
                          color="primary"
                          className="btn btn-success"
                          onClick={() => {
                            setPincodeModal(!pincodeModal);
                          }}
                        >
                          <i class="bx bx-plus  font-size-16 align-middle me-2"></i>{" "}
                          Pincode
                        </button>
                      </Col>
                      <Col lg={12}></Col>
                    </Row>
                  </AvForm>

                  {/* address Modal */}

                  <Modal
                    size="sm"
                    isOpen={pincodeModal}
                    toggle={() => setPincodeModal(!pincodeModal)}
                  >
                    <ModalHeader toggle={() => setPincodeModal(!pincodeModal)}>
                      Pincodes:
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
                                        name="code"
                                        label={props.t("Pincode")}
                                        placeholder={props.t("Enter Pincode")}
                                        type="text"
                                        validate={{
                                          required: {
                                            value: true,
                                            errorMessage: props.t(
                                              "Pincode cannot be empty."
                                            ),
                                          },
                                          pattern: {
                                            value: "^[a-zA-Z0-9_]",
                                            errorMessage: props.t(
                                              "Pincode require 3 characters."
                                            ),
                                          },

                                          maxLength: {
                                            value: 6,
                                            errorMessage: props.t(
                                              "Pincode require 3 characters."
                                            ),
                                          },
                                          minLength: {
                                            value: 6,
                                            errorMessage: props.t(
                                              "Pincode require 3 characters."
                                            ),
                                          },
                                        }}
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
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Pincodes")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing pincodes here")}
                  </CardSubtitle>
                  <BootstrapTable
                    bootstrap4
                    keyField="_id"
                    data={allPincode && allPincode}
                    columns={columns}
                    noDataIndication="No data to display."
                    striped
                    hover
                    condensed
                  />{" "}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(connect(null, {})(withNamespaces()(AddPincode)));
