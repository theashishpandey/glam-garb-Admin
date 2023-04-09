import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
//i18n
import { withNamespaces } from "react-i18next";
import exportFromJSON from "export-from-json";
import cellEditFactory from "react-bootstrap-table2-editor";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Label,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button,
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
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import Select from "react-select";
import { postSubmitForm } from "../../helpers/forms_helper";
import makeAnimated from "react-select/animated";
const AllCombos = (props) => {
  const { SearchBar } = Search;
  const animatedComponents = makeAnimated();
  const refContainer = useRef(null);
  const [selectedSupplier, setselectedSupplier] = useState({});
  const refSupplierDetailForm = useRef(null);
  const refSelectProduct = useRef(null);
  const [addressModal, setAddressModal] = useState();
  const [addresses, setAddresses] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedVariant, setSelectedVariant] = useState();
  const [supplierModal, setsupplierModal] = useState(false);
  const [comboTotal, setcomboTotal] = useState(0);
  const [comboPrice, setcomboPrice] = useState(0);
  const [allComboProducts, setallComboProducts] = useState([]);
  const [isOnline, setisOnline] = useState(false);
  const [isPublished, setisPublished] = useState(false);
  const [rows, setrows] = useState([]);
  const [isEdit, setisEdit] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [suppliersDetail, setsuppliersDetail] = useState([]);
  const [allCombos, setAllCombos] = useState([]);
  const [editModal, setEditModal] = useState();
  const [selectedCombo, setSelectedCombo] = useState();
  const [qty, setQty] = useState(0);
  useEffect(() => {
    loadCombos();
    loadAllProducts();
  }, []);

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
        return { width: "2%" };
      },
    },
    {
      text: props.t("Combo Name"),
      dataField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "13%" };
      },
    },
    {
      dataField: "total",
      text: props.t("Total Price"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "18%" };
      },
    },
    {
      dataField: "combo_price",
      text: props.t("Combo Price"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },
    {
      dataField: "is_online",
      text: props.t("Is Online"),
      formatter: (cell, row) => {
        return row.is_online == true ? "Yes" : "No";
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },

    //     {
    //   //   dataField: "combo_price",
    //   formatter: (cell, row) => {
    // let discount = "NA"

    // // console.log(row.offer && Object.keys(row.offer).length ,  row.offer.is_active ,
    // // row.offer.end_date ,
    // // row.offer.start_date < new Date(), "ccc")

    //      if (row.offer && Object.keys(row.offer).length) {
    //        if (
    //          row.offer.is_active &&

    //          moment(row.offer.end_date).format("YYYY-MM-DD HH:mm") > new Date() &&
    //          moment(row.offer.start_date).format("YYYY-MM-DD HH:mm") < new Date()
    //        ) {

    // discount = row.offer.discount_value
    // console.log(row.offer.discount_value)

    //      //     rows.offer.discount_type === "Percent"
    //      //       ? (offerPrice =
    //      //           Number(row.combo_price) -
    //      //           (Number(row.combo_price) * Number(row.offer.discount_value)) /
    //      //             100)
    //      //       : (offerPrice =
    //      //           Number(row.combo_price) - Number(row.offer.discount_value));
    //        }
    //      }

    //      return discount
    //      //console.log(row.offer, "row");
    //    },
    //      text: props.t("Discount"),
    //      sort: false,
    //      headerStyle: (colum, colIndex) => {
    //        return { width: "12%" };
    //      },
    //    },

    //    {
    //     // dataField: "combo_price",
    //     formatter: (cell, row) => {
    //      let discount_type = "NA";

    //      if (row.offer && Object.keys(row.offer).length) {
    //        if (
    //          row.offer.is_active &&
    //          row.offer.end_date > new Date() &&
    //          row.offer.start_date < new Date()
    //        ) {
    //           discount_type = row.offer.discount_type;
    //      //     rows.offer.discount_type === "Percent"
    //      //       ? (offerPrice =
    //      //           Number(row.combo_price) -
    //      //           (Number(row.combo_price) * Number(row.offer.discount_value)) /
    //      //             100)
    //      //       : (offerPrice =
    //      //           Number(row.combo_price) - Number(row.offer.discount_value));
    //        }
    //      }

    //      return discount_type;
    //    },
    //      text: props.t("Discount Type"),
    //      sort: false,
    //      headerStyle: (colum, colIndex) => {
    //        return { width: "12%" };
    //      },
    //    },

    //     {
    //       // dataField: "total",
    //       formatter: (cell, row) => {
    //         let offerPrice = row.combo_price;

    //         if (row.offer && Object.keys(row.offer).length) {
    //           if (
    //             row.offer.is_active &&
    //             row.offer.end_date > new Date() &&
    //             row.offer.start_date < new Date()
    //           ) {
    //             rows.offer.discount_type === "Percent"
    //               ? (offerPrice =
    //                   Number(row.combo_price) -
    //                   (Number(row.combo_price) * Number(row.offer.discount_value)) /
    //                     100)
    //               : (offerPrice =
    //                   Number(row.combo_price) - Number(row.offer.discount_value));
    //           }
    //         }

    //         return console.log(row.offer, "row");
    //       },
    //       text: props.t("Offer Price"),
    //       sort: true,
    //       headerStyle: (colum, colIndex) => {
    //         return { width: "18%" };
    //       },
    //     },

    {
      text: props.t("Action"),
      formatter: editFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
  ];

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

  const loadCombos = async () => {
    let url = process.env.REACT_APP_BASEURL + "combos/admin_all_combo";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      console.log(response);
      setAllCombos(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
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
        setcomboPrice(total);
      } else {
        setcomboTotal(0);
        setcomboPrice(0);
      }
    }
  };
  const deleteCombo = async (id) => {
    try {
      const object = {
        combo_id: id || null,
      };
      let url = process.env.REACT_APP_BASEURL + "combos/delete_combo";
      let response = await postSubmitForm(url, object);
      if (response && response.message) {
        showNotification(response.message, "Success");

        loadCombos();
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      showNotification("Something Went Wrong", "Error");
    }
  };
  function editFormatter(cell, row) {
    console.log(row);
    return (
      <Row>
        <Col md={6} lg={6}>
          <i
            className="bx bxs-trash font-size-15"
            title="Click to Delete"
            style={{ cursor: "pointer" }}
            onClick={() => {
              swal
                .fire({
                  title: "Are you sure?",
                  text: "You will not be able to recover this Combo!",
                  icon: "warning",
                  showCancelButton: true,
                  cancelButtonText: "No, cancel it!",
                  confirmButtonText: "Yes, I am sure!",
                  dangerMode: true,
                })
                .then((confirm) => {
                  if (confirm.isConfirmed) deleteCombo(row._id);
                });
            }}
          ></i>
        </Col>
        <Col lg="6">
          <span className="text-info">
            <i
              className="bx bxs-edit font-size-15"
              title="Click to Edit"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setEditModal(!editModal);
                setSelectedCombo(row);
                setcomboTotal(row.total);
                setcomboPrice(row.combo_price);
                setallComboProducts(row.products);

                console.log(row);
              }}
            ></i>
          </span>
        </Col>
      </Row>
    );
  }
  const offerPrice = (price, offer) => {
    //offer.end_date < current date
    let offerPrice;
    if (offer) {
      if (offer.discount_type && offer.discount_type == "Percent") {
        offerPrice = price - (price * offer.discount_value) / 100;
      } else if (offer.discount_type && offer.discount_type == "Flat") {
        offerPrice = price - offer.discount_value;
      }
    }
    return offerPrice;
  };
  //    type: "Offline"
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
  function showNotification(message, type) {
    var title = type;
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const handleValidSubmit = async (e, v) => {
    let {
      is_online,

      description,
      name,
      total,
      combo_price,
    } = v;

    total = Number(total);
    combo_price = Number(combo_price);
    console.log(v, comboPrice);

    if (combo_price > total) {
      showNotification("Combo Price Can't be greater then set Total ", "Info");
      return;
    } else {
      let payload = {
        id: selectedCombo._id,

        is_online: is_online,
        description,
        name,
        combo_price: combo_price,
        total,
        products: allComboProducts,
      };
      console.log(payload);

      let url = process.env.REACT_APP_BASEURL + "combos/combo_global_update";
      let response = await postSubmitForm(url, payload);
      if (response.status === 1) {
        showNotification(response.message, "Success");

        setallComboProducts([]);
        setEditModal(!editModal);
        loadCombos();
      } else {
        showNotification(response.message, "Error");
      }
    }
  };
  const handleDownload = () => {
    const fileName = "combos";
    const exportType = "xls";
    if (allCombos) {
      var data = JSON.parse(JSON.stringify(allCombos));
      data.forEach(function (v) {
        delete v.products;
        delete v.latest_reviews;
        delete v.description;
        delete v.is_active;
        delete v.top_label;
        delete v.is_online;
        delete v.new_label;
        delete v._id;
        delete v.label;
        delete v.value;
        delete v.createdAt;
        delete v.updatedAt;
        delete v.__v;
        delete v.image_url;
      });
      console.log(data);
      exportFromJSON({ data, fileName, exportType });
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Combos")}
            breadcrumbItem={props.t("All Combos")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Combos")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing combos here")}
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
                    data={allCombos && allCombos}
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
                    size="lg"
                    isOpen={editModal}
                    toggle={() => setEditModal(!editModal)}
                  >
                    <ModalHeader>Update Combo :</ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col lg={12}>
                          <Card>
                            <CardBody>
                              <AvForm onValidSubmit={handleValidSubmit}>
                                <Row>
                                  <Col lg={12}>
                                    {selectedCombo && (
                                      <Row>
                                        <Col lg={6}>
                                          <AvField
                                            name="name"
                                            label={props.t("Name")}
                                            placeholder={props.t(
                                              "Enter Combo Name"
                                            )}
                                            type="text"
                                            value={selectedCombo.name}
                                            validate={{
                                              required: { value: true },
                                            }}
                                            errorMessage={props.t(
                                              "Name cannot be empty"
                                            )}
                                          />
                                        </Col>

                                        <Col lg={6}>
                                          <AvField
                                            name="description"
                                            label={props.t("Description")}
                                            placeholder={props.t(
                                              "Enter Description"
                                            )}
                                            type="textarea"
                                            value={selectedCombo.description}
                                          />
                                        </Col>
                                        <Col lg={6}>
                                          {/* <Label>Total</Label> */}
                                          <AvField
                                            disabled={true}
                                            name="total"
                                            label={props.t("Total")}
                                            //  placeholder={selectedCombo.total}
                                            type="Number"
                                            className="disabled-field"
                                            //value={selectedCombo.total}
                                            // validate={{
                                            //   required: { value: true },
                                            // }}
                                            errorMessage={props.t(
                                              "Total cannot be empty"
                                            )}
                                            value={
                                              comboTotal
                                              // &&
                                              // comboTotal <= 0
                                              //   ? 0
                                              //   : comboTotal
                                            }
                                          />
                                        </Col>
                                        <Col lg={6}>
                                          <AvField
                                            name="combo_price"
                                            label={"ComboPrice"}
                                            validate={{
                                              required: {
                                                errorMessage:
                                                  props.t("Cannot be empty"),
                                              },
                                              pattern: {
                                                value: "^[0-9]*$",
                                                errorMessage: props.t(
                                                  "Only Positive numbers all allowed."
                                                ),
                                              },
                                            }}
                                            type="Number"
                                            value={comboPrice}
                                          />
                                        </Col>
                                        <Col md={6} lg={6}>
                                          <AvField
                                            name="is_online"
                                            label={props.t("Is Online")}
                                            type="checkbox"
                                            value={selectedCombo.is_online}
                                            onChange={() => {
                                              setisOnline(!isOnline);
                                            }}
                                          />
                                        </Col>
                                        {/* <Col md={6} lg={6} >
                                                                                                         <AvField
                                                                                                              name="is_published"
                                                                                                              label={props.t("Is Published")}
                                                                                                              type="checkbox"
                                                                                                              value={selectedCombo.is_published}
                                                                                                              onChange={() => { setisPublished(!isPublished) }}
                                                                                                         />
                                                                                                    </Col> */}
                                      </Row>
                                    )}
                                  </Col>
                                  <Col lg={12}>
                                    <CardTitle className="p-1">
                                      {props.t("Add Products")}
                                    </CardTitle>
                                    <button
                                      slot="end"
                                      type="button"
                                      color="primary"
                                      className="btn btn-success"
                                      onClick={() => {
                                        setsupplierModal(!supplierModal);
                                        setSelectedProduct();
                                      }}
                                    >
                                      <i className="bx bx-plus  font-size-16 align-middle me-2"></i>{" "}
                                      Add Products
                                    </button>
                                  </Col>
                                  <Col className="mt-2 pb-2" lg={12}>
                                    <div className="table-responsive">
                                      <BootstrapTable
                                        keyField="productId"
                                        data={allComboProducts || []}
                                        columns={SupplierColumn}
                                        cellEdit={cellEditFactory({})}
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
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </ModalBody>
                  </Modal>

                  <Modal
                    size="lg"
                    isOpen={supplierModal}
                    toggle={() => setsupplierModal(!supplierModal)}
                  >
                    <ModalHeader>Add Products:</ModalHeader>
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
                                            <Label>{props.t("Products")}</Label>
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
                                                        }-${r.variantSize &&
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
export default withRouter(connect(null, {})(withNamespaces()(AllCombos)));
