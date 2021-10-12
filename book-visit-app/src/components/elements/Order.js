import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
const Order = (props) => {
  const [fullDate, setFullDate] = useState("");
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
        <Card.Text>{props.content}</Card.Text>
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
      </Card.Body>
    </Card>
  );
};

export default Order;
