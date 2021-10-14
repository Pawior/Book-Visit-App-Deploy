import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { UserContext } from "../contexts/UserContext";
import { Redirect, useHistory } from "react-router-dom";
import io from "socket.io-client";
let socket;

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  useEffect(
    function () {
      if (user) {
        window.localStorage.setItem("logged", true);
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            id: user.id,
            userType: user.userType,
          })
        );
        const userL = JSON.parse(localStorage.getItem("user"));
        const userLogged = window.localStorage.getItem("user");
        console.log(userL);
        console.log(user);
      }
    },
    [user]
  );

  // let user;
  const ENDPT = "localhost:5000";
  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPT]);

  const redirectToOrders = () => {
    history.push({
      pathname: "/orders",
    });
  };

  const redirectToAddOrder = () => {
    console.log(user.id);

    history.push({
      pathname: "/addorder",
    });
  };

  const redirectToMyOrders = () => {
    history.push({
      pathname: "/myorders/" + user.id,
      state: { workerId: user.id },
    });
  };
  const sendEmail = () => {
    socket.emit('send-email', user);
  }
  if (!user) {
    return <Redirect to="/login" />;
  } else if (user.userType && user.userType == "client") {
    console.log("client");
    return (
      <div>
        <button onClick={redirectToAddOrder}>Orders</button>
      </div>
    );
  } else if (user.userType && user.userType == "worker") {
    console.log("worker");
    return (
      <div>
        <button onClick={redirectToOrders}>Orders</button>
        <button onClick={redirectToMyOrders}>My Orders</button>
        <button onClick={sendEmail}>Send Email</button>
      </div>
    );
  }
}
