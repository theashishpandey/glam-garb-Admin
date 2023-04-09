import React, { useEffect, useState } from "react";
//i18n
import { withNamespaces } from "react-i18next";
import exportFromJSON from "export-from-json";

import { AvRadio, AvRadioGroup } from "availity-reactstrap-validation";
import {
  Label,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button,
} from "reactstrap";
import swal from "sweetalert2";

import { AvForm, AvField } from "availity-reactstrap-validation";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { postSubmitForm } from "../../helpers/forms_helper";

const AllOffers = (props) => {
  const { SearchBar } = Search;

  useEffect(() => {
    loadOffers();
    loadOffers();
  }, []);
  const [type, setType] = useState(false);
  const [isCouponApplicable, setIsCouponApplicable] = useState(false);
  const [isForFirstBuyers, setIsForFirstBuyers] = useState(false);
  const [allOffers, setAllOffers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allVariants, setAllVariant] = useState([]);
  const [offerId, setOfferId] = useState();
  const loadOffers = async () => {
    let url = process.env.REACT_APP_BASEURL + "offers/getall_master_data";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllOffers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  const loadProducts = async (_id) => {
    console.log(offerId);
    let url = process.env.REACT_APP_BASEURL + "offers/offer_details";
    let response = await postSubmitForm(url, { offer_id: _id });
    if (response.status === 1) {
      setAllProducts(response.data);

      console.log(response.data);
    } else {
      // return  showNotification(response.message, "Error");
    }
  };
  const loadVariants = async (_id) => {
    let payload = {
      offer_code: selectedOffer.code,
      product_id: _id,
    };
    console.log(offerId);
    let url = "https://api-grv.onebigbit.com/offers/offer_varient";
    let response = await postSubmitForm(url, payload);
    if (response.status === 1) {
      setAllVariant(response.data);

      console.log(response.data);
    } else {
      // return  showNotification(response.message, "Error");
    }
  };

  const [currentDate] = useState(() => {
    var d1 = new Date();
    var d = moment(d1).add(15, "days").toDate();
    var month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  });

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  const [editModal, setEditModal] = useState();
  const [editModalVariant, setEditModalVariant] = useState();
  const [selectedOffer, setSelectedOffer] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-info-circle font-size-15"
          title="Click to View"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModal(!editModal);
            setSelectedOffer(row);
            // setOfferId(row._id);
            loadProducts(row._id);
            setAllProducts([]);
          }}
        ></i>
      </span>
    );
  }
  function editFormatter2(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-info-circle font-size-15"
          title="Click to View"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModalVariant(!editModalVariant);
            setSelectedProduct(row);
            loadVariants(row._id);
          }}
        ></i>
      </span>
    );
  }
  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const handleValidUpdate = async (e, v) => {
    v.id = selectedOffer._id;
    let url = process.env.REACT_APP_BASEURL + "offers/update";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadOffers();
      setEditModal(!editModal);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const handleActiveUnactive = async (row) => {
    let payload = {
      is_active: !row.is_active,
      offer_id: row._id,
    };
    console.log(payload);
    let url = process.env.REACT_APP_BASEURL + "offers/active_unactive";
    const response = await postSubmitForm(url, payload);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadOffers();
    } else {
      showNotification(response.message, "Error");
    }
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
      text: props.t("Code"),
      dataField: "code",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      text: props.t("Name"),
      dataField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      text: props.t("Start Date"),
      formatter: (colum, colIndex) => {
        return moment(colIndex.start_date).format("YYYY-MM-DD");
      },

      dataField: "start_date",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "14%" };
      },
    },
    {
      text: props.t("End Date"),
      formatter: (colum, colIndex) => {
        return moment(colIndex.end_date).format("YYYY-MM-DD");
      },

      dataField: "end_date",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "14%" };
      },
    },
    // {
    //   text: props.t("Min Cart Value"),
    //   dataField: "min_cart_value",
    //   sort: true,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "11%" };
    //   },
    // },

    {
      text: props.t("Discount Type"),
      dataField: "discount_type",

      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "11%" };
      },
    },
    {
      dataField: "discount_value",
      text: props.t("Discount Value"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },

    //  {
    //      text: props.t("Offer Type"),
    //      dataField: "type",

    //       sort: false,
    //      headerStyle: (colum, colIndex) => {
    //        return { width: "12%" };
    //     },
    //   },

    // {
    //   dataField: "is_coupon_applicable",
    //   text: props.t("Coupon Applicable ?"),
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "11%" };
    //   },
    // },
    // {
    //   dataField: "is_for_first_buyers",
    //   text: props.t("For First Buyers ?"),
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "11%" };
    //   },
    // },

    {
      dataField: "is_active",
      text: props.t("Status"),

      formatter: (cell, row) => {
        return (
          <>
            {row.is_active == true ? (
              <div className="custom-control custom-switch mb-2" dir="ltr">
                <input
                  type="checkbox"
                  title="Click to change status."
                  className="custom-control-input"
                  id={"customSwitch1" + row._id}
                  checked={row.is_active}
                />
                <label
                  title="Click to change status."
                  className="custom-control-label"
                  htmlFor={"customSwitch1" + row._id}
                  style={{ "font-weight": "100", cursor: "pointer" }}
                  onClick={() => {
                    swal
                      .fire({
                        title: "Are you sure?",
                        text: "You will not be able to activate this offer again!",
                        icon: "warning",
                        showCancelButton: true,
                        cancelButtonText: "No, cancel it!",
                        confirmButtonText: "Yes, I am sure!",
                        dangerMode: true,
                      })
                      .then((confirm) => {
                        if (confirm.isConfirmed) handleActiveUnactive(row);
                      });
                  }}
                ></label>
              </div>
            ) : (
              <b>Offer is Inactive</b>
            )}
          </>
        );
      },
      filter: selectFilter({
        options: () => {
          const unique = [
            ...new Map(
              [
                ...new Set(
                  allOffers.map(({ is_active: value }) => ({
                    value: value,
                    label: value ? "Active" : "Inactive",
                  }))
                ),
              ].map((item) => [item["value"], item])
            ).values(),
          ];
          console.log(unique, "unique");
          return unique;
        },
      }),

      headerStyle: (colum, colIndex) => {
        return { width: "9%" };
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
  const columns_product = [
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
      text: props.t("Product Name"),
      dataField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },

    {
      dataField: "category",
      text: props.t("Category"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      dataField: "category",
      text: props.t("Sub Category"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      dataField: "model_name",
      text: props.t("Model Name"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      dataField: "is_online",
      text: props.t("Active"),

      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },
    {
      text: props.t("Action"),
      formatter: editFormatter2,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
  ];
  const columns_variant = [
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
      text: props.t("Color"),
      dataField: "variantColor",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },

    {
      dataField: "variantSize",
      text: props.t("Size"),
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },

    {
      text: props.t("Price"),
      dataField: "variantPrice",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
  ];

  const handleDownload = () => {
    const fileName = "offers";
    const exportType = "xls";
    if (allOffers) {
      var data = JSON.parse(JSON.stringify(allOffers));
      data.forEach(function (v) {
        delete v.is_active;
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
            title={props.t("Offers")}
            breadcrumbItem={props.t("All Offers")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Offers")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing offers here")}
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
                    data={allOffers && allOffers}
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
                          filter={filterFactory()}
                        />
                      </div>
                    )}
                  </ToolkitProvider>

                  <Modal
                    size="lg"
                    isOpen={editModal}
                    toggle={() => setEditModal(!editModal)}
                  >
                    <ModalHeader toggle={() => setEditModal(!editModal)}>
                      Offer Code : {selectedOffer && selectedOffer.code}
                    </ModalHeader>
                    <ModalBody>
                      {selectedOffer && (
                        <>
                          <Row>
                            <Col lg={12}>
                              <Card>
                                <CardBody>
                                  <Row>
                                    <ToolkitProvider
                                      bootstrap4
                                      keyField="_id"
                                      data={allProducts && allProducts}
                                      columns={columns_product}
                                      noDataIndication={props.t(
                                        "No data to display."
                                      )}
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
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </>
                      )}
                    </ModalBody>
                  </Modal>
                  <Modal
                    size="lg"
                    isOpen={editModalVariant}
                    toggle={() => setEditModalVariant(!editModalVariant)}
                  >
                    <ModalHeader
                      toggle={() => setEditModalVariant(!editModalVariant)}
                    >
                      Product Name : {selectedProduct && selectedProduct.name}
                      <br />
                      Offer Code : {selectedOffer && selectedOffer.code}
                    </ModalHeader>

                    <ModalBody>
                      {selectedProduct && (
                        <>
                          <Row>
                            <Col lg={12}>
                              <Card>
                                <CardBody>
                                  <Row>
                                    <ToolkitProvider
                                      bootstrap4
                                      keyField="_id"
                                      data={allVariants && allVariants}
                                      columns={columns_variant}
                                      noDataIndication={props.t(
                                        "No data to display."
                                      )}
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
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </>
                      )}
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
export default withRouter(connect(null, {})(withNamespaces()(AllOffers)));
