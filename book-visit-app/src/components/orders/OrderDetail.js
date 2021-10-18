import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge'
import "./OrderDetail.css"
import TimeSelect from './elements/TimeSelect'
import { db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore"

const OrderDetail = (props) => {
    const [status, setStatus] = useState("pending")
    const informations = props.history.location.state
    const statusColors = ["orange", "royalblue", "green"]
    let statusColor;
    if (status === "pending") {
        statusColor = statusColors[0]
    } else if (informations.status === "in progress") {
        statusColor = statusColors[1]
    } else {
        statusColor = statusColors[2]
    }
    // console.log(informations.status)
    // console.log(informations)
    useEffect(async () => {
        const orderDocRef = await doc(db, "orders", informations.id)
        const orderSnap = await getDoc(orderDocRef)
        // console.log(orderSnap.data())
        setStatus(orderSnap.data().status)
    }, [])

    return (
        <div id="OrderDetailContainer">
            <Container className="d-flex justify-content-center align-items-center h-100" >
                <Card border="info" style={{ width: '70rem', height: "35rem" }}>
                    <Card.Header className="card-title">
                        <Card.Title><h1> {informations.title} </h1></Card.Title></Card.Header>
                    <Card.Body>

                        <Badge className="status-badge" bg="primary" style={{ position: 'absolute', top: '10px', right: '50px', backgroundColor: statusColor, width: "10rem", height: "2.5rem" }} >{status}</Badge>
                        {/* <Card.Title>Info Card Title</Card.Title> */}
                        <Card.Text>

                            {informations.content} {informations.status}
                        </Card.Text>
                        <Card.Text>
                            {informations.workerId ? informations.workerId : null}
                        </Card.Text>
                        <Card.Text>
                            {informations.clientId ? informations.clientId : null}
                        </Card.Text>
                        {/* <Card.Text>

                        </Card.Text> */}
                        {status === "pending" ? <TimeSelect minHour={informations.date} workerId={informations.workerId} orderId={informations.id} /> : null}

                    </Card.Body>
                </Card>
            </Container>
        </div >
    )
}

export default OrderDetail
