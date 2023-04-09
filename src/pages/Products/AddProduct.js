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
  Collapse
} from "reactstrap";
import swal from "sweetalert2";
import "./Product.css";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from "react-bootstrap-table2-editor"
import { AvForm, AvField, AvRadioGroup, AvRadio } from "availity-reactstrap-validation";
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
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from "draft-js";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { set, uniqueId } from "lodash";
import TagsInput from "react-tagsinput";
import Select from "react-select";

const AddProduct = (props) => {


  const refContainer = useRef(null);
  const refNewCategoryForm = useRef(null);
  const refNewSubCategoryForm = useRef(null);
  const refSupplierDetailForm = useRef(null);
  const refVariantDetailForm = useRef(null);
  const refPackageDimensionsDetails = useRef(null);
  const [supplierDetails, setsupplierDetails] = useState([]);
  const [activeAccordian, setactiveAccordian] = useState(null)
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [descriptions, setDescriptions] = useState(EditorState.createEmpty());
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [newSubCategories, setnewSubCategories] = useState([]);
  const [supplierModal, setsupplierModal] = useState(false);
  const [rows, setrows] = useState([]);
  const [newSubCategoryModal, setNewSubCategoryModal] = useState(false);
  const [newCategoryModal, setNewCategoryModal] = useState();
  const [variantModal, setvariantModal] = useState(false);
  const [variantsDetail, setvariantsDetail] = useState([]);
  const [suppliersDetail, setsuppliersDetail] = useState([]);
  const [variantImagesUrls, setvariantImagesUrls] = useState([]);
  const [selectedVariantFileImages, setselectedVariantFileImages] = useState([]);
  const [selectedVariant, setselectedVariant] = useState({});
  const [selectedSupplier, setselectedSupplier] = useState({});
  const [isEdit, setisEdit] = useState(false)

  const Variantcolumns = [{
    dataField: 'id',
    text: 'ID',
    hidden: true
  }, {
    dataField: 'variantColor',
    text: 'Color'
  }, {
    dataField: 'variantSize',
    text: 'Size'
  }, {
    dataField: 'weight',
    text: 'Weight'
  }, {
    dataField: 'variantPrice',
    text: 'Mrp'
  },

    // {
    //   dataField: 'is_online',
    //   text: 'Is online'
    // }
    , {
    text: props.t("Action"),
    headerStyle: (colum, colIndex) => {
      return { width: "10%" };
    },
    formatter: (cell, row) => {

      return (<Row>
        <Col lg={6}>
          <span className="text-info">
            <i
              className="bx bxs-trash font-size-15"
              title="Click to Delete"
              style={{ cursor: "pointer" }}
              onClick={() => {
                // setselectedVariant(row)
                // setvariantImagesUrls(row.variantImgUrl)
                deleteVariantDetails(row)
              }}
            ></i>
          </span>
        </Col>
        <Col lg={6}>
          <span className="text-info">
            <i
              className="bx bxs-edit font-size-15"
              title="Click to Edit"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setselectedVariant(row)
                setvariantImagesUrls(row.variantImgUrl)
                setvariantModal(true)
              }}
            ></i>
          </span>
        </Col>
      </Row>
      );
    },
  }
  ];

  const packageDetailColumns = [
    {
      dataField: "name",
      text: "Name"
    },
    {
      dataField: "Dimensions",
      text: "Dimensions"
    },
    {
      dataField: "Weight",
      text: "Weight"
    },
    {
      text: props.t("Action"),
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
      formatter: (cell, row) => {
        return (
          <span className="text-info">
            <i
              className="bx bxs-edit font-size-15"
              title="Click to Edit"
              style={{ cursor: "pointer" }}
              onClick={() => {
                console.log(row)
                if (row.name && row.Weight && row.Dimensions) {
                  // EditorState.createWithContent(
                  //   convertFromRaw(row.name)
                  // )
                  EditorState.createWithContent(
                    convertFromRaw(row.Dimensions)
                  )
                  EditorState.createWithContent(
                    convertFromRaw(row.Weight)
                  )
                } else {
                  EditorState.createEmpty();
                }
              }}
            ></i>
          </span>
        );
      },
    },

  ];
  const SupplierColumn = [{
    dataField: 'supplierId',
    text: 'supplierId',
    hidden: true
  }, {
    text: 'Supplier',
    formatter: (cell, row) => {
      let x = allSuppliers ? allSuppliers.find((ele) => ele._id == row?.supplierId) : null;
      if (x && x.company_name) return (
        x.company_name
      )
    }
  }, {
    dataField: 'Brand',
    text: 'Brand'
  }, {
    dataField: 'cost',
    text: 'Cost'
  }, {
    text: 'No Of Packages',
    formatter: (cell, row) => {
      let x = supplierDetails ? supplierDetails.find((ele) => ele.supplierId == row?.supplierId) : null;
      console.log(x)
      if (x && x.packageDimensionsDetails) return (
        x.packageDimensionsDetails.length
      )
    }

  },
  {
    text: props.t("Action"),
    headerStyle: (colum, colIndex) => {
      return { width: "10%" };
    },
    formatter: (cell, row) => {

      return (<Row>
        <Col lg={6}>
          <span className="text-info">
            <i
              className="bx bxs-trash font-size-15"
              title="Click to Delete"
              style={{ cursor: "pointer" }}
              onClick={() => {
                // setselectedSupplier(row)
                // setvariantImagesUrls(row.variantImgUrl)
                deleteSupplierDetails(row.supplierId)
              }}
            ></i>
          </span>
        </Col>
        <Col lg={6}>
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
        </Col>
      </Row>
      );
    },
  }
  ];

  useLayoutEffect(() => {
    loadAllCategories();
    loadAllSuppliers();
    loadAllOffers();
  },
    []);

  const deleteVariantDetails = (varinatObj) => {
    if (varinatObj) {
      let updatedValues = variantsDetail.filter(ele => ele !== varinatObj);
      setvariantsDetail(updatedValues)
    }

  }
  const deleteSupplierDetails = (id) => {
    if (id) {
      let updatedValues = suppliersDetail.filter(ele => ele.supplierId !== id);
      setsuppliersDetail(updatedValues)
    }

  }
  function preloader(status) {
    if (status) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  }
  const showNotification = (message, type) => {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }
  const loadAllSuppliers = async () => {
    let url = process.env.REACT_APP_BASEURL + "suppliers/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllSuppliers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  const [allOffers, setAllOffers] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState();

  const loadAllOffers = async () => {
    let url = process.env.REACT_APP_BASEURL + "offers/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      setAllOffers(response.data);
    } else {
      showNotification(response.message, "Error");
    }
  };
  const loadAllCategories = async () => {
    let url = process.env.REACT_APP_BASEURL + "productcategory/getall";
    let response = await postSubmitForm(url, "");
    if (response.status === 1) {
      // console.log("Category", response.data)
      setAllCategories(response.data);
      let category = response.data && selectedCategory ? response.data.find(ele => ele.category == selectedCategory?.category) : false;
      if (category) {
        setAllSubCategories(category?.sub_category || [])
      }


    } else {
      showNotification(response.message, "Error");

    }
  };
  const handleAddRow = () => {
    const item = {
    }
    setrows([...rows, item])
    console.log(rows)
  }
  const handleRemoveRow = (e, idx) => {
    // if (idx === "01") {
    //   document.getElementById("addr" + idx).style.display = "block"
    // } else
    console.log(rows, idx)
    let values = [...rows]
    if (typeof idx != "undefined") {
      // document.getElementById("addr" + idx).style.display = "none"
      // console.log(elements.splice(idx,1))
      values.splice(idx, 1)
      setrows([...values]);
    }

  }
  const handleAddNewSubCategory = async (e, v) => {
    console.log(v)
    try {
      const object = {
        id: selectedCategory._id,
        category: selectedCategory.category
      };
      let url = process.env.REACT_APP_BASEURL + "productcategories/update";
      object['sub_category'] = [...allSubCategories, v.sub_category]
      // console.log(url, object);
      let response = await postSubmitForm(url, object);
      if (response.status === 1) {
        loadAllCategories();
        setSelectedSubCategory(v.sub_category);
        setNewSubCategoryModal(!newSubCategoryModal);
        refNewSubCategoryForm.current.reset();

      } else {
        showNotification(response.message, "Error");
      }
    } catch (error) {
      console.log(error)
      showNotification(error.message, "Error");
    }
  };
  const handleAddNewCategory = async (e, v) => {
    try {
      const object = {
        category: v.name,
        sub_category: newSubCategories,
      };
      // object['sub_category'] = []
      let url = process.env.REACT_APP_BASEURL + "productcategories/insert";
      console.log(url, object);
      let response = await postSubmitForm(url, object);
      if (response.status === 1) {
        console.log(response)
        setSelectedCategory(response.data);
        setAllSubCategories(response.data.sub_category);
        loadAllCategories();
        // let category = allCategories.find(ele => ele.category == v.name)
        // if (category) 
        setNewCategoryModal(!newCategoryModal);
        refNewCategoryForm.current.reset();
      } else {
        showNotification(response.message, "Error");
      }
    } catch (error) {
      showNotification(error.message, "Error");
    }
  };
  const handleValidSubmit = async (e, v) => {
    try {
     
      let url = process.env.REACT_APP_BASEURL + "products/insert";
     
    
        let response = await postSubmitForm(url, v);
        if (response.status === 1) {
         
          showNotification(response.message, "Success");
          refContainer.current.reset();

        
      }
      else {
        showNotification('Atleast One Variant Required', "Info");
      }
    } catch (error) {
      showNotification(error.message, "Error");
    }
  };
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  const handleAcceptedFilesImages = async (files, isvariant = false) => {

    console.log(files, "khh");

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
      let url = process.env.REACT_APP_BASEURL + "products/upload_document";
      let formData = new FormData();
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
    preloader(true)
    let url = process.env.REACT_APP_BASEURL + "products/delete-image";
    let response = await postSubmitForm(url, { imageUrl: imageUrl });
    if (response) {
      // console.log(response)
      images = images.filter((ele) => ele !== imageUrl);
      showNotification(response, "Success");
      setvariantImagesUrls(images);
      preloader(false)
    }
    console.log('removed', imageUrl);
  }
  function toggleAccordian(key) {
    if (key && key == activeAccordian) {
      setactiveAccordian(null)
    } else {
      setactiveAccordian(key)
    }

  }
  const SupplierAccordian = ({ SupplierPackageDetail, columns }) => {
    const deleteSupplier = (id) => {
      SupplierPackageDetail = SupplierPackageDetail.filter(ele => ele._id != id);
      setsupplierDetails(SupplierPackageDetail)
    }
    return SupplierPackageDetail.map((ele, idx) => {
      return (<div className="mb-3" key={ele?.supplierId} style={{
        border: '0.5px solid wheat',
        borderStyle: 'dashed',
        padding: '12px'
      }}>
        <Row>
          <Col lg={3}>
            <AvField
              name="supplier_id"
              label={props.t("Supplier") + " *"}
              type="select"
              required
              errorMessage={props.t(
                "Supplier cannot be empty"
              )}
              value={ele.supplierId}
            >
              <option value="">
                {props.t("--Select Supplier--")}
              </option>
              {allSuppliers &&
                allSuppliers.map((supplier) => {
                  return (
                    <option key={supplier.value} value={supplier.value}>
                      {supplier.label}
                    </option>
                  );
                })}
            </AvField>
          </Col>
          <Col lg={3}>
            <AvField
              name="Brand"
              label={
                props.t("Brand") + " *"
              }
              placeholder={props.t(
                "Enter Brand"
              )}
              value={
                ele &&
                ele.Brand
              }
              type="text"
              validate={{
                required: { value: true },
              }}
              errorMessage={props.t(
                "Brand cannot be empty"
              )}
            />
          </Col>
          <Col lg={3}>
            <AvField
              name="cost"
              label={
                props.t("Cost") + " *"
              }
              placeholder={props.t(
                "Enter Cost"
              )}
              value={
                ele &&
                ele.cost
              }
              type="text"

            />
          </Col>
          <Col lg={3}>
            <Row>
              <Col lg={8} style={{ marginTop: 'auto', textAlign: 'center' }}>
                <i
                  className={"bx bx-trash"}
                  onClick={() => {
                    deleteSupplier(ele._id)
                  }}
                  style={{ fontSize: "23px" }}
                />
              </Col>
              <Col lg={4} style={{ marginTop: '26px' }}>
                <i
                  className={
                    activeAccordian && activeAccordian == `${ele.supplierId + idx}`
                      ? "mdi  mdi-chevron-up "
                      : "mdi  mdi-chevron-down "
                  }
                  onClick={() => {
                    toggleAccordian(`${ele.supplierId + idx}`)
                  }}
                  style={{ fontSize: "23px" }}
                />
              </Col>
            </Row>

          </Col>
        </Row>
        {/* package detail grid */}
        <Collapse isOpen={activeAccordian && activeAccordian == `${ele.supplierId + idx}`}>
          <CardBody>
            <div className="table-responsive">
              <BootstrapTable
                keyField="name"
                data={ele.packageDimensionsDetails}
                columns={packageDetailColumns}
                cellEdit={cellEditFactory({})}
                striped
                condensed
              />
            </div>
          </CardBody>
        </Collapse>
      </div>)
    });
  }
  const addVariantInfo = (e, v) => {


    const {
      variantColor,
      variantPrice,
      variantSize,
      weight,
      select_weight,
      assembly_charges,
      cost,
      is_online,
      offer
    } = v;

    console.log(variantImagesUrls, "image");

    if (variantImagesUrls && variantImagesUrls.length <= 0) {

      showNotification("Please insert atleast one image.", "Error");
    }
  else  if (supplierDetails && supplierDetails.length <= 0) {

      showNotification("Please insert atleast one Supplier.", "Error");
    }
    else{

      let variantPayload = {
        variantColor: variantColor,
        variantPrice: variantPrice,
        variantSize: variantSize,
        weight: weight + " " + select_weight,
        cost: cost,
        is_online: is_online,
        offer: selectedOffers,
        assembly_charges: assembly_charges,
        supplier_details: supplierDetails,
        variantImgUrl: variantImagesUrls || [],
        // offer: selectedOffers
      }
      console.log(variantPayload)
      setvariantsDetail([...variantsDetail, variantPayload]);
      console.log(variantsDetail);
      setvariantModal(false)
}


  }
  const addSupplierPackageInfo = (e, v) => {
    const { supplierId,
      Brand,

      cost,
    } = v;
    console.log(rows)
    if (isEdit) {
      let detail = supplierDetails.map((ele, idx) => {
        if (ele && typeof ele === 'object' && ele?.supplierId === supplierId) {
          let updatedfield = {
            ...ele
          }
          updatedfield['packageDimensionsDetails'] = rows;
          updatedfield['cost'] = cost;
          updatedfield['Brand'] = Brand;
          return updatedfield;
        }
      })
      setsupplierDetails(detail)
      setsupplierModal(false)
      setrows([]);
    }
    else {
      let alreadyExist = supplierDetails && supplierDetails.length ? supplierDetails.filter(ele => ele.supplierId === supplierId) : false
      if (alreadyExist && alreadyExist.length) {
        showNotification('Supplier Already Exist', 'info')
        return;
      }
      let supplierDetailsPayload = {
        supplierId: supplierId,
       Brand:Brand,
        cost: cost,
        packageDimensionsDetails: []
      }
      if (rows && rows?.length) {
        supplierDetailsPayload['packageDimensionsDetails'] = selectedSupplier && Object.keys(selectedSupplier).length ? [... new Set([...selectedSupplier['packageDimensionsDetails'], ...rows])] : rows;
      }
      setsupplierDetails([...supplierDetails, supplierDetailsPayload])
      setsupplierModal(!supplierModal)
      setrows([]);
    }
    setisEdit(false);
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={props.t("Products")}
            breadcrumbItem={props.t("Add Products")}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm
                    onValidSubmit={handleValidSubmit}
                    ref={refContainer}
                  >
                    <CardTitle>{props.t("Add Products")}</CardTitle>
                    <CardSubtitle className="mb-3">
                      {props.t(
                        "Enter the following details to add a new product"
                      )}
                    </CardSubtitle>
                    <Row>
                      <Col lg={6}>
                       
                         
                            <AvField
                              name="name"
                              label={props.t("Name") + " *"}
                              placeholder={props.t("Enter Item Name")}
                              type="text"
                              validate={{ required: { value: true } }}
                              errorMessage={props.t("Name cannot be empty")}
                            />
                     
                     </Col>
                     <Col lg={6}>
                                    <AvField
                                      name="brand"
                                      label={props.t("Brand") + " *"}
                                  
                                      placeholder={props.t("Enter Brand")}
                                      type="text"
                                      validate={{ required: { value: true } }}
                                      errorMessage={props.t(
                                        "Brand cannot be empty"
                                      )}
                                    />
                                  </Col>

                           
                              <Col lg={4}>
                                <AvField
                                  name="category"
                                  label={props.t("Category") + " *"}
                                  type="select"
                                  value={selectedCategory?.name}
                                  validate={{ required: { value: true } }}
                                  errorMessage={props.t(
                                    "Category cannot be empty"
                                  )}
                                  onChange={(e) => {
                                    let category = allCategories.find(ele => ele.name == e.target.value)
                                    console.log(category)
                                    if (category) {
                                      setSelectedCategory(category);
                                      setAllSubCategories(category.sub_category || []);
                                    } else {
                                      setSelectedCategory();
                                      setAllSubCategories([]);
                                    }

                                  }}
                                >
                                  <option value="">
                                    {props.t("--Select Category--")}
                                  </option>
                                  {allCategories &&
                                    allCategories.map((category, idx) => {
                                      return (
                                        <option key={category.name} value={category.name}>
                                          {category.name}
                                        </option>
                                      );
                                    })}
                                </AvField>
                              </Col>

                              <Col lg={2}>
                                <Label>&nbsp;</Label>
                                <br />
                                <Button
                                  //to={''}
                                  className="btn btn-success waves-effect waves-light btn-sm"
                                  onClick={() => {
                                    setNewCategoryModal(!newCategoryModal);
                                  }}
                                  style={{ minHeight: '35px' }}
                                >
                                  <i className="mdi mdi-plus"></i>{" "}
                                  {props.t("Add New")}
                                </Button>
                              </Col>
                            
                              <Col lg={6}>
                                    <AvField
                                      name="color"
                                      label={props.t("Color") + " *"}
                                  
                                      placeholder={props.t("Enter Color")}
                                      type="text"
                                      validate={{ required: { value: true } }}
                                      errorMessage={props.t(
                                        ""
                                      )}
                                    />
                                  </Col>
                         

                          
                          <Col lg={6} className="" >
                            <AvField
                               name="image_url"
                              label={props.t("Image")}
                              placeholder={props.t("Image url")}
                              type="text"
                              validate={{ required: { value: true } }}
                              errorMessage={props.t(
                                "Image url cannot be empty"
                              )}
                            />
                          </Col>
                       
                        

                      <Col lg={6}>
                            <AvField
                              name="price"
                              label={props.t("Price") + " *"}
                              placeholder={props.t("Enter Price")}
                              type="number"
                              validate={{ required: { value: true } }}
                              errorMessage={props.t("Price cannot be empty")}
                            />
                         
                      </Col>
                      <Col lg={6} className="" >
                            <AvField
                             name="description"
                              label={props.t("Descriptions")}
                              placeholder={props.t("Descriptions")}
                              type="textarea"
                            />
                          </Col>
                      
                          <Col lg={6} className="mt-2 mb-2">
                            <AvField

                              name="is_online"
                              label={props.t("Is Online")}
                              type="checkbox"
                            />
                          
                      </Col>

                      
                          


                          
                      {/* <Col lg={12}>
                        <label>Descriptions</label>
                        <Editor
                          wrapperClassName="wrapper-class"
                          editorClassName="editor-class"
                          toolbarClassName="toolbar-class"
                          editorState={descriptions}
                          onEditorStateChange={(e) => {
                            setDescriptions(e);
                          }}
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "list",
                              "link",
                              "emoji",
                              "image",
                              "remove",
                              "history",
                            ],
                            inline: {
                              options: [
                                "bold",
                                "italic",
                                "underline",
                                "strikethrough",
                              ],
                            },
                          }}
                        />
                      </Col> */}
                    </Row>
                    {/* Varinat Details section Start */}
                    {/* <Row>
                      <Col lg={12}>
                        <Row className="pb-3">
                          <Col lg={12}>
                            <hr />
                            <CardTitle className="p-1">{props.t("Add Variants")}</CardTitle>
                            <button
                              slot="end"
                              type="button"
                              color="primary"
                              className="btn btn-success"
                              onClick={() => {
                                setselectedVariant([])
                                setvariantImagesUrls([])
                                setSelectedOffers([]);
                                setvariantModal(!variantModal);
                              }}
                            >
                              <i className="bx bx-plus  font-size-16 align-middle me-2"></i>{" "}
                              Add Variants
                            </button>
                          </Col>
                          <Col className="mt-2 pb-2" lg={12}>
                            <div className="table-responsive">
                              <BootstrapTable
                                keyField="_id"
                                data={variantsDetail}
                                columns={Variantcolumns}
                                cellEdit={cellEditFactory({})}
                                striped
                                condensed
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row> */}
                    {/* Varinat Details section End*/}
                    <Row>
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
                  {/* Supplier info modal start */}
                  <Modal
                    size="lg"
                    isOpen={supplierModal}
                    toggle={() => setsupplierModal(!supplierModal)}>
                    <ModalHeader>
                      Add Supplier
                    </ModalHeader>
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
                                model={rows}
                              >
                                <Row>
                                  <Col lg={6}>
                                    <AvField
                                      disabled={isEdit}
                                      name="supplierId"
                                      label={props.t("Supplier") + " *"}
                                      type="select"
                                      value={selectedSupplier && selectedSupplier.supplierId || ''}
                                      required
                                      errorMessage={props.t(
                                        "Supplier cannot be empty"
                                      )}
                                    >
                                      <option value="">
                                        {props.t("--Select Supplier--")}
                                      </option>
                                      {allSuppliers &&
                                        allSuppliers.map((supplier) => {
                                          return (
                                            <option key={supplier.value} value={supplier.value}>
                                              {supplier.label}
                                            </option>
                                          );
                                        })}
                                    </AvField>
                                  </Col>
                                  
                                  <Col lg={6}>
                                    <AvField
                                      name="cost"
                                      label={
                                        props.t("Cost") + " *"
                                      }
                                      value={selectedSupplier && selectedSupplier.cost || ''}
                                      placeholder={props.t(
                                        "Enter Cost"
                                      )}
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
                                      type="text"

                                    />
                                  </Col>
                                  <Col md={12} lg={12}>
                                    <Card>
                                      <CardBody>
                                        <CardTitle className="mb-4">Package dimensions details</CardTitle>
                                        <table style={{ width: "100%" }}>
                                          <tbody>
                                            {rows && rows.length ? rows.map((item, idx) => (
                                              <tr id={"addr" + idx} ref={refPackageDimensionsDetails} key={idx}>
                                                <td >
                                                  <Row data-repeater-item>
                                                    <Col lg="3" className="mb-3">
                                                      <AvField
                                                        name={`Name${idx + 1}`}
                                                        label={`Name ${idx + 1}`}
                                                        placeholder={props.t("Enter Name")}
                                                        type="text"

                                                        //validate={{ required: { value: true } }}
                                                        errorMessage={props.t(
                                                          "Name cannot be empty"
                                                        )}
                                                        onChange={(e) => { item.name = e.target.value }}
                                                        value={item.name || ''}
                                                      />
                                                    </Col>

                                                    <Col lg="4" className="mt-3">
                                                      <AvField
                                                        name="Dimensions"
                                                        label={"Dimensions"}
                                                        placeholder={props.t("Dimensions")}
                                                        type="text"

                                                        //validate={{ required: { value: true } }}
                                                        errorMessage={props.t(
                                                          "Dimensions cannot be empty"
                                                        )}
                                                        onChange={(e) => { item.Dimensions = e.target.value }}
                                                        value={item.Dimensions || ''}
                                                      />
                                                    </Col>

                                                    {/* <Col lg="3" className="mb-3">
                                                      <AvField
                                                        name="Weight"
                                                        label={"Weight"}
                                                        placeholder={props.t("Enter Weight")}
                                                        type="Number"

                                                        // validate={{ required: { value: true } }}
                                                        errorMessage={props.t(
                                                          "Weight cannot be empty"
                                                        )}
                                                        onChange={(e) => { item.Weight = e.target.value }}
                                                        value={item.Weight || ''}

                                                      />
                                                    </Col> */}

                                                    <Col
                                                      lg="2"
                                                      className="form-group align-self-center"
                                                    >
                                                      <Button
                                                        onClick={e =>
                                                          handleRemoveRow(e, idx)
                                                        }
                                                        color="danger"
                                                        className="mt-3"
                                                        style={{ width: "100%" }}
                                                      >
                                                        Delete
                                                      </Button>
                                                    </Col>
                                                  </Row>
                                                </td>
                                              </tr>
                                            )) : null}
                                          </tbody>
                                        </table>
                                        <Button onClick={handleAddRow} color="success" className="mt-3 mt-lg-0">
                                          Add
                                        </Button>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                  <Col lg={12}>
                                    <hr />
                                    <Button
                                      color="primary"
                                      className="mr-1"
                                      slot="start"
                                    // onClick={()=>addSupplierPackageInfo()}
                                    >
                                      {props.t("Save")}
                                    </Button>
                                    <Button
                                      color="danger"
                                      slot="end"
                                      className="mr-1 ml-1"
                                      onClick={() => setsupplierModal(!supplierModal)}
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
                  {/* Supplier info modal End */}
                  {/* Add Category Modal Start */}
                  <Modal
                    size="md"
                    isOpen={newCategoryModal}
                    toggle={() => setNewCategoryModal(!newCategoryModal)}
                  >
                    <ModalHeader
                      toggle={() => setNewCategoryModal(!newCategoryModal)}
                    >
                      {props.t("Add new category")}
                    </ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col lg={12}>
                          <Card>
                            <CardBody>
                              <AvForm
                                onValidSubmit={(e, v) => {
                                  handleAddNewCategory(e, v);
                                }}
                                ref={refNewCategoryForm}
                              >
                                <Row>
                                  <Col lg={12}>
                                    <AvField
                                      name="name"
                                      label={props.t("Category")}
                                      placeholder={props.t(
                                        "Enter Category Name"
                                      )}
                                      type="text"
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage: props.t(
                                            "Name cannot be empty"
                                          ),
                                        },
                                      }}
                                    />
                                  </Col>
                                  <Col lg={12}>
                                    <Label>
                                      {props.t("Sub-Category")}
                                    </Label>
                                    {`(${props.t("Press Enter/Tab to save")})`}
                                    <TagsInput
                                      value={newSubCategories}
                                      onChange={(tags) => { setnewSubCategories(tags) }}
                                      onlyUnique={true}
                                      inputProps={{
                                        className: "react-taginput-input",
                                        placeholder: props.t("Add ..."),
                                      }}
                                    />
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
                                          {props.t("Add")}
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
                    </ModalBody>
                  </Modal>
                  {/* Add Category Modal End */}

                  {/* Add Sub Category Modal Start */}
                  <Modal
                    size="md"
                    isOpen={newSubCategoryModal}
                    toggle={() => setNewSubCategoryModal(!newSubCategoryModal)}
                  >
                    <ModalHeader
                      toggle={() => setNewSubCategoryModal(!newSubCategoryModal)}
                    >
                      {props.t(`Add new category (${selectedCategory?.category})`)}
                    </ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col lg={12}>
                          <Card>
                            <CardBody>
                              <AvForm
                                onValidSubmit={(e, v) => {
                                  handleAddNewSubCategory(e, v);
                                }}
                                ref={refNewSubCategoryForm}
                              >
                                <Row>
                                  <Col lg={12}>

                                    <AvField
                                      name="sub_category"
                                      label={props.t("Sub Category")}
                                      placeholder={props.t(
                                        "Enter Sub Category Name"
                                      )}
                                      type="text"
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage: props.t(
                                            "Sub Category be empty"
                                          ),
                                        },
                                      }}
                                    />
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
                                          {props.t("Add")}
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
                    </ModalBody>
                  </Modal>
                  {/* Add Sub Category Modal End */}

                  {/* Variant Info Modal Start*/}
                  <Modal
                    size="lg"
                    isOpen={variantModal}
                    toggle={() => setvariantModal(!variantModal)}>
                    <ModalHeader>
                      Add Variant
                    </ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col lg={12}>
                          <Card>
                            <CardBody>
                              <AvForm
                                onValidSubmit={(e, v) => {
                                  addVariantInfo(e, v);
                                }}
                                ref={refVariantDetailForm}
                              >
                                <Row>
                                  <Col md={6} lg={6}>
                                    <AvField
                                      name="variantColor"
                                      label={props.t("Color") + " *"}
                                      placeholder={props.t("Enter Variant Color")}
                                      type="text"
                                      validate={{ required: { value: true } }}
                                      errorMessage={props.t(
                                        "Variant Color cannot be empty"
                                      )}
                                      value={selectedVariant.variantColor}
                                    />
                                  </Col>
                                  <Col md={6} lg={6} >
                                    <AvField
                                      name="variantSize"
                                      label={props.t("Size") + " *"}
                                      placeholder={props.t("Enter Variant Size")}
                                      type="text"
                                      // validate={{ required: { value: true } }}
                                      // errorMessage={props.t(
                                      //   "Variant Size cannot be empty"
                                      // )}
                                      value={selectedVariant.variantSize}
                                    />
                                  </Col>

                                  <Col md={6} lg={6}>
                                    <AvField
                                      name="variantPrice"
                                      label={props.t("Mrp") + " *"}
                                      placeholder={props.t("Enter Variant Price")}
                                      type="text"

                                      validate={{
                                        required: {
                                          errorMessage: props.t("Variant Price cannot be empty"),
                                        },
                                        pattern: {
                                          value: "^[0-9]*$",
                                          errorMessage: props.t(
                                            "Only Positive numbers all allowed."
                                          ),
                                        },
                                      }}


                                      errorMessage={props.t(
                                        "Variant Price cannot be empty"
                                      )}
                                      value={selectedVariant.variantPrice}
                                    />
                                  </Col>


                                  <Col md={6} lg={6}>
                                    <AvField
                                      name="assembly_charges"
                                      label={props.t("Assembly Charges (if any)")}
                                      placeholder={props.t("Enter assembly charges")}
                                      type="text"
                                      validate={{

                                        pattern: {
                                          value: "^[0-9]*$",
                                          errorMessage: props.t(
                                            "Only Positive numbers all allowed."
                                          ),
                                        },
                                      }}
                                      value={selectedVariant.assembly_charges}
                                    />
                                  </Col>



                                  <Col md={6} lg={6}>
                                    <AvField
                                      name="weight"
                                      label={props.t("Weight *")}
                                      placeholder={props.t("Enter weight")}
                                      type="number"
                                      validate={{
                                        required: {
                                          value: true, errorMessage: props.t(
                                            "Variant weight cannot be empty"
                                          ),
                                        },
                                        pattern: {
                                          value: "^[0-9]*$",
                                          errorMessage: props.t(
                                            "Only Positive numbers all allowed."
                                          ),
                                        },
                                      }}
                                      value={selectedVariant.weight}
                                    />
                                  </Col>





                                  <Col lg={6}>

                                    <AvField
                                      name="select_weight"
                                      label={props.t("Select") + " *"}
                                      // value={selectedOrder && selectedOrder.status}
                                      type="select"

                                      validate={{ required: { value: true } }}
                                      errorMessage={props.t("Select")}

                                    >
                                      <option value="">
                                        -- {props.t("Select One")} --
                                      </option>

                                      <option value="kg">
                                        {props.t("Kg")}
                                      </option>
                                      <option value="lbs">
                                        {props.t("Lbs")}
                                      </option>


                                    </AvField>
                                  </Col>




                                  <Col lg={6}>
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
                                  </Col>
                                  {/* <Col md={6} lg={6} >
                                    <AvField

                                      name="is_online"
                                      label={props.t("Publish")}
                                      type="checkbox"
                                      value={selectedVariant.is_online}
                                    />
                                  </Col> */}
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
                                            <h3>{props.t("Product Variant Image")}</h3>
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
                                  {/* <Col lg={12}>
                                    <CardTitle className="p-1">{props.t("Add Suppliers")}</CardTitle>
                                    <button
                                      slot="end"
                                      type="button"
                                      color="primary"
                                      className="btn btn-success"
                                      onClick={() => {
                                        setselectedSupplier()
                                        setrows([])
                                        setsupplierModal(!supplierModal);
                                      }}
                                    >
                                      <i className="bx bx-plus  font-size-16 align-middle me-2"></i>{" "}
                                      Add Suppliers
                                    </button>
                                  </Col> */}
                                  <Col className="mt-2 pb-2" lg={12}>
                                    <div className="table-responsive">
                                      <BootstrapTable
                                        keyField="supplierId"
                                        data={supplierDetails}
                                        columns={SupplierColumn}
                                        cellEdit={cellEditFactory({})}
                                        striped
                                        condensed
                                      />
                                    </div>
                                  </Col>
                                  <Col lg={12} style={{ textAlign: 'center' }}>
                                    <hr />
                                    <Button
                                      color="primary"
                                      className="mr-1"
                                    // onClick={()=>addSupplierPackageInfo()}
                                    >
                                      {props.t("Save")}
                                    </Button>
                                    <Button
                                      color="danger"

                                      className="mr-1 ml-1"
                                      onClick={() => setvariantModal(!variantModal)}
                                    >
                                      {props.t("cancel")}
                                    </Button>
                                  </Col>
                                </Row>
                                <Row>
                                </Row>
                              </AvForm>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </ModalBody>
                  </Modal>
                  {/* Variant Info Modal End */}
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(connect(null, {})(withNamespaces()(AddProduct)));
