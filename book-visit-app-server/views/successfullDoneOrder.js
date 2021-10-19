const orderSuccessfullyDoneEmail = (orderInfo) => {
    return `
    <div>
        <h2>Your order is done!</h2>
        <p>Get your car back in free time!</p>
        <p>Order Title: ${orderInfo.title}</p>
        <p>Order Description: ${orderInfo.description}</p>
        <p>Order Link: ${process.env.CLIENT_IP}/user-orders/${orderInfo.clientId}</p>
    </div>
    `
    // email
}

module.exports = orderSuccessfullyDoneEmail