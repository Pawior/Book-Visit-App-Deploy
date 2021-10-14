import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useHistory } from 'react-router-dom'

const Order = (props) => {
  const [fullDate, setFullDate] = useState("");
  const history = useHistory()
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
    console.log(orderInfo)
    history.push({
      pathname: `/order/${orderInfo.id}`,
      state: {
        id: orderInfo.id,
        date: orderInfo.date.id,
        title: orderInfo.title,
        clientId: orderInfo.clientId,
        workerId: orderInfo.workerId,
        content: orderInfo.content
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
      <Card.Header>Zlecenie</Card.Header>
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
          <Button
            variant="danger"
            onClick={() => props.updateFunction(props.user, props.id)}
          >
            Decline
          </Button>

        )}
        <Button className="m-2" variant="info" onClick={() => redirectToOrderInfo(props)}>Order info</Button>
      </Card.Body>
    </Card>
  );
};

export default Order;
