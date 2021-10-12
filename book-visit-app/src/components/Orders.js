import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Redirect, useHistory } from "react-router-dom";
import Order from "./elements/Order";
import Button from "react-bootstrap/Button";

const Orders = () => {
  const { user, setUser } = useContext(UserContext);
  const userLogged = localStorage.getItem("logged");
  const [orders, setOrders] = useState([]);
  const history = useHistory();
  const ordersCollectionRef = collection(db, "orders");
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);
  useEffect(() => {
    const getOrders = async () => {
      const data = await getDocs(ordersCollectionRef);
      setOrders(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getOrders();
  }, []);
  const updateOrderWorker = async (user, orderId) => {
    console.log("Przesyłanei funkcji " + user.id);
    console.log(user);
    console.log(orderId);
    const orderDoc = doc(db, "orders", orderId);
    const newFields = { workerId: user.id };
    await updateDoc(orderDoc, newFields);
    window.location.reload(false);
  };
  if (!userLogged) {
    return <Redirect to="/login" />;
  } else {
    const orderList = orders.map((order) => {
      if (order.workerId == "") {
        return (
          <Order
            title={order.name}
            content={order.description}
            clientId={order.clientId}
            workerId={order.workerId}
            date={order.date}
            updateFunction={updateOrderWorker}
            user={user}
            type={"allOrders"}
            id={order.id}
            key={order.id}
          ></Order>
        );
      }
    });

    return (
      <div>
        <button
          onClick={() =>
            history.push({
              pathname: "/myorders/" + user.id,
              state: { workerId: user.id },
            })
          }
        >
          MyOrders
        </button>
        {orderList}
      </div>
    );
  }
};

export default Orders;
