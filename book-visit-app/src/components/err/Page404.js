import React from 'react'
import { useHistory } from "react-router-dom"

const Page404 = () => {
    const history = useHistory()
    const redirectToHome = () => {
        history.push({ pathname: '/' })
    }
    return (
        <div>
            <h1>Page not found!</h1>
            <button onClick={redirectToHome}>Home page</button>
        </div>
    )
}

export default Page404
