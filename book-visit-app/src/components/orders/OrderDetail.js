import React, { useEffect, useState, useContext } from 'react'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge'
import "./OrderDetail.css"
import TimeSelect from './elements/TimeSelect'
import { UserContext } from '../../contexts/UserContext'
import { db } from "../../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore"
import Button from "react-bootstrap/Button";

const OrderDetail = (props) => {
    const { user, setUser } = useContext(UserContext)
    const [status, setStatus] = useState("pending")
    const informations = props.history.location.state
    const statusColors = ["orange", "royalblue", "green"]
    let statusColor;

    if (informations.status === "pending") {
        statusColor = statusColors[0]
    } else if (informations.status === "in progress") {
        statusColor = statusColors[1]
    } else {
        statusColor = statusColors[2]
    }
    // console.log(informations.status)
    console.log(informations)
    useEffect(async () => {
        const orderDocRef = await doc(db, "orders", informations.id)
        const orderSnap = await getDoc(orderDocRef)
        // console.log(orderSnap.data())
        setStatus(orderSnap.data().status)
    }, [])

    const orderDone = async () => {
        const orderDocRef = await doc(db, "orders", informations.id)
        const orderSnap = await getDoc(orderDocRef)
        const newFields = { status: "done" }
        informations.status = "done"
        setStatus("done")
        await updateDoc(orderDocRef, newFields);

    }

    return (
        <div id="OrderDetailContainer">
            <Container className="d-flex justify-content-center align-items-center h-100" >
                <Card border="info" style={{ width: '70rem', height: "35rem" }}>
                    <Card.Header className="card-title">
                        <Card.Title><h1> {informations.title} </h1></Card.Title></Card.Header>
                    {/* {status === "pending"?<Card.Body className="">: <Card.Body className="d-flex">} */}
                    <h2>Description:</h2>
                    <Card.Text > {informations.content}</Card.Text>
                    <Card.Body className="d-flex car">

                        <Badge className="status-badge" bg="primary" style={{ position: 'absolute', top: '10px', right: '50px', backgroundColor: statusColor, width: "10rem", height: "2.5rem" }} >{status}</Badge>
                        {/* <Card.Title>Info Card Title</Card.Title> */}
                        {/* <Card.Text> */}

                        {/* {informations.content} {informations.status} */}
                        {/* </Card.Text>
                        <Card.Text>
                            {informations.workerId ? informations.workerId : null}
                        </Card.Text>
                        <Card.Text>
                            {informations.clientId ? informations.clientId : null}
                        </Card.Text> */}
                        {/* <Card.Text>

                        </Card.Text> */}
                        {
                            user.userType === "worker" ?
                                <>
                                    {status === "pending" ? <TimeSelect className="m-0 align-self-end card-beggin" minHour={informations.date} workerId={informations.workerId} orderId={informations.id} /> : null}
                                    {status === "in progress" ? <Button className="align-self-center" style={{ width: "230px", height: "50px" }} variant="success" onClick={() => orderDone()}> Done </Button> : null}
                                </>

                                : null

                        }


                        {/* <Card.Text>
                            <h2>Description</h2>
                            
                        </Card.Text> */}
                    </Card.Body>

                </Card>
            </Container>
        </div >
    )
}

export default OrderDetail
