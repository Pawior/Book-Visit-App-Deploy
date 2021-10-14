import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Redirect, useHistory } from "react-router-dom";
import Order from "./elements/Order";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import DateRangePicker from "react-bootstrap-daterangepicker";

const Orders = () => {
  const { user, setUser } = useContext(UserContext);
  const userLogged = localStorage.getItem("logged");
  const [orders, setOrders] = useState([]);
  const [ordersStartDate, setOrdersStartDate] = useState();
  const [ordersEndDate, setOrdersEndDate] = useState(null);

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
    // console.log("Przesyłanei funkcji " + user.id);
    // console.log(user);
    // console.log(orderId);
    const orderDoc = doc(db, "orders", orderId);
    const newFields = { workerId: user.id };
    await updateDoc(orderDoc, newFields);
    window.location.reload(false);
  };

  const rangePickerCallback = (start, end, label) => {
    console.log("start", start._d, "end", end, "label", label);
    const startDate = new Date(start._d);
    const endDate = new Date(end._d);

    console.log(startDate.getTime(), endDate.getTime());
    setOrdersStartDate(startDate.getTime());
    setOrdersEndDate(endDate.getTime());
  };
  if (!userLogged) {
    return <Redirect to="/login" />;
  } else {
    const orderList = orders.map((order) => {
      if (order.workerId == "") {
        if (ordersStartDate) {
          // console.log("poczatek:", ordersStartDate);
          // console.log("orderu:", order.date);
          // console.log("koniec:", ordersEndDate);
          if (
            order.date >= ordersStartDate / 1000 &&
            ordersEndDate / 1000 >= order.date
          ) {
            console.log("co jest");
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
        } else {
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
        <DateRangePicker
          initialSettings={{ startDate: "10/1/2021", endDate: "10/31/2021" }}
          onCallback={rangePickerCallback}
        >
          <button>Click Me To Open Picker!</button>
        </DateRangePicker>
        {orderList}
      </div>
    );
  }
};

export default Orders;
