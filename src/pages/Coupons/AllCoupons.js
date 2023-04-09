import React, { useEffect, useState } from "react";
//i18n
import { withNamespaces } from "react-i18next";
import exportFromJSON from "export-from-json";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
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

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { postSubmitForm } from "../../helpers/forms_helper";

const AllCoupons = (props) => {
  const { SearchBar } = Search;

  useEffect(() => {
    loadCoupons();
    loadCoupons();
  }, []);
  const [type, setType] = useState(false);

  const [allCoupons, setAllCoupons] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();

  const loadCoupons = async () => {
    let url = process.env.REACT_APP_BASEURL + "coupons/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllCoupons(response.data);
    } else {
      showNotification(response.message, "Error");
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
  const [editModalCustomer, setEditModalCustomer] = useState();
  const [editModal, setEditModal] = useState();
  const [selectedCoupon, setSelectedCoupon] = useState();
  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-edit font-size-15"
          title="Click to Edit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModal(!editModal);
            setSelectedCoupon(row);
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
    v.id = selectedCoupon._id;
    let url = process.env.REACT_APP_BASEURL + "coupons/update";
    const response = await postSubmitForm(url, v);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadCoupons();
      setEditModal(!editModal);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const handleActiveUnactive = async (row) => {
    let payload = {
      is_active: !row.is_active,
      coupon_id: row._id,
    };
    console.log(payload);
    let url = process.env.REACT_APP_BASEURL + "coupons/active_unactive";
    const response = await postSubmitForm(url, payload);

    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadCoupons();
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
      dataField: "coupon_code",
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
    {
      text: props.t("Min Cart Value"),
      dataField: "min_cart_value",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "8%" };
      },
    },

    {
      text: props.t("Discount Type"),
      dataField: "discount_type",

      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      dataField: "discount_value",
      text: props.t("Discount Value"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
    {
      text: props.t("Is Customer Specific"),
      //dataField: "is_customer_specific",


      formatter: (cell, row) => {
        return (
          <>
            {row.is_customer_specific ? (
              <span className="text-info"

              >   <i
                className="bx bx-user-circle font-size-15"
                title="Click to Edit"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setEditModalCustomer(!editModalCustomer);
                  setSelectedCustomer(row.is_customer_specific)
                }}
              ></i></span>

            ) : (
              <b>NA</b>
            )}
          </>
        );
      },




      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "12%" };
      },
    },

    // {
    //   dataField: "",
    //   text: props.t("Redeem History"),
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "6%" };
    //   },
    // },

    {
      dataField: "is_active",
      text: props.t("Active / Inactive"),

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
                        text: "You will not be able to activate this coupon again!",
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
              <b>Coupon is Inactive</b>
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
                  allCoupons.map(({ is_active: value }) => ({
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

    // {
    //      text: props.t("Action"),
    //      formatter: editFormatter,
    //      sort: false,
    //      headerStyle: (colum, colIndex) => {
    //           return { width: "7%" };
    //      },
    // },
  ];
  const columns_customer = [
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
      text: props.t("Name"),
      dataField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      text: props.t("Mobile"),
      dataField: "mobile",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      text: props.t("Email"),
      dataField: "email",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },

  ];

  const handleDownload = () => {
    const fileName = "coupon";
    const exportType = "xls";
    if (allCoupons) {
      var data = JSON.parse(JSON.stringify(allCoupons));
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
            title={props.t("Coupons")}
            breadcrumbItem={props.t("All Coupons")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Coupons")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing coupons here")}
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
                    data={allCoupons && allCoupons}
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
                      Coupon Code:{" "}
                      {selectedCoupon && selectedCoupon.coupon_code}
                    </ModalHeader>
                    <ModalBody>
                      {selectedCoupon && (
                        <Row>
                          <Col lg={12}>
                            <Card>
                              <CardBody>
                                <AvForm
                                  onValidSubmit={(e, v) => {
                                    handleValidUpdate(e, v);
                                  }}
                                >
                                  <CardTitle className="mb-3">
                                    {props.t("Update Coupon")}
                                  </CardTitle>
                                  <CardSubtitle className="mb-4">
                                    {props.t(
                                      "Enter the following details to update coupon"
                                    )}
                                  </CardSubtitle>
                                  <Row>
                                    <Col lg={6}>
                                      <AvField
                                        name="coupon_code"
                                        label={props.t("Coupon Code") + " *"}
                                        placeholder={props.t("Enter Code")}
                                        type="text"
                                        value={selectedCoupon.coupon_code}
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
                                        label={props.t("Redeem Count")}
                                        value={selectedCoupon.redeem_count}
                                        placeholder={props.t(
                                          "Enter Redeem Count"
                                        )}
                                        errorMessage={props.t(
                                          "Cannot be empty."
                                        )}
                                        type="number"
                                      />
                                    </Col>

                                    <Col lg={6}>
                                      <AvField
                                        name="start_date"
                                        label={props.t("Start Date") + " *"}
                                        value={
                                          selectedCoupon.start_date
                                            ? formatDate(
                                              selectedCoupon.start_date
                                            )
                                            : null
                                        }
                                        placeholder={props.t(
                                          "Select Start Date"
                                        )}
                                        type="date"
                                        validate={{
                                          required: {
                                            errorMessage:
                                              props.t("Cannot be empty"),
                                          },
                                        }}
                                      />
                                    </Col>

                                    <Col lg={6}>
                                      <AvField
                                        name="end_date"
                                        label={props.t("End Date") + " *"}
                                        value={
                                          selectedCoupon.end_date
                                            ? formatDate(
                                              selectedCoupon.end_date
                                            )
                                            : null
                                        }
                                        placeholder={props.t("Select End Date")}
                                        type="date"
                                        validate={{
                                          required: {
                                            errorMessage:
                                              props.t("Cannot be empty"),
                                          },
                                        }}
                                      />
                                    </Col>

                                    <Col lg={6}>
                                      <AvField
                                        name="min_cart_value"
                                        label={props.t("Minimum Cart Value")}
                                        value={selectedCoupon.min_cart_value}
                                        placeholder={props.t(
                                          "Enter Minimum Cart Value"
                                        )}
                                        errorMessage={props.t(
                                          "Cannot be empty."
                                        )}
                                        type="number"
                                      />
                                    </Col>

                                    <Col lg={6}>
                                      <Label>Coupon Type*</Label>
                                      <AvRadioGroup
                                        inline
                                        name="coupon_type"
                                        value={
                                          selectedCoupon &&
                                          selectedCoupon.coupon_type
                                        }
                                      >
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
                                    </Col>

                                    <Col lg={6}>
                                      <Label>Discount Type *</Label>
                                      <AvRadioGroup
                                        inline
                                        name="discount_type"
                                        value={selectedCoupon.discount_type}
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
                                        value={selectedCoupon.discount_value}
                                        label={props.t("Discount Price")}
                                        placeholder={props.t(
                                          "Enter discount drice"
                                        )}
                                        errorMessage={props.t(
                                          "Cannot be empty."
                                        )}
                                        type="number"
                                      />
                                    </Col>
                                    <Col lg={12} className="mt-1 mb-1">
                                      <AvField
                                        value={selectedCoupon.is_active}
                                        name="is_active"
                                        label={props.t("is Active")}
                                        type="checkbox"
                                      />
                                    </Col>
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
                      )}
                    </ModalBody>
                  </Modal>

                  <Modal
                    size="lg"
                    isOpen={editModalCustomer}
                    toggle={() => setEditModalCustomer(!editModalCustomer)}
                  >
                    <ModalHeader toggle={() => setEditModalCustomer(!editModalCustomer)}>
                      Customer Details:
                    </ModalHeader>
                    <ModalBody>
                      {selectedCustomer && (
                        <Row>
                          <ToolkitProvider
                            bootstrap4
                            keyField="_id"
                            data={[selectedCustomer]}
                            columns={columns_customer}
                            noDataIndication={props.t("No data to display.")}
                            search
                          >
                            {(props) => (
                              <div>
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
export default withRouter(connect(null, {})(withNamespaces()(AllCoupons)));
