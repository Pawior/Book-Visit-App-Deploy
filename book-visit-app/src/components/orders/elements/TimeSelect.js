import React, { useRef } from 'react'
import Button from 'react-bootstrap/Button'

const TimeSelect = (props) => {
    const timeSelectRef = useRef()
    let minHour = props.minHour
    minHour = parseInt(minHour.substr(16, 2))
    const options = []
    for (let i = minHour; i <= 17; i++) {
        console.log(i)
        options.push(`${i}:00`)
    }

    const returnedOptions = options.map((option) => {
        return (
            <option value={option}>{option}</option>
        )
    })


    const confirmOrderTime = () => { }
    return (
        <div>
            <h5>Chose realization start hour: </h5>
            <select>
                {returnedOptions}
            </select>
            <h5>Select how much time do you need to realize this order:</h5>
            <select ref={timeSelectRef}
                className="time-select"
            >
                <option>5min</option>
                <option>10min</option>
                <option>15min</option>
                <option>20min</option>
                <option>25min</option>
                <option>30min</option>
                <option>35min</option>
                <option>40min</option>
                <option>50min</option>
                <option>55min</option>
                <option>60min</option>
                <option>75min</option>
                <option>90min</option>
                <option>120min</option>
                <option>150min</option>
                <option>180min</option>
                <option>240min</option>
                <option>300min</option>
                <option>whole day</option>
            </select>

            <Button variant="primary" onClick={() => confirmOrderTime()}>Confirm time</Button>
        </div>
    )
}

export default TimeSelect
