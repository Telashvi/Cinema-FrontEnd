import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { UserService } from '../../services/user.service';

function AddUser() {
    const state = useSelector(state => state)
    const dispatch = useDispatch()


    useEffect(() => {
        auth()
    }, [])

    async function auth() {
        let responseStatus = await UserService.auth()
        if (responseStatus === 401 || responseStatus === 500) {
            dispatch({ type: "LOGOUT" })
        }
    }
    let history = useHistory()
    const [pArray, setPArray] = useState([])
    const [userObj, setUserObj] = useState({
        FirstName: "",
        LastName: "",
        UserName: "",
        SessionTimeOut: 0,
        Permissions: [...pArray]
    })
    const [vSub, setVSub] = useState()
    const [vMovie, setVMovie] = useState()
    useEffect(() => {
        setVSub(checkIfCheck("View Subscriptions"))
        setVMovie(checkIfCheck("View Movies"))
    }, [pArray])
    useEffect(() => {
        let copy = { ...userObj }
        copy.Permissions = [...pArray]
        setUserObj(copy)

    }, [pArray]);


    function toUserManagement() {
        history.push('/UsersManagement')
    }
    function checkIfCheck(name) {
        if (pArray.includes(name)) return true
        else return false
    }
    function manipulateCheckBox(e) {
        let permission = e.target.name
        let permission2
        if (permission === "View Subscriptions" && pArray.includes(permission)) {
            let tempArray = [...pArray]
            pArray.forEach(perm => {
                if (perm.includes("Subscriptions"))
                    tempArray.splice(tempArray.indexOf(perm), 1)
            })
            setPArray(tempArray)
            return
        }
        if (permission === "View Movies" && pArray.includes(permission)) {
            let tempArray = [...pArray]
            pArray.forEach(perm => {
                if (perm.includes("Movies"))
                    tempArray.splice(tempArray.indexOf(perm), 1)
            })
            setPArray(tempArray)
            return
        }
        if (pArray.includes(permission)) {
            let tempArray = [...pArray]
            tempArray.splice(tempArray.indexOf(permission), 1)
            setPArray(tempArray)

        } else {
            if (permission.includes("Subscriptions") && permission !== "View Subscriptions") {
                permission2 = "View Subscriptions"
                setVSub(true)
            }
            if (permission.includes("Movies") && permission !== "View Movies") {
                permission2 = "View Movies"
                setVMovie(true)
            }
            let tempArray = [...pArray]
            if (tempArray.includes(permission2)) tempArray.push(permission)
            else if (permission2 === undefined) tempArray.push(permission)
            else tempArray.push(permission, permission2)
            setPArray(tempArray)
        }
    }
    async function addUser() {
        try {
            await UserService.addUser(userObj)
            alert('User added')
        } catch (err) {
            alert(err.response.data.message);
        }

    }

    if (!state.isLoggedIn) return (<div>You are not allowed to view this page. </div>)
    return (
        <div>
            Welcome, {state.name}
            <h1>Add User Page</h1>
            First Name: <input onChange={e => { let copy = { ...userObj }; copy.FirstName = e.target.value; setUserObj(copy) }}></input> <br></br>
            Last Name: <input onChange={e => { let copy = { ...userObj }; copy.LastName = e.target.value; setUserObj(copy) }}></input> <br></br>
            User Name: <input onChange={e => { let copy = { ...userObj }; copy.UserName = e.target.value; setUserObj(copy) }}></input> <br></br>
            Session Timeout: <input onChange={e => { let copy = { ...userObj }; copy.SessionTimeOut = Number(e.target.value); setUserObj(copy) }}></input> <br></br>
            View Subscriptions:  <input onChange={manipulateCheckBox} checked={vSub} name="View Subscriptions" type="checkbox" /> <br></br>
            Create Subscriptions:  <input onChange={manipulateCheckBox} name="Create Subscriptions" checked={checkIfCheck("Create Subscriptions")} type="checkbox" /> <br></br>
            Delete Subscriptions:  <input onChange={manipulateCheckBox} name="Delete Subscriptions" checked={checkIfCheck("Delete Subscriptions")} type="checkbox" /><br></br>
            Update Subscriptions:  <input onChange={manipulateCheckBox} name="Update Subscriptions" checked={checkIfCheck("Update Subscriptions")} type="checkbox" /><br></br>
            View Movies:  <input onChange={manipulateCheckBox} name="View Movies" checked={vMovie} type="checkbox" /><br></br>
            Create Movies:  <input onChange={manipulateCheckBox} name="Create Movies" type="checkbox" checked={checkIfCheck("Create Movies")} /><br></br>
            Delete Movies:  <input onChange={manipulateCheckBox} name="Delete Movies" type="checkbox" checked={checkIfCheck("Delete Movies")} /><br></br>
            Update Movies:  <input onChange={manipulateCheckBox} name="Update Movies" type="checkbox" checked={checkIfCheck("Update Movies")} /><br></br>

            <button onClick={addUser}>Save</button> <button onClick={toUserManagement}>Cancel</button>
        </div>

    );
}

export default AddUser;
