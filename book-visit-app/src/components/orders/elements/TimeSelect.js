import React, { useRef } from 'react'
import Button from 'react-bootstrap/Button'
import { db } from "../../../firebase";
import { doc, setDoc, collection, updateDoc, getDocs, getDoc } from "firebase/firestore";
import { isEmpty, stringify } from '@firebase/util';
import Spinner from 'react-bootstrap/Spinner'
const TimeSelect = (props) => {
    const timeSelectRef = useRef()
    const startHourRef = useRef()
    const spinnerRef = useRef()
    const errorRef = useRef()
    const freeTimeCollectionRef = collection(db, "freeTime")
    const freeTimeDocRef = doc(db, "freeTime", props.workerId)
    let minHour = props.minHour
    minHour = parseInt(minHour.substr(16, 2))
    const options = []
    for (let i = minHour; i <= 17; i++) {
        // console.log(i)
        options.push(`${i}:00`)
    }

    const returnedOptions = options.map((option) => { // ---- returning available start hours options ----
        return (
            <option value={option}>{option}</option>
        )
    })
    const calculateOrderTime = (start, time) => { // ---- function used to calculate workers busy time taking 15min breaks each hour ----
        const obj = {}
        for (; ;) {
            if (time > 45) {
                obj[start] = 45
                start++
                time = time - 45
            } else if (time <= 45 && time > 0) {
                obj[start] = time
                time = 0
            } else {
                break
            }
        }
        return obj
    }
    const getInfoFromDb = async () => { // ---- function used to get DB docs informations ----
        const docSnap = await getDoc(freeTimeDocRef)
        return docSnap.data()
    }

    const checkAvailability = (dbRes, ourTime, date) => { // ---- function to check if the times is database and user times do not colidate ----
        console.log(ourTime)
        if (dbRes.hasOwnProperty(date)) {
            let hasOwn = false

            for (let key in dbRes[date]) {
                // ---- finding if the key exists in the time passed by worker ----
                if (ourTime[date][key]) {
                    ourTime[date][key] = ourTime[date][key] + dbRes[date][key]
                    console.log(dbRes[date][key])
                    console.log(ourTime[date][key])
                    // ---- key exists, but worker should have 15 min rest each hour, cannot accept this time ----
                    if (ourTime[date][key] > 45) {
                        return {}
                    }
                    console.log('posiada')
                    hasOwn = true
                }
            }

            // ---- everything is ok, time is actualized ----
            return ourTime
            // ---- times do not colidate with each other ----
        } else {
            return ourTime
        }

    }
    const sendFreeTimeToDb = async (data) => {
        // ---- Funkcja opózniająca zawiera w sobie promise, 
        // który po upłynięcia x czasu ( podane w parametrze ), kończy się sukcesem i
        // i wywołuję to co po .then, czyli zwraca error jeżeli godzina jest już zajęta  ---
        // ----
        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time)).then(() => {
                console.log(data)
                if (isEmpty(data)) {
                    console.log('nie można')
                    errorRef.current.innerHTML = "Nie możesz zaakceptować tych opcji. Jesteś wtedy zajęty!"
                } else {
                    errorRef.current.innerHTML = ""
                    console.log('można')
                    setDoc(freeTimeDocRef, data, { merge: true })
                }
            });


        }
        await delay(1000); // wywoałnie promise, opóźniającego o sekunde
        spinnerRef.current.style.display = "none";

    }
    const confirmOrderTime = async () => {
        console.log(spinnerRef)
        spinnerRef.current.style.display = "block";
        const returnedTimes = calculateOrderTime(parseInt(startHourRef.current.value), parseInt(timeSelectRef.current.value))
        const date = new Date(Date.parse(props.minHour))
        const fullDate = `${date.getDate()}.${date.getUTCMonth() + 1}.${date.getFullYear()}`
        let toReturn = {}

        toReturn[fullDate] = returnedTimes
        const dbFreeTimeInfo = await getInfoFromDb()

        toReturn = await checkAvailability(dbFreeTimeInfo, toReturn, fullDate)
        await sendFreeTimeToDb(toReturn)

    }
    return (
        <div>
            <h5>Chose realization start hour: </h5>
            <select ref={startHourRef}>
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
                <option>300min</option>d
            </select>

            <Button variant="primary" onClick={() => confirmOrderTime()}>Confirm time</Button>
            <Spinner style={{ display: "none" }} ref={spinnerRef} animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="add-to-db-error" ref={errorRef}></p>
        </div >
    )
}

export default TimeSelect
