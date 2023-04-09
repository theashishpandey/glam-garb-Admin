import React, { useEffect, useState } from "react";
//i18n
import { withNamespaces } from "react-i18next";
import exportFromJSON from "export-from-json";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Button,
} from "reactstrap";
import swal from "sweetalert2";

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

const AllSubscribers = (props) => {
  const { SearchBar } = Search;

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleSubscribersStatusUpdate = async (subscribers) => {
    let url = process.env.REACT_APP_BASEURL + "subscribers/activate_deactivate";
    const response = await postSubmitForm(url, {
      email: subscribers.email,
      is_active: !subscribers.is_active,
    });
    if (response && response.status === 1) {
      loadSubscribers();
    } else {
      showNotification(response.message, "Error");
    }
  };

  function showStatusFormatter(cell, row) {
    return (
      <>
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
              handleSubscribersStatusUpdate(row);
            }}
          ></label>
        </div>

        {row.is_active ? (
          <span class="font-size-12 badge-soft-success badge badge-success badge-pill">
            Active
          </span>
        ) : (
          <span class="font-size-12 badge-soft-danger badge badge-danger badge-pill">
            Inactive
          </span>
        )}
      </>
    );
  }
  const [editModal, setEditModal] = useState();
  const [selectedOffer, setSelectedOffer] = useState();
  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-edit font-size-15"
          title="Click to Edit"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setEditModal(!editModal);
            setSelectedOffer(row);
          }}
        ></i>
      </span>
    );
  }

  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const [allSubscribers, setAllSubscribers] = useState([]);
  const loadSubscribers = async () => {
    let url = process.env.REACT_APP_BASEURL + "subscribers/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllSubscribers(response.data);
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
        return { width: "3%" };
      },
    },
    {
      text: props.t("E Mails"),
      dataField: "email",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      text: props.t("Date"),

      formatter: (colum, colIndex) => {
        return moment(colIndex.createdAt).format("YYYY-MM-DD HH:mm");
      },
      dataField: "createdAt",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
    },
    {
      text: props.t("Status"),
      formatter: showStatusFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "7%" };
      },
    },
  ];

  const handleDownload = () => {
    const fileName = "subscribers";
    const exportType = "xls";
    if (allSubscribers) {
      var data = JSON.parse(JSON.stringify(allSubscribers));
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
            title={props.t("Subscribers")}
            breadcrumbItem={props.t("E Mail")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Subscribers")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing subscribers here")}
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
                    data={allSubscribers && allSubscribers}
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default withRouter(connect(null, {})(withNamespaces()(AllSubscribers)));
