import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Login from "./Login";


const LoginContainer = () => {

  return (
    <div>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="w-100" style={{ maxWidth: "500px" }}>
          <Login> </Login>
        </div>
      </Container>
    </div>
  );
};

export default LoginContainer;
