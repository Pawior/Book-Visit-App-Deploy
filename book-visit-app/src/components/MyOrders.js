import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Redirect, useHistory } from "react-router-dom";
import Order from "./elements/Order";

const MyOrders = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const history = useHistory();
  const ordersCollectionRef = collection(db, "orders");
  useEffect(() => {
    const getOrders = async () => {
      const data = await getDocs(ordersCollectionRef);
      setOrders(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getOrders();
    console.clear();
  }, []);

  const updateOrderWorker = async (user, orderId) => {
    console.log("Przesyłanei funkcji " + user.id);
    console.log(user);
    console.log(orderId);
    const orderDoc = doc(db, "orders", orderId);
    const newFields = { workerId: "" };
    await updateDoc(orderDoc, newFields);
    // window.location.reload(false);
  };

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
            user={user}
            id={order.id}
            key={order.id}
            updateFunction={updateOrderWorker}
          />
        );
      }
    });
    console.log(orderListLen);
    return orderListLen ? (
      <div>
        <button onClick={() => history.push({ pathname: "/orders" })}>
          All orders
        </button>
        {orderList}
      </div>
    ) : (
      <div>All orders are done!</div>
    );
    // return <div>{orderList}</div>;
  }
};

export default MyOrders;
