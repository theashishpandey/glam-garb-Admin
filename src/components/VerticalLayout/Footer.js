import React from "react";
import { Container, Row, Col } from "reactstrap";
//i18n
import { withNamespaces } from "react-i18next";

const Footer = (props) => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>
              {new Date().getFullYear()} ©{" "}
              {props.t("Ecom")}
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default withNamespaces()(Footer);
