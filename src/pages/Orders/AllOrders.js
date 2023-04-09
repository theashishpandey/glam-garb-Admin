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
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button
} from "reactstrap";
import swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

import { AvForm, AvField } from "availity-reactstrap-validation";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { postSubmitForm } from "../../helpers/forms_helper";

const AllOrders = (props) => {
  const { SearchBar } = Search;
  const [productModal, setProductModal] = useState();
  const [products, setProducts] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const [allOrders, setAllOrders] = useState([]);
  const loadOrders = async () => {
    let url = process.env.REACT_APP_BASEURL + "orders/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllOrders(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };

  const [helpModal, sethelpModal] = useState();
  const [selectedOrders, setSelectedOrders] = useState();

  function editFormatter(cell, row) {
    return (
      <span className="text-info">
        <i
          className="bx bxs-edit font-size-15"
          title="Click to Edit"
          style={{ cursor: "pointer" }}
          onClick={() => {
          
           sethelpModal(!helpModal);
          setSelectedOrders(row);

            setProducts(row&&row.product_details[0]);
            console.log(row.product_details[0]);
          }}
        ></i>
      </span>
    );
  }

  function showNotification(message, type) {
    var title = type;
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }

  const handleValidSubmit = async (e, v) => {
    let obj={
      id : selectedOrders._id,
      status:v.status
    }
   
    let url = process.env.REACT_APP_BASEURL + "orders/update_status_offline";
    console.log(v);
    const response = await postSubmitForm(url, obj);
    if (response && response.status === 1) {
      showNotification(response.message, "Success");
      loadOrders();
     sethelpModal(!helpModal);
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
        return { width: "3%" };
      },
    },
    
    {
      dataField: "status",
      text: props.t("status"),
      sort: false,
      headerStyle: (colum, colIndex) => {

        return { width: "12%" };
      },
    },
    {
      dataField: "total_amount",
      text: props.t("total amount"),
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "18%" };
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
      text: "_id",
      hidden: true,
    },
    {
      dataField: "_id",
      formatter: (cell, row, rowIndex) => {
        return rowIndex + 1;
      },
      text: "#",
      headerStyle: (colum, colIndex) => {
        return { width: "3%" };
      },
    },
    {
      dataField: "name",
      text: "Product Name",
    },
    //   {
    //     // dataField: "model_name",
    //     formatter: (cell, row) => {
    //       let color = ""
    //  row && row.product_details && row.product_details.map((item) => {
    //   color = item.va
    //       })
    //       return color;
    //     },

    //     text: "Color",
    //   },
    {
      dataField: "brand",

      text: "Brand Name",
    },
    {
      dataField: "price",

      text: "Price",
    },
   


  ];

  

  

 

  const handleDownload = () => {
    const fileName = "orders";
    const exportType = "xls";
    if (allOrders) {
      var data = JSON.parse(JSON.stringify(allOrders));
      data.forEach(function (v) {
        delete v.products;
        delete v.is_active;
        delete v._id;
        delete v.tokens;
        delete v.pwd;
        delete v.value;
        delete v.label;
        delete v.createdAt;
        delete v.updatedAt;
        delete v.__v;
        delete v.image_url;
      });
      console.log(data);
      exportFromJSON({ data, fileName, exportType });
    }
  };
  const rowStyle = { backgroundColor: "#c8e6c9", fontSize: "15px" };
  const expandRow = {
    onlyOneExpanding: true,

    renderer: (row) => (
      <>
        <strong>Product Details:</strong>
        <BootstrapTable
          keyField="_id"
          columns={columns_product}
          data={row.product_details}
          noDataIndication="No orders to display."
          striped
          hover
         
          search
        />
      </>
    ),
  };
  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Orders")}
            breadcrumbItem={props.t("All Orders")}
          />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle>{props.t("All Orders")} </CardTitle>
                  <CardSubtitle className="mb-3">
                    {props.t("View all your existing orders here")}
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
                    <Col lg={12}>
                                        <BootstrapTable
                                          bootstrap4
                                          keyField="_id"
                                          key="_id"
                                          data={allOrders && allOrders}
                                          columns={columns && columns}
                                          expandRow={expandRow}
                                          noDataIndication="No data to display."
                                          rowStyle={rowStyle}
                                        />
                                      </Col>

                

                                      <Modal
        size="md"
        isOpen={helpModal}
        toggle={() => sethelpModal(!helpModal)}
      >
        <ModalHeader toggle={() => sethelpModal(!helpModal)}>
          Order
        </ModalHeader>
        <ModalBody>
          <>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    
                    <AvForm 
                       onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v);
                      }}
                    >
                      <Row>
                        <Col lg={12}>
                        <AvField
                          name="status"
                          label={props.t("Select") + " *"}
                          value={selectedOrders&&selectedOrders.status}
                          type="select"
                          //onChange={handleChange}
                          validate={{ required: { value: true } }}
                          errorMessage={props.t("Select Status")}
                        >
                          <option value="">
                            -- {props.t("Select Status")} --
                          </option>
                          <option value="Dispatched">
                          {props.t("Dispatched")}</option>
                         
                          <option value="Delivered">
                            {props.t("Delivered")}
                          </option>
                          <option value="Cancelled">
                            {props.t("Cancelled")}
                          </option>
                        </AvField>
                        </Col>

                       
                        <Col lg={12}>
                          <hr />
                          <FormGroup className="mb-0 text-center">
                            <div>
                              <Button
                                type="submit"
                                color="info"
                              
                              >
                                Submit
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
          </>
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
export default withRouter(connect(null, {})(withNamespaces()(AllOrders)));
