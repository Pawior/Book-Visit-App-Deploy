import React, { useState, useEffect } from "react";
import "./App.css";
import Orders from "./Orders";
import SignupContainer from "./SignupContainter";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route path="/signup" component={SignupContainer}></Route>
        <Route path="/orders" component={Orders}></Route>
      </Switch>
    </Router>
  );
}

export default App;
