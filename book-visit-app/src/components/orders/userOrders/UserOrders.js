import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { db } from "../../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Redirect, useHistory } from "react-router-dom";
import Order from ".././elements/Order";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import DateRangePicker from "react-bootstrap-daterangepicker";

const UserOrders = (props) => {
    const { user, setUser } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [clientID, setClientID] = useState("")
    const userLogged = localStorage.getItem("logged");
    const [ordersStartDate, setOrdersStartDate] = useState();
    const [ordersEndDate, setOrdersEndDate] = useState(null);

    const history = useHistory();
    const ordersCollectionRef = collection(db, "orders");
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        // await setClientID(user.id)
        // await props.history.location.clientId = user.id
    }, []);
    useEffect(() => {
        const getOrders = async () => {
            const data = await getDocs(ordersCollectionRef);
            setOrders(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getOrders();
        console.clear();
    }, []);



    const updateOrderWorker = async (user, orderId) => {
        const orderDoc = doc(db, "orders", orderId);
        const newFields = { workerId: "", status: "pending" };
        await updateDoc(orderDoc, newFields);
        window.location.reload();
    };

    const rangePickerCallback = (start, end, label) => {
        console.log("start", start._d, "end", end, "label", label);
        const startDate = new Date(start._d);
        const endDate = new Date(end._d);

        console.log(startDate.getTime(), endDate.getTime());
        setOrdersStartDate(startDate.getTime());
        setOrdersEndDate(endDate.getTime());
    };
    if (!userLogged) {
        return <Redirect to="/login" />;
    } else {
        let orderListLen = 0;
        const orderList = orders.map((order) => {
            if (order.clientId === user.id) {
                if (ordersStartDate) {
                    if (
                        order.date >= ordersStartDate / 1000 &&
                        ordersEndDate / 1000 >= order.date
                    ) {
                        orderListLen++;
                        return (
                            <Order
                                title={order.name}
                                content={order.description}
                                clientId={order.clientId}
                                workerId={order.workerId}
                                date={order.date}
                                status={order.status}
                                user={user}
                                id={order.id}
                                key={order.id}
                                updateFunction={updateOrderWorker}
                            />
                        );
                    }
                } else {
                    orderListLen++;
                    return (
                        <Order
                            title={order.name}
                            content={order.description}
                            clientId={order.clientId}
                            workerId={order.workerId}
                            date={order.date}
                            status={order.status}
                            user={user}
                            id={order.id}
                            key={order.id}
                            updateFunction={updateOrderWorker}
                        />
                    );
                }
            }
        });
        return orderListLen ? (
            <div>
                <DateRangePicker
                    initialSettings={{ startDate: "10/1/2021", endDate: "10/31/2021" }}
                    onCallback={rangePickerCallback}
                >
                    <button>Click Me To Open Picker!</button>
                </DateRangePicker>
                {orderList}
            </div>
        ) : (
            <div>
                <DateRangePicker
                    initialSettings={{ startDate: "10/1/2021", endDate: "10/31/2021" }}
                    onCallback={rangePickerCallback}
                >
                    <button>Click Me To Open Picker!</button>
                </DateRangePicker>
                <h2>You have not sended any orders!</h2>
            </div>
        );
        // return <div>{orderList}</div>;
    }
};

export default UserOrders;
