import React from 'react'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge'
import "./OrderDetail.css"
import TimeSelect from './elements/TimeSelect'

const OrderDetail = (props) => {
    const informations = props.history.location.state
    const statusColors = ["orange", "blue", "green"]
    let statusColor;
    if (informations.status === "pending") {
        statusColor = statusColors[0]
    } else if (informations.status === "in progress") {
        statusColor = statusColors[1]
    } else {
        statusColor = statusColors[2]
    }
    // console.log(informations.status)
    // console.log(informations)
    return (
        <div id="OrderDetailContainer">
            <Container className="d-flex justify-content-center align-items-center h-100" >
                <Card border="info" style={{ width: '70rem', height: "35rem" }}>
                    <Card.Header className="card-title">
                        <Card.Title><h1> {informations.title} </h1></Card.Title></Card.Header>
                    <Card.Body>

                        <Badge className="status-badge" bg="primary" style={{ position: 'absolute', top: '10px', right: '50px', backgroundColor: statusColor, width: "10rem", height: "2.5rem" }} >{informations.status}</Badge>
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
                        <TimeSelect minHour={informations.date} workerId={informations.workerId} />
                    </Card.Body>
                </Card>
            </Container>
        </div >
    )
}

export default OrderDetail
