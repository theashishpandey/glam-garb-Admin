import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap";
import Moment from "moment";
import moment from "moment";
import { withNamespaces } from "react-i18next";

//Import Image
import logo from "../assets/images/logo-light.png";
const AllOfflineOrders = (props) => {
  function printInvoice() {
    window.print();
  }

  console.log(props);
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
                      {props.order && props.order.via == "Online" ? (
                        <span className="font-size-18">
                          {props.t("ONLINE ORDER ")}
                        </span>
                      ) : (
                        <span className="font-size-18">
                          {props.t("OFFLINE ORDER ")}
                        </span>
                      )}
                      <br />

                      <span className="font-size-15 ">
                        Order # {props.order && props.order.order_number}
                      </span>
                      <br />
                      <span className="font-size-15 ">
                        Date: {props.order && moment(props.order.createdAt).format("YYYY-MM-DD")}
                      </span>
                    </h3>

                    <div className="mb-4">
                      <img src={logo} alt="logo" height="80" />
                    </div>

                    {props.order && props.order.invoice_number ? (
                      <h3 className="font-size-15">
                        Invoice no. #:{" "}
                        {props.order && props.order.invoice_number}
                      </h3>
                    ) : (
                      ""
                    )}
                  </div>

                  <Row>
                    <div className="table">
                      <Table className="table-nowrap">
                        <thead>
                          <tr>
                            <th
                              colSpan="4"
                              style={{ fontSize: "15px", color: "#4b1d02" }}
                            >
                              <i
                                style={{ fontSize: "20px" }}
                                className="bx bxs-user-circle"
                              ></i>
                              &nbsp; {props.t("Customer Information")}:
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border-0">
                              CUSTOMER NAME <br />
                              <strong>
                                {props.order &&
                                  props.order.customer_details.name}
                              </strong>
                            </td>
                            <td className="border-0">
                              CONTACT NO. <br />
                              <strong>
                                {props.order &&
                                  props.order.customer_details.mobile}
                              </strong>
                            </td>
                            <td className="border-0">
                              EMAIL <br />
                              <strong>
                                {props.order &&
                                  props.order.customer_details.email}
                              </strong>
                            </td>
                            <td className="border-0">
                              Payment Type <br />
                              <strong>
                                {props.order && props.order.via == "Online"
                                  ? "card"
                                  : props.order && props.order.payment_type}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <hr />
                      {props.order ? (
                        <div className="row">
                          <div
                            className="col-sm-5"
                            style={{ marginTop: "25px", paddingLeft: "25px" }}
                          >
                            <b
                              className="checkout-title"
                              style={{ fontSize: "15px", color: "#4b1d02" }}
                            >
                              Store Address:
                            </b>
                            <br />
                            <br />
                            <p>
                              {props.order.store_details.name} <br />
                              {props.order.store_details.address}{" "}
                              {props.order.store_details.pincode}
                            </p>
                          </div>
                          {!props.order.pickup_address ? (
                            <div
                              className="col-sm-4"
                              style={{ marginTop: "25px" }}
                            >
                              <b
                                className="checkout-title"
                                style={{ fontSize: "15px", color: "#4b1d02" }}
                              >
                                Shipping Address:
                              </b>
                              <br /> <br />
                              <p>
                                {
                                  props.order.shipping_address
                                    .apartment_house_number
                                }{" "}
                                {props.order.shipping_address.street_address}{" "}
                                <br />
                                {props.order.shipping_address.city}{" "}
                                {props.order.shipping_address.province}{" "}
                                {props.order.shipping_address.pincode}
                              </p>
                            </div>
                          ) : (
                            <div
                              className="col-sm-4"
                              style={{ marginTop: "25px" }}
                            >
                              <b
                                className="checkout-title"
                                style={{ fontSize: "15px", color: "#4b1d02" }}
                              >
                                Shipping Address:
                              </b>
                              <br /> <br />
                              <p>Pickup from store.</p>
                            </div>
                          )}
                          {
                            props.order && props.order.date_of_delivery ?
                              <div
                                className="col-sm-3"
                                style={{ marginTop: "25px", paddingLeft: "25px" }}
                              >
                                <b
                                  className="checkout-title"
                                  style={{ fontSize: "15px", color: "#4b1d02" }}
                                >
                                  Date Of Delivery:
                                </b>
                                <br />
                                <br />
                                <p>
                                  {moment(props.order && props.order.date_of_delivery).format("YYYY-MM-DD")}

                                </p>
                              </div> : ""
                          }

                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </Row>
                  <hr />
                  <div className="row">
                    <div className="col-lg-8">
                      <b
                        className="checkout-title"
                        style={{ fontSize: "15px", color: "#4b1d02" }}
                      >
                        Order Details :
                      </b>
                      <div className="row">
                        <div className="col-sm-12">
                          {props.order &&
                            props.order.product_details &&
                            props.order.product_details.length > 0 ? (
                            <>
                              <br />

                              <aside className="col-lg-12">
                                <div className="summary">
                                  <table className="table">
                                    <thead
                                      style={{
                                        background: "#eeeeeb",
                                        color: "#000",
                                      }}
                                    >
                                      <tr>
                                        <th>{props.t("Product Name")}</th>

                                        <th>{props.t("Color")}</th>
                                        <th>{props.t("Size")}</th>
                                        <th>{props.t("Description")}</th>

                                        <th>{props.t("Price")}</th>

                                        <th>
                                          Assembly
                                          <br />
                                          Charges
                                        </th>

                                        <th>{props.t("Quantity")}</th>
                                        <th>{props.t("Total")}</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {props.order &&
                                        props.order.product_details.map(
                                          (product, key) => (
                                            <tr>
                                              <td>{product.name}</td>

                                              <td>
                                                {product.variant_details &&
                                                  product.variant_details
                                                    .variantColor}
                                              </td>
                                              <td>
                                                {product.variant_details &&
                                                  product.variant_details
                                                    .variantSize}
                                              </td>
                                              <td>
                                                {product.product_description ? product.product_description : "NA"}
                                              </td>


                                              <td>${product.price}</td>
                                              {product.is_assembly_charges ==
                                                true ? (
                                                <td>
                                                  ${product.assembly_charges}
                                                </td>
                                              ) : (
                                                <td>NA</td>
                                              )}
                                              <td>{product.qty}</td>
                                              <td>${product.sum}</td>
                                            </tr>
                                          )
                                        )}
                                    </tbody>
                                  </table>
                                </div>
                              </aside>
                            </>
                          ) : (
                            <aside className="col-lg-12">
                              <div className="summary">
                                <table className="table">
                                  <thead
                                    style={{
                                      background: "#eeeeeb",
                                      color: "#000",
                                    }}
                                  >
                                    <tr>
                                      <th>{props.t("Product Name")}</th>

                                      <th>{props.t("Color")}</th>
                                      <th>{props.t("Size")}</th>
                                      <th>{props.t("Description")}</th>


                                      <th>{props.t("Price")}</th>
                                      <th>
                                        Assembly
                                        <br /> Charges
                                      </th>
                                      <th>{props.t("Quantity")}</th>
                                      <th>{props.t("Total")}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {props.order &&
                                      props.order.product_details.map(
                                        (product, key) => (
                                          <tr key={key}>
                                            <td>{product.name}</td>

                                            <td>{product.color}</td>
                                            <td>{product.size}</td>
                                            <td>
                                              {product.product_description ? product.product_description : "NA"}

                                            </td>

                                            <td>{product.price}</td>
                                            <td>
                                              {product.assembly_charges
                                                ? product.assembly_charges
                                                : 0}
                                            </td>
                                            <td>{product.qty}</td>
                                            <td>{product.total_price}</td>
                                          </tr>
                                        )
                                      )}
                                  </tbody>
                                </table>
                              </div>
                            </aside>
                          )}

                          <hr />
                        </div>
                      </div>
                    </div>

                    <aside className="col-lg-4">
                      <div
                        className="summary"
                        style={{ backgroundColor: "#eee", padding: "20px" }}
                      >
                        <b
                          className="summary-title"
                          style={{ fontSize: "15px", color: "#4b1d02" }}
                        >
                          Your Order:
                        </b>
                        <br />
                        <br />

                        <table className="table">
                          <tbody>
                            <tr style={{ borderBottom: "2px solid #e1e1e1" }}>
                              <td colSpan="4">
                                <strong>{props.t("SubTotal")}:</strong>
                              </td>

                              <td>
                                ${props.order && props.order.subtotal_amount}
                              </td>
                            </tr>

                            <tr style={{ borderBottom: "2px solid #e1e1e1" }}>
                              {" "}
                              <td colSpan="4">
                                <strong>{props.t("Shipping Charges")}:</strong>
                              </td>
                              <td>
                                ${props.order && props.order.shipping_charges}
                              </td>
                            </tr>
                            {
                              props.order && props.order.via == "Offline" && props.order.isInvoiceRequired == true ? <tr style={{ borderBottom: "2px solid #e1e1e1" }}>
                                {" "}
                                <td colSpan="4">
                                  <strong>{props.t("HST (13%)")}:</strong>
                                </td>
                                <td>
                                  ${props.order && props.order.hst}
                                </td>
                              </tr> : ""
                            }
                            {
                              props.order && props.order.via == "Online" ? <tr style={{ borderBottom: "2px solid #e1e1e1" }}>
                                {" "}
                                <td colSpan="4">
                                  <strong>{props.t("HST (13%)")}:</strong>
                                </td>
                                <td>
                                  ${props.order && props.order.hst}
                                </td>
                              </tr> : ""
                            }
                            <tr style={{ borderBottom: "2px solid #e1e1e1" }}>
                              <td colSpan="4">
                                <strong>{props.t("Total")}:</strong>
                              </td>
                              <td>
                                ${props.order && props.order.total_amount}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </aside>
                  </div>

                  <hr />
                  <Table className="table-nowrap">
                    <tbody>
                      <tr>
                        <td
                          className="border-0 "
                          style={{ fontSize: "15px", color: "#4b1d02" }}
                        >
                          <strong>
                            <i className="bx bx-check-circle"></i>&nbsp;{" "}
                            {props.t("Terms and Conditions")}:
                          </strong>
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

export default withNamespaces()(AllOfflineOrders);
