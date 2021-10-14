import React, { useState, useEffect } from "react";
import "./App.css";
import Orders from "./orders/Orders";
import LoginContainer from "./auth/LoginContainter";
import AddOrder from "./orders/AddOrder";
import MyOrders from "./orders/MyOrders";
import OrderDetail from './orders/OrderDetail'
import { UserContext } from "../contexts/UserContext";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/login" component={LoginContainer}></Route>
          <Route path="/orders" component={Orders}></Route>
          <Route path="/order/:orderId" component={OrderDetail}></Route>
          <Route path="/myorders/:workerId" component={MyOrders}></Route>
          <Route path="/addorder" component={AddOrder}></Route>
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App;