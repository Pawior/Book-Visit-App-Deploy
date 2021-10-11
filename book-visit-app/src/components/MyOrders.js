import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Redirect, useHistory } from "react-router-dom";
import Order from "./elements/Order";

const MyOrders = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const userLogged = localStorage.getItem("logged");
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
    console.clear();
  }, []);

  const updateOrderWorker = async (user, orderId) => {
    const orderDoc = doc(db, "orders", orderId);
    const newFields = { workerId: "" };
    await updateDoc(orderDoc, newFields);
    window.location.reload();
  };

  if (!userLogged) {
    return <Redirect to="/login" />;
  } else {
    let orderListLen = 0;
    const orderList = orders.map((order) => {
      if (order.workerId === props.location.state.workerId) {
        orderListLen++;
        return (
          <Order
            title={order.name}
            content={order.description}
            clientId={order.clientId}
            workerId={order.workerId}
            date={order.date}
            user={user}
            id={order.id}
            key={order.id}
            updateFunction={updateOrderWorker}
          />
        );
      }
    });
    return orderListLen ? (
      <div>
        <button onClick={() => history.push({ pathname: "/orders" })}>
          All orders
        </button>
        {orderList}
      </div>
    ) : (
      <div>
        <button onClick={() => history.push({ pathname: "/orders" })}>
          All orders
        </button>
        <h2>All orders are done!</h2>
      </div>
    );
    // return <div>{orderList}</div>;
  }
};

export default MyOrders;
