import React from "react";
import { Container } from "react-bootstrap";
import Signup from "./Signup";

const SignupContainter = () => {
  return (
    <div>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Signup> </Signup>
        </div>
      </Container>
    </div>
  );
};

export default SignupContainter;
