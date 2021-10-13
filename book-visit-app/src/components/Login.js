import React, { useState, useRef, useContext, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Redirect } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
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
  const [confirmedEmail, setConfirmedEmail] = useState();

  const logUserIn = async (e) => {
    e.preventDefault();

    console.log(userType.current.value);
    document.querySelector(".login-info").innerHTML = "";
    setAttemps(attemps - 1);
    let q = query(
      collection(db, `${userType.current.value}s`),
      where("email", "==", emailRef.current.value),
      where("password", "==", passwordRef.current.value)
    );
    let querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach(async (info) => {
      console.log(info.id, " => ", info.data());
      await setUserId(info.id);
      await setAttemps(3);
      await setActive(true);
      await setEmail(info.data().email);

      const userDoc = doc(db, `${userType.current.value}s`, info.id);
      const newFields = { loginAttemps: 3, active: true };
      await updateDoc(userDoc, newFields);
      await setPassword(info.data().password);
    });
    await setRefresh(true);
    await setError(true);
  };

  useEffect(() => {
    console.log("active:", active, "attemps:", attemps);
    console.log(confirmedEmail);
  });

  const refreshUserLoginAttemps = () => {
    console.log(emailRef.current.value);
    setConfirmedEmail(emailRef.current.value);
    const users = ["workers", "clients"];
    users.forEach(async (userT) => {
      let q3 = query(
        collection(db, userT),
        where("email", "==", emailRef.current.value)
      );
      let querySnapshot3 = await getDocs(q3);
      querySnapshot3.forEach(async (info) => {
        // setAttemps(info.data().loginAttemps);
        const userDoc = doc(db, userT, info.id);
        console.log(info.data().loginAttemps);
        await setAttemps(info.data().loginAttemps);
        await setActive(info.data().active);
        console.log(info.id, " => ", info.data());
      });
    });
  };

  useEffect(() => {
    if (isMounted.current) {
      console.log("local attemps", attemps);
      //---- updating user login attemps ----
      const users = ["workers", "clients"];
      users.forEach(async (userT) => {
        // console.log(userT);
        let q2 = query(
          collection(db, userT),
          where("email", "==", emailRef.current.value)
        );
        let querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach(async (info) => {
          // setAttemps(info.data().loginAttemps);
          const userDoc = doc(db, userT, info.id);
          console.log(info.data().loginAttemps);
          // if (info.data().loginAttemps === 1) {
          //   const newFieldsActive = { active: false };
          //   await updateDoc(userDoc, newFieldsActive);
          // } else {
          const newFields = { loginAttemps: attemps };
          await updateDoc(userDoc, newFields);
          // }
          if (info.data().loginAttemps <= 0) {
            const newFieldsActive = { active: false };
            await updateDoc(userDoc, newFieldsActive);
            const newFields = { loginAttemps: attemps };
            await updateDoc(userDoc, newFields);
          }
          console.log(info.id, " => ", info.data());
        });
      });
    }
  }, [attemps]);

  // useEffect(() => {
  //   setAttemps(attemps - 1);
  // }, [])
  const sendActivationEmail = async (email) => {
    console.log(email);
    const body = { email: email };
    console.log(body);

    const data = fetch("http://localhost:5000/send-email", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.log(err));

    history.push({ pathname: "/login" });
  };

  useEffect(async () => {
    if (isMounted.current && active == true) {
      // sprytne żeby useEffect się nie wykonywał na starcie
      console.log("dziala");
      console.log(email);
      console.log(password);
      await setUser({
        id: userId,
        email: email,
        password: password,
        userType: userType.current.value,
      });
      setAttemps(3);
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
          <Button
            variant="primary"
            onClick={() => sendActivationEmail(confirmedEmail)}
          >
            Send activation email
          </Button>
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
                <Form.Control
                  type="email"
                  ref={emailRef}
                  required
                  onBlur={() => refreshUserLoginAttemps()}
                />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  required
                  onBlur={() => refreshUserLoginAttemps()}
                />
              </Form.Group>
              <p className="login-info"></p>
              {error ? (
                <div> Wrong password or email! Left attemps: {attemps}</div>
              ) : null}
              <Button
                disabled={loading}
                className="w-100 mt-4"
                type="submit"
                onClick={logUserIn}
                required
                onBlur={() => refreshUserLoginAttemps()}
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
