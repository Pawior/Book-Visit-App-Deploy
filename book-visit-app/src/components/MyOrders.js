import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Redirect } from "react-router-dom";
import Order from "./elements/Order";

const MyOrders = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const ordersCollectionRef = collection(db, "orders");
  useEffect(() => {
    const getOrders = async () => {
      const data = await getDocs(ordersCollectionRef);
      setOrders(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getOrders();
    console.clear();
  }, []);

  useLayoutEffect(() => {
    console.log(orders);
  });

  if (!user) {
    return <Redirect to="/login" />;
  } else {
    let orderListLen = 0;
    const orderList = orders.map((order) => {
      console.log(props.location.state.workerId);
      console.log(order.workerId);
      if (order.workerId === props.location.state.workerId) {
        orderListLen++;
        return (
          <Order
            title={order.name}
            content={order.description}
            clientId={order.clientId}
            workerId={order.workerId}
            date={order.date}
            id={order.id}
            key={order.id}
          />
        );
      }
    });
    console.log(orderListLen);
    return orderListLen ? (
      <div>{orderList}</div>
    ) : (
      <div>All orders are done!</div>
    );
    // return <div>{orderList}</div>;
  }
};

export default MyOrders;
