import React, { useState } from "react";
import "./AddOrder.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddOrder = () => {
  const ordersCollectionRef = collection(db, "orders");
  const [newOrderTitle, setNewOrderTitle] = useState("");
  const [newOrderContent, setNewOrderContent] = useState("");
  const [newOrderDate, setNewOrderDate] = useState("");
  const [newOrderTime, setNewOrderTime] = useState("");

  const checkIfAllFieldsAreNotEmpty = () => {};

  const createOrder = async (e) => {
    e.preventDefault();
    await checkIfAllFieldsAreNotEmpty();

    // ---- calculating time ----
    let hours = newOrderTime.substring(0, newOrderTime.indexOf(":"));
    let minutes = newOrderTime.substring(newOrderTime.indexOf(":") + 1);
    hours = hours * 3600;
    minutes = minutes * 60;

    const orderDate = new Date(newOrderDate);
    var seconds = orderDate.getTime() / 1000;
    seconds = seconds - 7200;

    // ---- adding time to the date value ----
    seconds = seconds + hours + minutes;

    // ---- sending new record to database ----
    await addDoc(ordersCollectionRef, {
      name: newOrderTitle,
      description: newOrderContent,
      date: seconds,
      clientId: "",
      workerId: "",
    });
  };

  const buttonHandler = () => {};
  return (
    <div>
      <Form className="m-2 addOrder mt-5">
        <h1 className="page-title display-3">
          <strong>Add Order</strong>
        </h1>
        <br />
        <Form.Group className="mb-3" controlId="formBasicTitle">
          <Form.Label>Order title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter order title"
            onChange={(e) => setNewOrderTitle(e.target.value)}
          />
          <Form.Text className="text-muted">Chose a wise one</Form.Text>
        </Form.Group>
        <Form.Control
          type="date"
          name="date_of_visit"
          onChange={(e) => setNewOrderDate(e.target.value)}
        />

        <select
          className="time-select"
          onChange={async (e) => {
            setNewOrderTime(e.target.value);
          }}
        >
          <option>Choose hour</option>
          <option>8:00</option>
          <option>9:00</option>
          <option>10:00</option>
          <option>11:00</option>
          <option>12:00</option>
          <option>13:00</option>
          <option>14:00</option>
          <option>15:00</option>
          <option>16:00</option>
          <option>17:00</option>
        </select>
        <Form.Group className="mb-3" controlId="formControlTextarea">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            onChange={(e) => setNewOrderContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="I am not a robot" />
        </Form.Group>
        {/* <Button variant="primary" onClick={(e) => e.preventDefault()}> */}
        <Button variant="primary" onClick={createOrder}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddOrder;
