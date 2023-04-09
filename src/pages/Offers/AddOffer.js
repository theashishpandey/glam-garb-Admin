import React, { useRef, useState } from "react";
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
// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { postSubmitForm } from "../../helpers/forms_helper";

const AddOffer = (props) => {
  const refContainer = useRef(null);

  const handleValidSubmit = async (e, v) => {
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

    let url = process.env.REACT_APP_BASEURL + "offers/insert";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      refContainer.current.reset();
    } else {
      showNotification(response.message, "Error");
    }
  };
  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const [type, setType] = useState(false);
  const [isCouponApplicable, setIsCouponApplicable] = useState(false);
  const [isForFirstBuyers, setIsForFirstBuyers] = useState(false);
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
            title={props.t("Offers")}
            breadcrumbItem={props.t("Add Offer")}
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
                    <CardTitle>{props.t("Add Offer")}</CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t(
                        "Enter the following details to add a new offer"
                      )}
                    </CardSubtitle>
                    <Row>
                      <Col lg={6}>
                        <AvField
                          name="code"
                          label={props.t("Offer Code") + " *"}
                          placeholder={props.t("Enter Code")}
                          type="text"
                          errorMessage="cannot be empty."
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
                          name="name"
                          label={props.t("Offer Name") + " *"}
                          placeholder={props.t("Enter Offer Name")}
                          type="text"
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

                      {/* <Col lg={6}>
                        <AvField
                          name="min_cart_value"
                          label={props.t("Minimum Cart Value")}
                          placeholder={props.t("Enter Minimum Cart Value")}
                          errorMessage={props.t("Cannot be empty.")}
                          type="number"
                        />
                      </Col> */}

                      {/* <Col lg={6}>
                        <AvField
                          name="discount_type"
                          label={props.t("Discount Type") + " *"}
                          placeholder={props.t("Enter Type")}
                          errorMessage={props.t("Cannot be empty.")}
                          type="text"
                          
                        />
                      </Col>  */}

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

                      {/* <Col lg={6}>
                      <Label>Offer Type *</Label>
                            <AvRadioGroup 
                            inline
                            name="type"
                            >
                            
                              <AvRadio
                                onChange={(e, v) => {
                                    setType(true);
                                }}
                                label="Online"
                                value= "Online"
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

                      {/* <Col lg={6}>
                        <Label>Coupon Applicable ?*</Label>
                        <AvRadioGroup inline name="is_coupon_applicable">
                          <AvRadio
                            onChange={(e, v) => {
                              setType(true);
                            }}
                            label="Yes"
                            value={true}
                          />
                          <AvRadio
                            onChange={(e, v) => {
                              setIsCouponApplicable(false);
                            }}
                            label="No"
                            value={false}
                          />
                        </AvRadioGroup>
                      </Col> */}

                      {/* <Col lg={6}>
                        <Label>For First Buyers ?*</Label>
                        <AvRadioGroup inline name="is_for_first_buyers">
                          <AvRadio
                            onChange={(e, v) => {
                              setType(true);
                            }}
                            label="Yes"
                            value={true}
                          />
                          <AvRadio
                            onChange={(e, v) => {
                              setIsForFirstBuyers(false);
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
export default withRouter(connect(null, {})(withNamespaces()(AddOffer)));
