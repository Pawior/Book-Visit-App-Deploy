import React, { useContext } from 'react'
import './Navbar.css'
import { useHistory } from "react-router-dom"
import { UserContext } from '../../contexts/UserContext'

const Navbar = () => {
    const { user, setUser } = useContext(UserContext)
    const history = useHistory()
    if (user) {
        console.log(user)
    }
    let navContent
    if (user) {
        if (user.userType === "worker") {
            navContent = (
                <ul>
                    <li><a href="/orders">All orders</a></li>
                    <li><a onClick={() => redirectToMyOrders()} href="">My orders</a></li>
                    <li><a onClick={() => logout()} href="">Logout</a></li>
                </ul>
            )
        } else {
            navContent = (
                <ul>
                    <li><a href="/addorder"></a></li>
                </ul>
            )
        }
    } else {
        navContent = (<h1>Welcome to Book Visit App</h1>)
    }

    const redirectToMyOrders = () => {
        history.push({
            pathname: `/myorders/${user.id}`,
            state: { workerId: user.id }
        })
    }

    const logout = async () => {
        localStorage.setItem("user", JSON.stringify({}))
        await setUser({})
        window.location.reload()
        history.push({ pathname: '/login' })
        console.log(user)
    }

    return (
        <nav>
            <div className="nav-content">
                {navContent}
                <img src="/images/logo_transparent.png" onClick={() => history.push({ pathname: "/" })}></img>
            </div>
        </nav>
    )
}

export default Navbar
