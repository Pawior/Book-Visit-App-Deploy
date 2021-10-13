import React, { useState, useRef, useContext, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Redirect } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(true);
  const [attemps, setAttemps] = useState(3);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const isMounted = useRef(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const userType = useRef();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const logUserIn = async (e) => {
    e.preventDefault();
    console.log(userType.current.value);
    document.querySelector(".login-info").innerHTML = "";
    let q = query(
      collection(db, `${userType.current.value}s`),
      where("email", "==", emailRef.current.value),
      where("password", "==", passwordRef.current.value)
    );
    let querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach(async (doc) => {
      console.log(doc.id, " => ", doc.data());
      await setUserId(doc.id);
      await setAttemps(doc.data().loginAttemps);
      await setActive(doc.data().active);
      await setEmail(doc.data().email);
      await setPassword(doc.data().password);
    });
    await setRefresh(true);
    await setError(true);
  };

  const sendActivationEmail = async (email) => {
    const response = await fetch("http://localhost:5000/send-email", {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: {
        "email": email
      }
    })
    history.push({ pathname: "/login" })

  }

  useEffect(async () => {
    if (isMounted.current && active == true) {
      console.log("dziala");
      console.log(email);
      console.log(password);
      await setUser({
        id: userId,
        email: email,
        password: password,
        userType: userType.current.value,
      });
    } else {
      isMounted.current = true;
    }
    console.log(email, password, active, attemps);
  }, [password]);

  if (user && active == true) {
    return <Redirect to="/" />;
  } else if (active == false) {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>This account is not active</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Click "send activation email" and click activation link on our email
            or go back to login page.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => sendActivationEmail(emailRef.current.value)}>Send activation email</Button>
          <Button
            variant="danger"
            onClick={() => {
              history.push({ pathname: "/login" });
              window.location.reload();
            }}
          >
            Go back to login
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  } else {
    return (
      <div>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>

            <Form>
              <h3>Log as</h3>
              <select ref={userType}>
                <option>client</option>
                <option>worker</option>
              </select>

              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <p className="login-info"></p>
              {error ? <div> Wrong password or email </div> : null}
              <Button
                disabled={loading}
                className="w-100 mt-4"
                type="submit"
                onClick={logUserIn}
              >
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
