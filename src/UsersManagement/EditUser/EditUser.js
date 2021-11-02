import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserService } from "../../services/user.service"
import { useDispatch, useSelector } from "react-redux";

function EditUser() {
    let { username } = useParams();
    const [userData, setUserData] = useState()
    const [userFirstAndLastName, setUserFirstAndLastName] = useState()
    const [pArray, setPArray] = useState([])
    const [vSub, setVSub] = useState()
    const [vMovie, setVMovie] = useState()
    const [finalUserData, setFinalUserData] = useState()
    let history = useHistory();
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
    useEffect(() => {
        getUserData()
    }, [])

    useEffect(() => {
        if (userData !== undefined) {
            setPArray(userData.Permissions)
            setUserFirstAndLastName(userData.FirstName + " " + userData.LastName)
        }
    }, [userData])

    useEffect(() => {
        setVSub(checkIfCheck("View Subscriptions"))
        setVMovie(checkIfCheck("View Movies"))
    }, [pArray])
    useEffect(() => {
        let copyObj = { ...userData }
        copyObj.Permissions = [...pArray]
        setFinalUserData(copyObj)
    }, [pArray])
    async function getUserData() {
        let allUsersData = await UserService.getAllUsersData()
        setUserData(allUsersData.data.find(user => user.UserName === username))
    }

    function handleInput(e) {
        let inputData = e.target.value
        let inputName = e.target.name
        let objCopy = { ...userData }
        objCopy[inputName] = inputData
        setUserData(objCopy)
        setFinalUserData(objCopy)
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

    async function saveEdit() {
        try {
            const response = await UserService.editUser(finalUserData, finalUserData.id)
            alert(response.data.message)
            history.push("/UsersManagement");
        } catch (err) {
            alert(err.response.data.message)
        }

    }

    function checkIfCheck(name) {
        if (pArray.includes(name)) return true
        else return false
    }
    function toAllUsers() {
        history.push("/UsersManagement");
    }
    if (!state.isLoggedIn) return (<div>You are not allowed to view this page.</div>)

    if (userData !== undefined && pArray !== []) {
        return (<div>
            <div>
                Welcome, {state.name}
                <p>Edit User:{userFirstAndLastName}</p>
            </div>
            <div style={{ border: "1px solid black" }}>

                FirstName: <input onChange={handleInput} name="FirstName" defaultValue={userData.FirstName}></input><br></br>
                LastName: <input onChange={handleInput} name="LastName" defaultValue={userData.LastName}></input><br></br>
                UserName: <input onChange={handleInput} name="UserName" defaultValue={userData.UserName}></input><br></br>
                SessionTimeOut: <input onChange={handleInput} name="SessionTimeOut" defaultValue={userData.SessionTimeOut}></input><br></br>
                CreatedDate: <input type="text" value={userData.CreatedDate} readonly></input><br></br>
                View Subscriptions:  <input onChange={manipulateCheckBox} checked={vSub} name="View Subscriptions" type="checkbox" /> <br></br>
                Create Subscriptions:  <input onChange={manipulateCheckBox} name="Create Subscriptions" checked={checkIfCheck("Create Subscriptions")} type="checkbox" /> <br></br>
                Delete Subscriptions:  <input onChange={manipulateCheckBox} name="Delete Subscriptions" checked={checkIfCheck("Delete Subscriptions")} type="checkbox" /><br></br>
                Update Subscriptions:  <input onChange={manipulateCheckBox} name="Update Subscriptions" checked={checkIfCheck("Update Subscriptions")} type="checkbox" /><br></br>
                View Movies:  <input onChange={manipulateCheckBox} name="View Movies" type="checkbox" checked={vMovie} /><br></br>
                Create Movies:  <input onChange={manipulateCheckBox} name="Create Movies" type="checkbox" checked={checkIfCheck("Create Movies")} /><br></br>
                Delete Movies:  <input onChange={manipulateCheckBox} name="Delete Movies" type="checkbox" checked={checkIfCheck("Delete Movies")} /><br></br>
                Update Movies:  <input onChange={manipulateCheckBox} name="Update Movies" type="checkbox" checked={checkIfCheck("Update Movies")} /><br></br>
                <button onClick={saveEdit}>Update</button> <button onClick={toAllUsers}>Cancel</button>
            </div>
        </div>
        )
    } else return null



}

export default EditUser;
