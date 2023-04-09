import React from "react";
import { Container, Row, Col, CardTitle } from "reactstrap";

// Pages Components
import WelcomeComp from "./WelcomeComp";

//i18n
import { withNamespaces } from "react-i18next";

const Dashboard = (props) => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <CardTitle>{props.t("DASHBOARD")}</CardTitle>
          <Row>
            <Col xl="4">
              <WelcomeComp />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withNamespaces()(Dashboard);
