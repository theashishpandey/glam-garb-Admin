import React, { useRef, useState, useEffect } from "react";
//i18n
import { withNamespaces } from "react-i18next";

import { AvRadio, AvInput, AvRadioGroup } from "availity-reactstrap-validation";

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
import { v4 as uuid } from "uuid";
import {
  postSubmitForm,
  postSubmitForm_withformdata,
} from "../../helpers/forms_helper";
import Dropzone from "react-dropzone";
const Settings = (props) => {
  useEffect(() => {
    loadSettings();
  }, []);

  const refContainer = useRef(null);
  const [settingId, setSettingId] = useState();

  const [cartOfferDiscountType, setCartOfferDiscountType] = useState();
  const [cartOfferDiscountalue, setCartOfferDiscountValue] = useState();
  const [cartOfferCartvalue, setCartOfferCartvalue] = useState();

  const [cartFirstDiscountType, setFirstOfferDiscountType] = useState();
  const [cartFirstDiscountalue, setFirstOfferDiscountalue] = useState();
  const [cartFirstCartvalue, setFirstOfferCartvalue] = useState();
  const [variantImagesUrls, setvariantImagesUrls] = useState([]);
  const [selectedVariantFileImages, setselectedVariantFileImages] = useState(
    []
  );
  const [cartOffer, setCartOffer] = useState([]);
  const [check, setCheck] = useState();
  const [Url, setUrl] = useState();
  const [firstOffer, setFirstOffer] = useState([]);
  const [editModal, setEditModal] = useState();
  const loadSettings = async () => {
    let url = process.env.REACT_APP_BASEURL + "settings/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setSettingId(response.data[0]._id);
      setCartOffer(response.data[0].cart_based_offer);
      setFirstOffer(response.data[0].first_buyer_offer);
      setvariantImagesUrls(response.data[0].slider_images);
      let data = [];
      data.push(
        response.data[0].first_buyer_offer && response.data[0].first_buyer_offer
      );

      console.log(check && check);
      // setCheck(response.data[0].first_buyer_offer.is_active_for_cart===true?true: false);
    } else {
      showNotification(response.message, "Error");
    }
  };
  function preloader(status) {
    if (status) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  }
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };
  const handleAcceptedFilesImages = async (files, isvariant = false) => {
    if (!Url) {
      showNotification("Enter Url", "Error");
    } else {
      if (
        files[0].type == "image/jpeg" ||
        files[0].type == "image/jpg" ||
        files[0].type == "image/png"
      ) {
        files.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            formattedSize: formatBytes(file.size),
          })
        );
        let url =
          process.env.REACT_APP_BASEURL + "settings/insert_slider_image";
        let formData = new FormData();
        formData.set("setting_id", settingId);
        formData.set("document_name", `Image-${uuid()}`);
        formData.set("url", Url);
        formData.append("document_file", files[0]);

        if (variantImagesUrls && variantImagesUrls.length <= 2) {
          const response = await postSubmitForm_withformdata(url, formData);
          if (response.status === 1 && response.data) {
            showNotification(response.message, "Success");
            loadSettings();

            setselectedVariantFileImages([
              { files },
              ...selectedVariantFileImages,
            ]);
            setEditModal(false);
          }
        } else {
          showNotification("No more than 3 images allowed.", "Error");
        }
      } else {
        showNotification("Only JPG and PNG files allowed.", "Error");
      }
    }
  };
  const handleImageDelete = async (index, imageUrl) => {
    let images = variantImagesUrls;
    let payload = {
      setting_id: settingId,
      image_url: imageUrl.image_url,
    };

    let url = process.env.REACT_APP_BASEURL + "settings/delete_slider_image";
    let response = await postSubmitForm(url, payload);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadSettings();
      // window.location.reload();
    } else {
      showNotification(response.message, "Error");
    }
    console.log("removed", imageUrl);
  };
  const handleValidSubmit = async (e, v) => {
    console.log(v);

    if (
      v.discount_type_for_cart === "Percent" &&
      Number(v.discount_value_for_cart) > 100
    ) {
      return showNotification(
        "Discount Percantage Should be less than 100 in cart based offer",
        "Error"
      );
    }

    if (
      v.discount_type_for_first_buyer === "Percent" &&
      Number(v.discount_value_for_first_buyer) > 100
    ) {
      return showNotification(
        "Discount Percantage Should be less than 100 in first buyer offer",
        "Error"
      );
    }

    if (Number(v.discount_value_for_first_buyer) < 1) {
      return showNotification(
        "Discount Value Should be greater than 0",
        "Error"
      );
    }

    if (Number(v.discount_value_for_cart) < 1) {
      return showNotification(
        "Discount Value Should be greater than 0",
        "Error"
      );
    }

    let url = process.env.REACT_APP_BASEURL + "settings/update";
    let payload = {
      setting_id: "6320248d78d377000964a79f",

      cart_based_offer: {
        discount_type_for_cart: v.discount_type_for_cart,
        discount_value_for_cart: v.discount_value_for_cart,
        minimum_cart_value_for_cart: v.minimum_cart_value_for_cart,
        is_active_for_cart: v.is_active_for_cart,
      },
      first_buyer_offer: {
        discount_type_for_first_buyer: v.discount_type_for_first_buyer,
        discount_value_for_first_buyer: v.discount_value_for_first_buyer,
        minimum_cart_value_for_first_buyer:
          v.minimum_cart_value_for_first_buyer,
        is_active_for_first_buyer: v.is_active_for_first_buyer,
      },
    };
    console.log(payload);

    const response = await postSubmitForm(url, payload);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadSettings();
    } else {
      showNotification(response.message, "Error");
    }
  };
  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const [typeCart, setTypeCart] = useState(false);
  const [type, setType] = useState(false);

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
            title={props.t("Settings")}
            breadcrumbItem={props.t("Update Settings")}
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
                    <CardTitle>{props.t("Update settings")}</CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t(
                        "Enter the following details to update settings"
                      )}
                    </CardSubtitle>

                    <Row>
                      <Col lg={12} className="text-center mb-2">
                        <CardTitle>{props.t("Cart Based Offer")}</CardTitle>
                      </Col>
                      <Col lg={3}>
                        <Label>Discount Type </Label>
                        <AvRadioGroup
                          inline
                          name="discount_type_for_cart"
                          validate={{
                            required: {
                              errorMessage: props.t("Cannot be empty"),
                            },
                          }}
                          value={cartOffer && cartOffer.discount_type_for_cart}
                        >
                          <AvRadio
                            name="CartOffer"
                            onChange={(e, v) => {
                              setType(true);
                            }}
                            label="Percent"
                            value="Percent"
                          />
                          <AvRadio
                            name="No"
                            onChange={(e, v) => {
                              setType(false);
                            }}
                            label="Flat"
                            value="Flat"
                          />
                        </AvRadioGroup>
                      </Col>

                      <Col lg={3}>
                        <AvField
                          name="discount_value_for_cart"
                          label={props.t("Discount Value")}
                          placeholder={props.t("Enter Value")}
                          errorMessage={props.t("Cannot be empty.")}
                          type="number"
                          value={cartOffer && cartOffer.discount_value_for_cart}
                          // onChange={(e, v) => {
                          //   setFirstOfferDiscountalue(e.target.value);
                          // }}
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

                      <Col lg={3}>
                        <AvField
                          name="minimum_cart_value_for_cart"
                          label={props.t("Minimum Cart Value")}
                          placeholder={props.t("Enter Minimum Cart Value")}
                          errorMessage={props.t("Cannot be empty.")}
                          type="number"
                          value={
                            cartOffer && cartOffer.minimum_cart_value_for_cart
                          }
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
                          // onChange={(e, v) => {
                          //   setFirstOfferCartvalue(e.target.value);
                          // }}
                        />
                      </Col>

                      <Col lg={3} className="mt-4">
                        <AvField
                          checked={cartOffer.is_active_for_cart ? true : false}
                          name="is_active_for_cart"
                          label={props.t("Active")}
                          type="checkbox"
                        />
                      </Col>

                      <Col lg={12} className="text-center mb-2">
                        <CardTitle>{props.t("First Buyer Offer")}</CardTitle>
                      </Col>
                      <Col lg={3}>
                        <Label>Discount Type</Label>
                        <AvRadioGroup
                          inline
                          name="discount_type_for_first_buyer"
                          validate={{
                            required: {
                              errorMessage: props.t("Cannot be empty"),
                            },
                          }}
                          value={
                            firstOffer &&
                            firstOffer.discount_type_for_first_buyer
                          }
                        >
                          <AvRadio
                            name="FirstOffer"
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

                      <Col lg={3}>
                        <AvField
                          name="discount_value_for_first_buyer"
                          label={props.t("Discount Value")}
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
                          // onChange={(e, v) => {
                          //   setCartOfferDiscountValue(e.target.value);
                          // }}
                          value={
                            firstOffer &&
                            firstOffer.discount_value_for_first_buyer
                          }
                        />
                      </Col>

                      <Col lg={3}>
                        <AvField
                          name="minimum_cart_value_for_first_buyer"
                          label={props.t("Minimum Cart Value")}
                          placeholder={props.t("Enter Minimum Cart Value")}
                          errorMessage={props.t("Cannot be empty.")}
                          type="number"
                          // onChange={(e, v) => {
                          //   setCartOfferCartvalue(e.target.value);
                          // }}
                          value={
                            firstOffer &&
                            firstOffer.minimum_cart_value_for_first_buyer
                          }
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
                      <Col lg={3} className="mt-4">
                        <AvField
                          name="is_active_for_first_buyer"
                          checked={
                            firstOffer.is_active_for_first_buyer ? true : false
                          }
                          label={props.t("Active")}
                          type="checkbox"
                          errorMessage={props.t("Cannot be empty.")}
                        />
                      </Col>

                      <Col lg={12}>
                        <Button
                          type="button"
                          color="primary"
                          className="mr-1"
                          onClick={() => {
                            setEditModal(!editModal);
                          }}
                        >
                          {props.t("Add Slidebar Images")}
                        </Button>{" "}
                        <Col className="mt-3 mb-1" md={12} lg={12}>
                          <Row>
                            {variantImagesUrls && variantImagesUrls.length
                              ? variantImagesUrls.map((imageUrl, idx) => (
                                  <Col md={2} lg={2}>
                                    <div className="button-wrapper">
                                      <button
                                        className="img-btn"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleImageDelete(idx, imageUrl);
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                    <img
                                      src={imageUrl.image_url}
                                      height="100"
                                      width="100"
                                      alt={`Image-${idx}`}
                                    ></img>
                                    <br />
                                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{" "}
                                    <label>
                                      <a href={imageUrl.url} target="_blank">
                                        Url
                                      </a>
                                    </label>
                                  </Col>
                                ))
                              : null}
                          </Row>
                        </Col>
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
                              {props.t("Update")}
                            </Button>{" "}
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </AvForm>
                  <Modal
                    size="lg"
                    isOpen={editModal}
                    toggle={() => setEditModal(!editModal)}
                  >
                    <ModalHeader>Add Image:</ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col lg={12}>
                          <Card>
                            <CardBody>
                              <AvForm>
                                <Row>
                                  <Col lg="6">
                                    <AvField
                                      name="url"
                                      onChange={(e, v) => {
                                        setUrl(e.target.value);
                                        console.log(e.target.value);
                                      }}
                                      label="Url"
                                      type="text"
                                      validate={{ required: { value: true } }}
                                      errorMessage={props.t("Cannot be empty")}
                                    />
                                  </Col>

                                  <Col className="mt-1 mb-1" md={12} lg={12}>
                                    <Dropzone
                                      onDrop={(acceptedFiles) => {
                                        handleAcceptedFilesImages(
                                          acceptedFiles
                                        );
                                      }}
                                    >
                                      {({ getRootProps, getInputProps }) => (
                                        <div className="dropzone">
                                          <div
                                            className="dz-message needsclick mt-2"
                                            {...getRootProps()}
                                          >
                                            <input {...getInputProps()} />
                                            <div className="mb-3">
                                              <i className="display-4 text-muted bx bxs-cloud-upload" />
                                            </div>
                                            <h3>{props.t("Slidebar Image")}</h3>
                                            <h4>
                                              {props.t(
                                                "Drop file here or click to upload."
                                              )}
                                            </h4>
                                          </div>
                                        </div>
                                      )}
                                    </Dropzone>
                                  </Col>

                                  <Col md={12} style={{ textAlign: "center" }}>
                                    <Button
                                      className="btn btn-success waves-effect waves-light btn-sm"
                                      style={{ minHeight: "35px" }}
                                      onClick={() => setEditModal(!editModal)}
                                    >
                                      {props.t("Close")}
                                    </Button>
                                  </Col>
                                </Row>
                              </AvForm>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
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
export default withRouter(connect(null, {})(withNamespaces()(Settings)));
