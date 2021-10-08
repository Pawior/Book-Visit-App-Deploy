import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Redirect } from "react-router-dom";
import Order from "./elements/Order";

const Orders = () => {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const ordersCollectionRef = collection(db, "orders");
  useEffect(() => {
    const getOrders = async () => {
      const data = await getDocs(ordersCollectionRef);
      setOrders(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getOrders();
  }, []);

  useLayoutEffect(() => {
    console.log(orders);
  });

  if (user) {
    const orderList = orders.map((order) => {
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
    });
  } else {
    return <Redirect to="/login" />;
  }

  const orderList = orders.map((order) => {
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
  });

  return <div>{orderList}</div>;
};

export default Orders;
