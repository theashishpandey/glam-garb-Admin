import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { withNamespaces } from "react-i18next";
import { v4 as uuid } from "uuid";
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
  Modal,
  ModalHeader,
  ModalBody,
  CardHeader,
  Collapse,
} from "reactstrap";
import swal from "sweetalert2";

import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from "react-bootstrap-table2-editor";
import {
  AvForm,
  AvField,
  AvRadioGroup,
  AvRadio,
} from "availity-reactstrap-validation";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "react-tagsinput/react-tagsinput.css";
import {
  postSubmitForm,
  postSubmitForm_withformdata,
} from "../../helpers/forms_helper";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { set, uniqueId } from "lodash";
import TagsInput from "react-tagsinput";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const AddCombo = (props) => {
  const animatedComponents = makeAnimated();
  const refSelectProduct = useRef(null);
  const refContainer = useRef(null);

  const refSupplierDetailForm = useRef(null);

  const [supplierModal, setsupplierModal] = useState(false);
  const [rows, setrows] = useState([]);
  const [comboPrice, setcomboPrice] = useState(0);
  const [qty, setQty] = useState(0);

  const [selectedSupplier, setselectedSupplier] = useState({});
  const [isEdit, setisEdit] = useState(false);

  const [selectedOffers, setSelectedOffers] = useState();
  const [allOffers, setAllOffers] = useState([]);

  const loadAllOffers = async () => {
    let url = process.env.REACT_APP_BASEURL + "offers/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllOffers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedVariant, setSelectedVariant] = useState();
  const [allComboProducts, setallComboProducts] = useState([]);
  const [comboTotal, setcomboTotal] = useState(0);
  const [isOnline, setisOnline] = useState(false);
  const [isPublished, setisPublished] = useState(false);
  const loadAllProducts = async () => {
    let url = process.env.REACT_APP_BASEURL + "products/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      console.log(response);
      setAllProducts(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  useLayoutEffect(() => {
    loadAllProducts();
    loadAllOffers();
  }, []);
  const addSupplierPackageInfo = (e, v) => {

    var new_array_products = JSON.parse(JSON.stringify(allComboProducts));

    console.log(new_array_products);
    const existing_product = new_array_products.filter(function (product) {
      return product._id === selectedProduct._id;
    });

    if (existing_product.length > 0) {
      showNotification(
        props.t("This product is already added."),
        props.t("Error")
      );
    } else {
      if (selectedProduct && selectedVariant) {
        let details = [
          ...allComboProducts,
          {
            _id: selectedProduct._id,
            name: selectedProduct.name,
            qty: qty,
            category: selectedProduct.category,
            sub_category: selectedProduct.sub_category,
            available: selectedProduct.available,
            ratings: selectedProduct.ratings,
            latest_reviews: { ...selectedProduct.latest_reviews },
            descriptions: selectedProduct.descriptions,
            new_label: selectedProduct.new_label,
            top_label: selectedProduct.top_label,
            variant_details: { ...selectedVariant },
            model_name: selectedProduct.model_name,
            highlights: selectedProduct.highlights,
            is_active: selectedProduct.is_active,
            is_online: selectedProduct.is_online,
            total_price: selectedVariant.variantPrice * qty,
            createdAt: selectedProduct.createdAt,
            updatedAt: selectedProduct.updatedAt,
            original_model: selectedProduct.original_model,
            __v: selectedProduct.__v,
          },
        ];
        if (details && details.length) {
          setallComboProducts(JSON.parse(JSON.stringify(details)));
        }
        setcomboTotal(comboTotal + selectedVariant.variantPrice * qty);
        console.log(details);
      }
    }

    //  Note : combo price <= totalprice
    // setsupplierDetails(detail)
    setsupplierModal(false);
    setrows([]);
    setSelectedProduct();
    setSelectedVariant();
    setisEdit(false);

    console.log(allComboProducts);
  };

  const SupplierColumn = [
    {
      dataField: "_id",
      text: "id",
      hidden: true,
    },
    {
      text: "Product",
      dataField: "name",
      // formatter: (cell, row) => {
      //   let x = selectedProduct ? selectedProduct.find((ele) => ele._id == row?.productId) : null;
      //   if (x && x.name) return (
      //     x.name
      //   )
      // }
    },
    {
      //dataField: 'color',
      formatter: (cell, row) => {
        return row.variant_details && row.variant_details.variantColor;
        //return console.log(row.variant_details.variantColor, "row");
      },
      text: "Color",
    },
    {
      //dataField: 'color',
      formatter: (cell, row) => {
        return row.variant_details && row.variant_details.variantSize;
        //return console.log(row.variant_details.variantColor, "row");
      },
      text: "Size",
    },
    {
      //  dataField: 'qty',
      formatter: (cell, row) => {
        return row.qty
        //return console.log(row.variant_details.variantColor, "row");
      },
      text: "Qty",
    },
    {
      // dataField: 'price',
      formatter: (cell, row) => {
        return row.variant_details && row.variant_details.variantPrice;
        //return console.log(row.variant_details.variantColor, "row");
      },
      text: "Price",
    },
    {
      formatter: (cell, row) => {
        return row.total_price;
        //return console.log(row.variant_details.variantColor, "row");
      },

      text: "Total Price",
    },
    {
      text: props.t("Action"),
      formatExtraData: allComboProducts,

      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
      formatter: (cell, row) => {
        return (
          <Row>
            <Col lg={6}>
              <span className="text-info">
                <i
                  className="bx bxs-trash font-size-15"
                  title="Click to Delete"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    // setselectedSupplier(row)
                    // setvariantImagesUrls(row.variantImgUrl)
                    deleteSupplierDetails(row);
                  }}
                ></i>
              </span>
            </Col>
            {/* <Col lg={6}>
          <span className="text-info">
            <i
              className="bx bxs-edit font-size-15"
              title="Click to Edit"
              style={{ cursor: "pointer" }}
              onClick={() => {
                console.log(row)
                setisEdit(true)
                setselectedSupplier(row)
                setrows(row.packageDimensionsDetails || [])
                setsupplierModal(true)
              }}
            ></i>
          </span>
        </Col> */}
          </Row>
        );
      },
    },
  ];

  const deleteSupplierDetails = (row) => {
    if (row._id) {
      let arr = JSON.parse(JSON.stringify(allComboProducts));
      let updatedVariants = arr.filter((ele) => ele._id !== row._id);

      setallComboProducts(updatedVariants);

      if (updatedVariants.length > 0) {
        const total = updatedVariants
          .map((item) => item.total_price)
          .reduce((prev, next) => prev + next);

        setcomboTotal(total);
      } else {
        setcomboTotal(0);
      }
    }
  };

  const showNotification = (message, type) => {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  };
  console.log(allComboProducts);
  const handleValidSubmit = async (e, v) => {
    let {
      is_online,
      description,
      assembly_charges,
      //  available,
      name,
      total,
      combo_price,
    } = v;

    if (assembly_charges === "") {
      assembly_charges = 0;
    }

    if (comboPrice > comboTotal) {
      showNotification("Combo Price Can't be greater then set Total ", "Info");
      return;
    } else {
      if (allComboProducts.length === 0) {
        showNotification("Please add atleast one product", "Info");
        return;
      }

      let payload = {
        // offer: selectedOffers,
        is_online: is_online,
        assembly_charges: assembly_charges,
        description,
        // available,
        name,
        combo_price,
        total,
        products: allComboProducts,
      };
      console.log(payload);
      console.log(allComboProducts);

      let url = process.env.REACT_APP_BASEURL + "combos/insert";
      let response = await postSubmitForm(url, payload);
      if (response.status === 1) {
        showNotification(response.message, "Success");
        refContainer.current.reset();
        setallComboProducts([]);
      } else {
        showNotification(response.message, "Error");
      }
    }
  };
  //

  console.log(selectedVariant);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Combo")}
            breadcrumbItem={props.t("Add Combos")}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm onValidSubmit={handleValidSubmit} ref={refContainer}>
                    <CardTitle>{props.t("Add Combos")}</CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t(
                        "Enter the following details to add a new combo"
                      )}
                    </CardSubtitle>
                    <Row>
                      <Col lg={12}>
                        <Row>
                          <Col lg={6}>
                            <AvField
                              name="name"
                              label={props.t("Name") + " *"}
                              placeholder={props.t("Enter Combo Name")}
                              type="text"
                              validate={{ required: { value: true } }}
                              errorMessage={props.t("Name cannot be empty")}
                            />
                          </Col>

                          <Col lg={6}>
                            <AvField
                              name="description"
                              label={props.t("Description")}
                              placeholder={props.t("Enter Description")}
                              type="textarea"
                            />
                          </Col>
                          <Col lg={6}>
                            <AvField
                              disabled={true}
                              name="total"
                              label={"Total"}
                              placeholder={props.t("Product Total")}
                              type="Number"
                              className="disabled-field"
                              value={comboTotal}
                            />
                          </Col>
                          <Col lg={6}>
                            <AvField
                              name="combo_price"
                              label={"ComboPrice *"}
                              placeholder={props.t("Enter Combo Price")}
                              type="Number"
                              validate={{
                                required: true,
                                pattern: {
                                  value: "^[0-9]+$",
                                  errorMessage: props.t(
                                    "Price should be greater than zero."
                                  ),
                                },
                              }}
                              onChange={(e) => setcomboPrice(e.target.value)}
                              value={comboPrice || comboTotal}
                            />
                          </Col>
                          {/* <Col lg={6}>
                            <AvField
                              name="available"
                              label={"Available *"}
                              placeholder={props.t("Enter Available Quantity")}
                              type="Number"
                              validate={{
                                required: true,
                                pattern: {
                                  value: "^[0-9]+$",
                                  errorMessage: props.t(
                                    "Available quantity should be greater than zero."
                                  ),
                                },
                              }}
                              errorMessage={props.t(
                                "Available cannot be empty"
                              )}
                            />{" "}
                          </Col> */}
                          <Col md={6} lg={6}>
                            <AvField
                              name="assembly_charges"
                              label={props.t("Assembly Charges (if any)")}
                              placeholder={props.t("Enter assembly charges")}
                              type="Number"
                              validate={{
                                pattern: {
                                  value: "^[0-9]+$",
                                  errorMessage: props.t(
                                    "Assembly charges should be greater than zero."
                                  ),
                                },
                              }}
                            />
                          </Col>
                          {/* <Col md={6} lg={6} >
                            <AvField
                              name="is_published"
                              label={props.t("Published")}
                              type="checkbox"
                              value={isPublished}
                              onChange={() => { setisPublished(!isPublished) }}
                            />
                          </Col> */}

                          <Col md={6} className="mt-3">
                            <AvField
                              name="is_online"
                              label={props.t("Online")}
                              type="checkbox"
                              value={isOnline}
                              onChange={() => {
                                setisOnline(!isOnline);
                              }}
                            />
                          </Col>

                          {/* <Col lg={6}>
                            <Label>{props.t("Add Offer")}</Label>
                            <Select
                              value={selectedOffers}
                              onChange={(selected) => {
                                setSelectedOffers(selected);
                              }}
                              options={allOffers}
                              classNamePrefix="select2-selection"
                              required
                            />
                          </Col> */}
                        </Row>
                      </Col>

                      <Col lg={12}>
                        <CardTitle className="p-1">
                          {props.t("Add Product")}
                        </CardTitle>
                        <button
                          slot="end"
                          type="button"
                          color="primary"
                          className="btn btn-success"
                          onClick={() => {
                            setsupplierModal(!supplierModal);
                          }}
                        >
                          <i className="bx bx-plus  font-size-16 align-middle me-2"></i>{" "}
                          Add Product
                        </button>
                      </Col>

                      <Col className="mt-2 pb-2" lg={12}>
                        <div className="table-responsive">
                          <BootstrapTable
                            bootstrap4
                            keyField="_id"
                            data={allComboProducts && allComboProducts}
                            columns={SupplierColumn}
                            striped
                            condensed
                          />
                        </div>
                      </Col>
                      <Col md={12} style={{ textAlign: "center" }}>
                        <Button
                          className="btn btn-success waves-effect waves-light btn-sm"
                          style={{ minHeight: "35px" }}
                        >
                          {props.t("Save Combo")}
                        </Button>
                      </Col>
                    </Row>
                  </AvForm>
                  {/* Combo info modal start */}
                  <Modal
                    size="lg"
                    isOpen={supplierModal}
                    toggle={() => setsupplierModal(!supplierModal)}
                  >
                    <ModalHeader>Add Product:</ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col lg={12}>
                          <Card>
                            <CardBody>
                              <AvForm
                                onValidSubmit={(e, v) => {
                                  addSupplierPackageInfo(e, v);
                                }}
                                ref={refSupplierDetailForm}
                              >
                                <Row>
                                  <Col md={12} lg={12}>
                                    <Card>
                                      <CardBody>
                                        <CardTitle className="mb-4">
                                          Product details
                                        </CardTitle>
                                        <Row data-repeater-item>
                                          <Col lg={4}>
                                            <Label>{props.t("Product")}</Label>
                                            <Select
                                              ref={refSelectProduct}
                                              value={selectedProduct}
                                              onChange={(selected) => {
                                                setSelectedProduct(selected);
                                              }}
                                              options={allProducts}
                                              classNamePrefix="select2-selection"
                                              components={animatedComponents}
                                              validate={{
                                                required: { value: true },
                                              }}
                                              errorMessage="Select Product"
                                            />
                                          </Col>

                                          <Col lg={4}>
                                            <AvField
                                              name="selected_variant"
                                              label="Select Variant "
                                              placeholder={props.t("Select")}
                                              type="select"
                                              validate={{
                                                required: { value: true },
                                              }}
                                              errorMessage="Select Variant"
                                              onChange={(selected) => {
                                                let selectedVariant =
                                                  selectedProduct &&
                                                  selectedProduct.variant_details &&
                                                  selectedProduct.variant_details.find(
                                                    (ele) =>
                                                      ele._id ==
                                                      selected.target.value
                                                  );
                                                setSelectedVariant(
                                                  selectedVariant
                                                );
                                                console.log(selectedVariant);
                                              }}
                                            >
                                              <option value="">
                                                -- {props.t("Select")} --
                                              </option>
                                              {selectedProduct &&
                                                selectedProduct.variant_details.map(
                                                  (r) => (
                                                    <option
                                                      key={r._id}
                                                      value={r._id}
                                                    >
                                                      {`${r.variantColor &&
                                                        r.variantColor
                                                        }----${r.variantSize &&
                                                        r.variantSize
                                                        }`}
                                                    </option>
                                                  )
                                                )}
                                            </AvField>
                                          </Col>
                                          <Col lg={4} className="mb-3">
                                            <AvField
                                              name="qty"
                                              label={"Qty"}
                                              placeholder={props.t("Qty")}
                                              type="Number"
                                              onChange={(e, v) => {
                                                setQty(e.target.value);
                                              }}
                                              validate={{
                                                required: { value: true },
                                                pattern: {
                                                  value: "^[0-9]+$",
                                                  errorMessage: props.t(
                                                    "Only numbers are allowed."
                                                  ),
                                                },
                                              }}
                                              errorMessage={props.t("Quantity cannot be empty")}
                                            />
                                          </Col>
                                          {/* <Col lg="3" className="mb-3">
                                            <AvField
                                              disabled={true}
                                              name="price"
                                              label={"Price"}
                                              placeholder={props.t(
                                                "Enter Price"
                                              )}
                                              type="Number"
                                              className="disabled-field"
                                              // validate={{ required: { value: true } }}
                                              errorMessage={props.t(
                                                "Price cannot be empty"
                                              )}
                                              onChange={(e) => {
                                                e.price = e.target.value;
                                              }}
                                              value={
                                                (selectedVariant &&
                                                  selectedVariant.variantPrice) ||
                                                ""
                                              }
                                            />
                                          </Col> */}
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                  <Col lg={12}>
                                    <hr />
                                    <Button
                                      color="primary"
                                      className="mr-1"
                                      slot="start"
                                      onClick={() => addSupplierPackageInfo()}
                                    >
                                      {props.t("Save")}
                                    </Button>
                                    <Button
                                      color="danger"
                                      slot="end"
                                      className="mr-1 ml-1"
                                      onClick={() =>
                                        setsupplierModal(!supplierModal)
                                      }
                                    >
                                      {props.t("cancel")}
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

export default withRouter(connect(null, {})(withNamespaces()(AddCombo)));
