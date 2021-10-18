const confirmEmail = (orderInfo) => {
    return `
    <div>
        <h2>Your order has been successfully submited</h2>
        <p>Order Title: ${orderInfo.title}</p>
        <p>Order Description: ${orderInfo.description}</p>
        <p>Order Date: ${orderInfo.date}</p>
        <p>Order Link: ${process.env.CLIENT_IP}/user-orders/${orderInfo.clientId}</p>
    <div>
    `
}

module.exports = confirmEmail;