import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap";
import moment from "moment";

import { withNamespaces } from "react-i18next";

//Import Image
import logo from "../assets/images/logo-light.png";
const PurchaseOrder = (props) => {
  function printInvoice() {
    window.print();
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="invoice-title">
                    <h3 className="float-right ">
                      <span className="font-size-18">
                        {props.t("PURCHASE ORDER ")}
                      </span>
                      <br />
                      <span className="font-size-15">
                        PO #:{" "}
                        {props.purchase_order && props.purchase_order.po_number}
                      </span>
                      <br />
                      <span className="font-size-15">
                        Date:{" "}
                        {props.purchase_order &&
                          moment(props.purchase_order.createdAt).format(
                            "YYYY-MM-DD"
                          )}
                      </span>
                    </h3>

                    <div className="mb-4">
                      <img src={logo} alt="logo" height="60" />
                    </div>
                  </div>
                  <hr />
                  <Row>
                    <div className="table-responsive">
                      <Table className="table-nowrap">
                        <thead>
                          <tr>
                            <th colSpan="2">
                              {props.t("SUPPLIER INFORMATION")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border-0">
                              SUPPLIER NAME <br />
                              <strong>
                                {props.purchase_order &&
                                  props.purchase_order.supplier_details
                                    .company_name}
                              </strong>
                            </td>
                            <td className="border-0">
                              CONTACT PERSON <br />
                              <strong>
                                {props.purchase_order &&
                                  props.purchase_order.supplier_details
                                    .contact_person_name}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="2" className="border-0">
                              ADDRESS <br />
                              <strong>
                                {props.purchase_order &&
                                  props.purchase_order.supplier_details.address}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td className="border-0">
                              CONTACT NO. <br />
                              <strong>
                                {props.purchase_order &&
                                  props.purchase_order.supplier_details.mobile}
                              </strong>
                            </td>
                            <td className="border-0">
                              EMAIL <br />
                              <strong>
                                {props.purchase_order &&
                                  props.purchase_order.supplier_details.email}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Row>
                  {props.purchase_order &&
                  props.purchase_order.product_details &&
                  props.purchase_order.product_details.length > 0 ? (
                    <>
                      <div className="py-2 mt-3">
                        <h3 className="font-size-15 font-weight-bold">
                          {props.t("Products")}
                        </h3>
                      </div>
                      <div className="table-responsive">
                        <Table className="table-nowrap">
                          <thead>
                            <tr>
                              <th>{props.t("Name")}</th>
                              <th>{props.t("Category")}</th>
                              <th className="text-right">
                                {props.t("Quantity")}
                              </th>
                              <th className="text-right">{props.t("Price")}</th>
                              <th className="text-right">
                                {props.t("Total Price")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {props.purchase_order &&
                              props.purchase_order.product_details.map(
                                (product, key) => (
                                  <tr>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td className="text-right">
                                      {product.qty}
                                    </td>
                                    <td className="text-right">
                                      {product.price}
                                    </td>
                                    <td className="text-right">
                                      {product.total_price}
                                    </td>
                                  </tr>
                                )
                              )}
                            <tr>
                              <td colSpan="4" className="border-0 text-right">
                                <strong>{props.t("Total")}</strong>
                              </td>
                              <td className="border-0 text-right">
                                {props.purchase_order &&
                                  props.purchase_order.product_details.reduce(
                                    (accumulator, currentValue) =>
                                      +accumulator + +currentValue.total_price,
                                    0
                                  )}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </>
                  ) : null}

                  <hr />
                  <Table className="table-nowrap">
                    <tbody>
                      <tr>
                        <td className="border-0 ">
                          <strong>{props.t("Terms and Conditions")}</strong>
                        </td>
                        <td className="border-0 text-right">
                          <strong>{props.t("AUTHORIZED BY")}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-0">
                          {props.t(
                            "Payment shall be made in 30 days upon delivery of the above products."
                          )}
                        </td>
                        <td className="border-0 text-right"></td>
                      </tr>
                    </tbody>
                  </Table>
                  <div className="d-print-none">
                    <div className="float-right">
                      <Link
                        to="#"
                        onClick={() => {
                          printInvoice();
                        }}
                        className="btn btn-success waves-effect waves-light mr-2"
                      >
                        <i className="fa fa-print"></i> {props.t("Print")}
                      </Link>
                    </div>
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

export default withNamespaces()(PurchaseOrder);
