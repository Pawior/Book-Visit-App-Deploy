import React, { useState, useRef, useContext, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Redirect } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const isMounted = useRef(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const userType = useRef();

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
      await setEmail(doc.data().email);
      await setPassword(doc.data().password);
    });
    await setRefresh(true);
    console.log(email, password);
  };

  useEffect(async () => {
    if (isMounted.current) {
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
  }, [password]);

  if (user) {
    return <Redirect to="/" />;
  } else {
    return (
      <div>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger"> {error} </Alert>}
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
