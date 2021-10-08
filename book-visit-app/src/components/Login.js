import React, { useState, useRef, useContext, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDoc, doc, query, where, getDocs } from "firebase/firestore";
import { UserContext } from '../contexts/UserContext'


export default function Login() {
  const { user, setUser } = useContext(UserContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const userType = useRef();

  const [loading, setLoading] = useState(false);

  const logUserIn = async (e) => {
    e.preventDefault()
    setRefresh(!refresh)
    const q = query(collection(db, `${userType.current.value}s`), where("email", "==", emailRef.current.value))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      console.log(doc.id, " => ", doc.data());
      await setEmail(doc.data().email)
      await setPassword(doc.data().password)

    })
    console.log(email, password)
  }

  useEffect(() => {
    console.log(email, password)
    if (email && password) {
      if (passwordRef.current.value === password) {
        document.querySelector('.login-info').innerHTML = "<span>Login successful</span>"
        console.log("logged!")
      } else {
        console.log(passwordRef)
        console.log(password)
        document.querySelector('.login-info').innerHTML = "<span>Wrong email or password</span>"
        console.log("wrong email or password")
      }

    }
  }, [password])



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
            <Button disabled={loading} className="w-100 mt-4" type="submit" onClick={logUserIn}>
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
