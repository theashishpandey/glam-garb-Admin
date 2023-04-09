import React, { useEffect, useRef, useState } from "react";
//i18n
import { withNamespaces } from "react-i18next";

import { AvRadio, AvRadioGroup } from "availity-reactstrap-validation";

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
  Label,
} from "reactstrap";
import swal from "sweetalert2";

import moment from "moment";

import { AvForm, AvField } from "availity-reactstrap-validation";

import Select from "react-select";
// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { postSubmitForm } from "../../helpers/forms_helper";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();
const AddCoupon = (props) => {
  const refSelectCustomer = useRef(null);
  const refContainer = useRef(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleValidSubmit = async (e, v) => {
    if (Number(v.redeem_count) < 1) {
      return showNotification("Redeem Count Should be greater than 0", "Error");
    }
    if (v.discount_type === "Percent" && Number(v.discount_value) > 100) {
      return showNotification(
        "Discount Percantage Should be less than 100",
        "Error"
      );
    }
    if (Number(v.discount_value) < 1) {
      return showNotification(
        "Discount Value Should be greater than 0",
        "Error"
      );
    }
    if (v.is_customer_specific === "Yes" && !selectedCustomer) {
      return showNotification("Please Select Customer.", "Error");
    }

    let customerData = {};
    if (
      v.is_customer_specific === "Yes" &&
      selectedCustomer &&
      Object.keys(selectedCustomer).length > 0
    ) {
      customerData.name = selectedCustomer.name;
      customerData.mobile = selectedCustomer.mobile;
      customerData.email = selectedCustomer.email;
      customerData.address = selectedCustomer.addresses;
      customerData.is_active = selectedCustomer.is_active;
      customerData.customer_id = selectedCustomer._id;
    }

    let payload = {
      coupon_code: v.coupon_code,
      start_date: v.start_date,
      end_date: v.end_date,
      min_cart_value: v.min_cart_value,
      discount_type: v.discount_type,
      discount_value: v.discount_value,
      redeem_count: v.redeem_count,
      is_unique_use: v.is_unique_use === undefined ? false : v.is_unique_use,
      is_customer_specific:
        v.is_customer_specific === "" || v.is_customer_specific === "No"
          ? {}
          : customerData,
    };

    console.log(payload, selectedCustomer, "v");

    let url = process.env.REACT_APP_BASEURL + "coupons/insert";

    const response = await postSubmitForm(url, payload);
    if (response && response.status === 1) {
      console.log(response);
      showNotification(response.message, "Success");

      refContainer.current.reset();
    } else {
      showNotification(response.message, "Error");
    }
  };

  const loadCustomers = async () => {
    let url = process.env.REACT_APP_BASEURL + "customers/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllCustomers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const [type, setType] = useState(false);

  const [customerSpecific, setCustomerSpecific] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [allCustomers, setAllCustomers] = useState([]);
  const [currentDate] = useState(() => {
    var d1 = new Date();
    var d = moment(d1).toDate();
    var month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  });
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Coupons")}
            breadcrumbItem={props.t("Add Coupon")}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidSubmit(e, v);
                    }}
                    ref={refContainer}
                  >
                    <CardTitle>{props.t("Add Coupon")}</CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t(
                        "Enter the following details to add a new coupon"
                      )}
                    </CardSubtitle>
                    <Row>
                      <Col lg={6}>
                        <AvField
                          name="coupon_code"
                          label={props.t("Coupon Code") + " *"}
                          placeholder={props.t("Enter Code")}
                          type="text"
                          errorMessage="Code cannot be empty."
                          validate={{
                            required: { value: true },
                            pattern: {
                              value: "^[a-zA-Z0-9_]*$",
                              errorMessage: props.t(
                                "Special characters and space is not allowed."
                              ),
                            },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <AvField
                          name="redeem_count"
                          label={props.t("Redeem Count *")}
                          placeholder={props.t("Enter Redeem Count")}
                          errorMessage={props.t("Cannot be empty.")}
                          type="number"
                          validate={{
                            required: {
                              errorMessage: props.t("Cannot be empty"),
                            },
                            pattern: {
                              value: "^[0-9]*$",
                              errorMessage: props.t(
                                "Only Positive numbers all allowed."
                              ),
                            },
                          }}
                        />
                      </Col>

                      <Col lg={6}>
                        <AvField
                          name="start_date"
                          label={props.t("Start Date") + " *"}
                          placeholder={props.t("Select Start Date")}
                          type="date"
                          min={currentDate}
                          validate={{
                            required: {
                              errorMessage: props.t("Cannot be empty"),
                            },
                          }}
                        />
                      </Col>

                      <Col lg={6}>
                        <AvField
                          name="end_date"
                          label={props.t("End Date") + " *"}
                          placeholder={props.t("Select End Date")}
                          type="date"
                          min={currentDate}
                          validate={{
                            required: {
                              errorMessage: props.t("Cannot be empty"),
                            },
                          }}
                        />
                      </Col>

                      <Col lg={6}>
                        <AvField
                          name="min_cart_value"
                          label={props.t("Minimum Cart Value *")}
                          placeholder={props.t("Enter Minimum Cart Value")}
                          errorMessage={props.t("Cannot be empty.")}
                          type="number"
                          validate={{
                            required: {
                              errorMessage: props.t("Cannot be empty"),
                            },
                            pattern: {
                              value: "^[0-9]*$",
                              errorMessage: props.t(
                                "Only Positive numbers all allowed."
                              ),
                            },
                          }}
                        />
                      </Col>

                      {/* <Col lg={6}>
                        <Label>Coupon Type*</Label>
                        <AvRadioGroup inline name="coupon_type">
                          <AvRadio
                            onChange={(e, v) => {
                              setType(true);
                            }}
                            label="Online"
                            value="Online"
                          />
                          <AvRadio
                            onChange={(e, v) => {
                              setType(false);
                            }}
                            label="Offline"
                            value="Offline"
                          />
                        </AvRadioGroup>
                      </Col> */}

                      <Col lg={6}>
                        <Label>Discount Type *</Label>
                        <AvRadioGroup
                          inline
                          name="discount_type"
                          validate={{
                            required: {
                              errorMessage: props.t("Cannot be empty"),
                            },
                          }}
                        >
                          <AvRadio
                            name="Percent"
                            onChange={(e, v) => {
                              setType(true);
                            }}
                            label="Percent"
                            value="Percent"
                          />
                          <AvRadio
                            name="Flat"
                            onChange={(e, v) => {
                              setType(false);
                            }}
                            label="Flat"
                            value="Flat"
                          />
                        </AvRadioGroup>
                      </Col>

                      <Col lg={6}>
                        <Label>Is Customer Specific</Label>
                        <AvRadioGroup inline name="is_customer_specific">
                          <AvRadio
                            name="Yes"
                            onChange={(e, v) => {
                              setCustomerSpecific(true);
                            }}
                            label="Yes"
                            value="Yes"
                          />
                          <AvRadio
                            name="No"
                            onChange={(e, v) => {
                              setCustomerSpecific(false);
                            }}
                            label="No"
                            value="No"
                          />
                        </AvRadioGroup>
                      </Col>

                      {customerSpecific && (
                        <Col lg={6}>
                          <Label>Customer</Label>
                          <Select
                            value={selectedCustomer}
                            onChange={(selected) => {
                              setSelectedCustomer(selected);
                            }}
                            options={allCustomers && allCustomers}
                            classNamePrefix="select2-selection"
                            closeMenuOnSelect={true}
                            required
                          />
                        </Col>
                      )}

                      <Col lg={6}>
                        <AvField
                          name="discount_value"
                          label={props.t("Discount Value") + " *"}
                          placeholder={props.t("Enter Value")}
                          errorMessage={props.t("Cannot be empty.")}
                          type="number"
                          validate={{
                            required: {
                              errorMessage: props.t("Cannot be empty"),
                            },
                            pattern: {
                              value: "^[0-9]*$",
                              errorMessage: props.t(
                                "Only Positive numbers all allowed."
                              ),
                            },
                          }}
                        />
                      </Col>

                      {!customerSpecific && (
                        <Col lg={12} className="mt-1 mb-1">
                          <AvField
                            name="is_unique_use"
                            label={props.t("is Unique Use")}
                            type="checkbox"
                          />
                        </Col>
                      )}

                      {/* <Col lg={6}>
                        <Label>Is Product Unique ?*</Label>
                        <AvRadioGroup inline name="type">
                          <AvRadio
                            onChange={(e, v) => {
                              setType(true);
                            }}
                            label="Yes"
                            value={true}
                          />
                          <AvRadio
                            onChange={(e, v) => {
                              setIsProductUnique(false);
                            }}
                            label="No"
                            value={false}
                          />
                        </AvRadioGroup>
                      </Col> */}

                      {/* <Col lg={6}>
                        <Label>Is Customer Unique ?*</Label>
                        <AvRadioGroup inline name="type">
                          <AvRadio
                            onChange={(e, v) => {
                              setType(true);
                            }}
                            label="Yes"
                            value={true}
                          />
                          <AvRadio
                            onChange={(e, v) => {
                              setIsCustomerUnique(false);
                            }}
                            label="No"
                            value={false}
                          />
                        </AvRadioGroup>
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
        </Container>
      </div>
    </React.Fragment>
  );
};
export default withRouter(connect(null, {})(withNamespaces()(AddCoupon)));
