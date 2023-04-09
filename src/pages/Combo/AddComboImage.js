import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
//i18n
import { withNamespaces } from "react-i18next";
import exportFromJSON from "export-from-json";
import cellEditFactory from "react-bootstrap-table2-editor"
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
     Button
} from "reactstrap";
import Dropzone from "react-dropzone";
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
import Select from "react-select";
import { v4 as uuid } from "uuid";
import { postSubmitForm, postSubmitForm_withformdata, } from "../../helpers/forms_helper";
import makeAnimated from "react-select/animated";
const AddComboImage = (props) => {
     const { SearchBar } = Search;

     const animatedComponents = makeAnimated();
     const refContainer = useRef(null);
     const [selectedSupplier, setselectedSupplier] = useState({});
     const refSupplierDetailForm = useRef(null);
     const refSelectProduct = useRef(null);
     const [variantImagesUrls, setvariantImagesUrls] = useState([]);
     const [addressModal, setAddressModal] = useState();
     const [addresses, setAddresses] = useState([]);
     const [selectedProduct, setSelectedProduct] = useState();
     const [selectedVariant, setSelectedVariant] = useState();
     const [supplierModal, setsupplierModal] = useState(false);
     const [comboTotal, setcomboTotal] = useState(0);
     const [comboPrice, setcomboPrice] = useState(0);
     const [allComboProducts, setallComboProducts] = useState([])
     const [isOnline, setisOnline] = useState(false);
     const [selectedVariantFileImages, setselectedVariantFileImages] = useState([]);
     const [rows, setrows] = useState([]);
     const [isEdit, setisEdit] = useState(false);
     const [allProducts, setAllProducts] = useState([]);
     const [suppliersDetail, setsuppliersDetail] = useState([]);
     const [allCombos, setAllCombos] = useState([]);
     const [editModal, setEditModal] = useState();
     const [selectedCombo, setSelectedCombo] = useState();


     useEffect(() => {
          loadCombos();
          loadAllProducts();
     }, []);


     function preloader(status) {
          if (status) {
               document.getElementById("preloader").style.display = "block";
               document.getElementById("status").style.display = "block";
          } else {
               document.getElementById("preloader").style.display = "none";
               document.getElementById("status").style.display = "none";
          }
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
               dataField: "combo_price",
               text: props.t("Combo Price"),
               sort: false,
               headerStyle: (colum, colIndex) => {
                    return { width: "12%" };
               },
          },
          {
               dataField: "total",
               text: props.t("Total"),
               sort: false,
               headerStyle: (colum, colIndex) => {
                    return { width: "10%" };
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

     const deleteSupplierDetails = (id) => {
          if (id) {
               let updatedValues = allComboProducts.filter(ele => ele._id !== id);
               setallComboProducts(updatedValues)
               setSelectedCombo({ ...selectedCombo, products: updatedValues })
          }

     }
     function editFormatter(cell, row) {
          console.log(row)
          return (
               <span className="text-info">
                    <i
                         className="bx bx-image-add font-size-15"
                         title="Click to Edit"
                         style={{ cursor: "pointer" }}
                         onClick={() => {

                              setEditModal(!editModal);
                              setSelectedCombo(row);
                              setallComboProducts(row.products);
                              setvariantImagesUrls(row.image_url)
                              console.log(row)
                         }}
                    ></i>
               </span>
          );
     }
     const offerPrice = (price, offer) => {
          //offer.end_date < current date
          let offerPrice;
          if (offer) {
               if (offer.discount_type && offer.discount_type == 'Percent') {
                    offerPrice = price - (price * offer.discount_value / 100);
               } else if (offer.discount_type && offer.discount_type == 'Flat') {
                    offerPrice = price - offer.discount_value;
               }
          }
          return offerPrice;
     }
     //    type: "Offline"

     function showNotification(message, type) {
          var title = type;
          if (type === "Success") swal.fire(type, message, "success");
          else swal.fire(type, message, "error");
     }


     const formatBytes = (bytes, decimals = 2) => {
          if (bytes === 0) return "0 Bytes";
          const k = 1024;
          const dm = decimals < 0 ? 0 : decimals;
          const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
     }
     const handleAcceptedFilesImages = async (files, isvariant = false) => {
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
               let url = process.env.REACT_APP_BASEURL + "combos/upload_combo_image";
               let formData = new FormData();
               formData.set("combo_id", selectedCombo._id);
               formData.set("document_name", `Image-${uuid()}`);
               formData.append("document_file", files[0]);
               const response = await postSubmitForm_withformdata(url, formData);
               if (variantImagesUrls && variantImagesUrls.length <= 5) {
                    if (response.status === 1 && response.data) {
                         setvariantImagesUrls([response.data, ...variantImagesUrls]);
                         setselectedVariantFileImages([{ files }, ...selectedVariantFileImages]);
                    }
               }
               else {
                    showNotification("No more than 5 images allowed.", "Error");
               }
          } else {
               showNotification("Only JPG and PNG files allowed.", "Error");
          }
     };
     const handleImageDelete = async (index, imageUrl) => {
          let images = variantImagesUrls;
          let payload = {

               combo_id: selectedCombo._id,
               image_url: imageUrl
          }

          preloader(true)
          let url = process.env.REACT_APP_BASEURL + "combos/delete_combo_image";
          let response = await postSubmitForm(url, payload);
          if (response) {
               // console.log(response)
               images = images.filter((ele) => ele !== imageUrl);
               showNotification(response, "Success");
               setvariantImagesUrls(images);
               preloader(false)
          }
          console.log('removed', imageUrl);
     }
     const handleDownload = () => {
          const fileName = "combos";
          const exportType = "xls";
          if (allCombos) {
               var data = JSON.parse(JSON.stringify(allCombos));
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
                                                  toggle={() => setEditModal(!editModal)}>
                                                  <ModalHeader>
                                                       Add Image:
                                                  </ModalHeader>
                                                  <ModalBody>
                                                       <Row>
                                                            <Col lg={12}>
                                                                 <Card>
                                                                      <CardBody>
                                                                           <AvForm


                                                                           >
                                                                                <Row>
                                                                                     <Col lg={12}>
                                                                                          {
                                                                                               selectedCombo &&
                                                                                               <Row>
                                                                                                    <Col className="mt-1 mb-1" md={12} lg={12}>
                                                                                                         <Dropzone
                                                                                                              onDrop={(acceptedFiles) => {
                                                                                                                   handleAcceptedFilesImages(acceptedFiles);
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
                                                                                                                             <h3>{props.t("Combo Image")}</h3>
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
                                                                                                    <Col className="mt-1 mb-1" md={12} lg={12}>
                                                                                                         <Row>
                                                                                                              {variantImagesUrls && variantImagesUrls.length ? (
                                                                                                                   variantImagesUrls.map((imageUrl, idx) => (
                                                                                                                        <Col md={2} lg={2} >
                                                                                                                             <div className="button-wrapper">
                                                                                                                                  <button className="img-btn" onClick={(e) => {
                                                                                                                                       e.preventDefault()
                                                                                                                                       handleImageDelete(idx, imageUrl)
                                                                                                                                  }}>Delete</button>
                                                                                                                             </div>
                                                                                                                             <img
                                                                                                                                  src={imageUrl}
                                                                                                                                  height="100"
                                                                                                                                  width="100"
                                                                                                                                  alt={`Image-${idx}`}
                                                                                                                             ></img>
                                                                                                                        </Col>
                                                                                                                   ))
                                                                                                              ) : null}
                                                                                                         </Row>
                                                                                                    </Col>
                                                                                               </Row>
                                                                                          }

                                                                                     </Col>


                                                                                     <Col md={12} style={{ textAlign: 'center' }}>
                                                                                          <Button
                                                                                               className="btn btn-success waves-effect waves-light btn-sm"
                                                                                               style={{ minHeight: '35px' }}

                                                                                               onClick={() => setEditModal(!editModal)}


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


                                        </CardBody>
                                   </Card>
                              </Col>
                         </Row>
                    </Container>
               </div>
          </React.Fragment>
     );
};
export default withRouter(connect(null, {})(withNamespaces()(AddComboImage)));
