import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";

const BreadCrumb_2Items = (props) => {
  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">
            {props.alternateTitle ? props.alternateTitle : props.title}
          </h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem>
                <Link to="#">{props.title}</Link>
              </BreadcrumbItem>
              {props.breadcrumbItem2 ? (
                <BreadcrumbItem>
                  <Link to="#">{props.breadcrumbItem1}</Link>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem active>
                  <Link to="#">{props.breadcrumbItem1}</Link>
                </BreadcrumbItem>
              )}
              {props.breadcrumbItem2 && (
                <BreadcrumbItem active>
                  <Link to="#">{props.breadcrumbItem2}</Link>
                </BreadcrumbItem>
              )}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default BreadCrumb_2Items;
