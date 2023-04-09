import React from "react";
//i18n
import { withNamespaces } from "react-i18next";
import { Row, Col, Card } from "reactstrap";

import profileImg from "../../assets/images/profile-img.png";

const WelcomeComp = (props) => {
  const role = localStorage.getItem("role");
  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-soft-primary">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary">
                  {props.t("Welcome")} {props.t(localStorage.getItem("name"))}
                </h5>
                <p>{props.t("Ecom")}</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </div>
      </Card>
    </React.Fragment>
  );
};
export default withNamespaces()(WelcomeComp);
