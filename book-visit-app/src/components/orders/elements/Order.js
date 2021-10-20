import React, { useState, useEffect, useContext } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useHistory } from 'react-router-dom'
import { UserContext } from "../../../contexts/UserContext";
import Badge from 'react-bootstrap/Badge'

const Order = (props) => {
  const { user, setUser } = useContext(UserContext)
  const [fullDate, setFullDate] = useState("");
  const history = useHistory()
  const statusColors = ["orange", "royalblue", "green"]
  let statusColor;
  if (props.status === "pending") {
    statusColor = statusColors[0]
  } else if (props.status === "in progress") {
    statusColor = statusColors[1]
  } else {
    statusColor = statusColors[2]
  }
  useEffect(() => {


    let fDate;
    if (typeof props.date == "number") {
      fDate = new Date(props.date * 1000).toString().substr(0, 21);
      setFullDate(fDate);
    } else {
      fDate = new Date(props.date.seconds * 1000).toString().substr(0, 21);
      setFullDate(fDate);
    }
  }, []);


  const redirectToOrderInfo = (orderInfo) => {
    history.push({
      pathname: `/order/${orderInfo.id}`,
      state: {
        id: orderInfo.id,
        date: fullDate,
        title: orderInfo.title,
        clientId: orderInfo.clientId,
        workerId: orderInfo.workerId,
        content: orderInfo.content,
        status: orderInfo.status
      }
    })
  }
  return (
    <Card
      className="mt-4 m-2"
      border="primary"
      style={{ width: "18rem" }}
      key={props.orderID}
    >
      <Card.Header>Zlecenie
        <Badge bg="primary" style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: statusColor, width: "5rem", height: "1.5rem" }} >{props.status}</Badge>
      </Card.Header>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        {/* <Card.Text>{props.content}</Card.Text> */}
        <Card.Text>{fullDate}</Card.Text>

        {props.type == "allOrders" ? (
          <Button
            variant="success"
            onClick={() => props.updateFunction(props.user, props.id)}
          >
            Accept order
          </Button>

        ) : (
          <>

            {user.userType == "worker" ? <Button
              variant="danger"
              onClick={() => props.updateFunction(props.user, props.id)}
            >
              Decline
            </Button> : null}
            <Button className="m-2" variant="info" onClick={() => redirectToOrderInfo(props)}>Order info</Button>
          </>

        )}
        {/* <Button className="m-2" variant="info" onClick={() => redirectToOrderInfo(props)}>Order info</Button> */}

      </Card.Body>
    </Card >
  );
};

export default Order;
