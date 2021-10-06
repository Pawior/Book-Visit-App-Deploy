import React, { useState, useEffect, useLayoutEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
const Orders = () => {
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
  return <div>To jest strona orders</div>;
};

export default Orders;
