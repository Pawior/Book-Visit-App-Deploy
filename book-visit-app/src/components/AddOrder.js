import React, { useState, useRef } from "react";
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
  const [iAmNotARobot, setIAmNotARobot] = useState(false)
  const titleEl = useRef(null)
  const dateEl = useRef(null)
  const hourSelectEl = useRef(null)
  const descriptionEl = useRef(null)

  const checkIfAllFieldsAreNotEmpty = () => {
    if (!newOrderTitle || !newOrderContent || !newOrderTime || !newOrderTime) {
      console.log("Fields must be no empty")
      document.querySelector('.form-errors').innerHTML = "<span class='form-error'>Fields must not be empty!</span>"
      return true
    } else if (!iAmNotARobot) {
      document.querySelector('.form-errors').innerHTML = "<span class='form-error'>Confirm you are not a robot!</span>"
      return true
    } else {
      document.querySelector('.form-errors').innerHTML = "<span class='form-success'>Success!</span>"
      return false
    }
  };

  const createOrder = async (e) => {
    e.preventDefault();
    await checkIfAllFieldsAreNotEmpty();

    let isError = await checkIfAllFieldsAreNotEmpty();
    if (isError) {

<<<<<<< HEAD
    const orderDate = new Date(newOrderDate);
    var seconds = orderDate.getTime() / 1000;
    seconds = seconds - 7200;
=======
    } else {
      console.log('success')
      // ---- calculating time ----
      let hours = newOrderTime.substring(0, newOrderTime.indexOf(":"));
      let minutes = newOrderTime.substring(newOrderTime.indexOf(":") + 1);
      hours = hours * 3600;
      minutes = minutes * 60;
>>>>>>> main

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
  }

  const buttonHandler = () => { };
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
            ref={titleEl}
            type="text"
            placeholder="Enter order title"
            className="order-title"
            onChange={(e) => setNewOrderTitle(e.target.value)}
          />
          <Form.Text className="text-muted">Chose a wise one</Form.Text>
        </Form.Group>
        <Form.Control
          ref={dateEl}
          type="date"
          name="date_of_visit"
          className="order-date"
          onChange={(e) => setNewOrderDate(e.target.value)}
        />

        <select
          ref={hourSelectEl}
          className="time-select"
          className="order-time"
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
            ref={descriptionEl}
            as="textarea"
            rows={3}
            className="order-content"
            onChange={(e) => setNewOrderContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="I am not a robot" onClick={() => setIAmNotARobot(!iAmNotARobot)} />
        </Form.Group>
        {/* <Button variant="primary" onClick={(e) => e.preventDefault()}> */}
        <p className="form-errors"></p>
        <Button variant="primary" onClick={createOrder}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddOrder;
