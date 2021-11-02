import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { MembersService } from "../services/members.service";
import { UserService } from "../services/user.service";

function AddMember() {
    const history = useHistory();
    const [memberData, setMemberData] = useState()
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const [isAdmin, setIsAdmin] = useState(null)
    const [createMember, setCreateMember] = useState(false)
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
        isAdminLoggedIn()
    }, [])

    useEffect(() => {
        limitUser()
    }, [isAdmin])
    async function isAdminLoggedIn() {
        let response = await UserService.getAllUsers()
        if (state.id === response.data[0]._id) {
            setIsAdmin(true)
        } else setIsAdmin(false)
    }
    async function limitUser() {
        let response = await UserService.getAllUsersData()
        let loggedInUserDetails = response.data.find(user => user.id === state.id)
        if (isAdmin) {
            setCreateMember(true)
        } else if (loggedInUserDetails !== undefined) {
            if (loggedInUserDetails.Permissions.includes('Create Subscriptions')) setCreateMember(true)
        }
    }

    function handleInput(e) {
        let inputData = e.target.value
        let inputName = e.target.name
        let objCopy = { ...memberData }
        objCopy[inputName] = inputData
        setMemberData(objCopy)
    }

    function addMember() {
        MembersService.addMember(memberData)
        history.push("/Subscriptions");
    }

    function backToAllSubs() {
        history.push("/Subscriptions");
    }
    if (!state.isLoggedIn || !createMember) return (<div>You are not allowed to view this page.</div>)
    return (
        <div>
            Welcome, {state.name}
            <h1>Members</h1>
            <h1>Add member</h1>
            Name: <input onChange={handleInput} name="Name" ></input><br></br>
            Email: <input onChange={handleInput} name="Email" ></input><br></br>
            City: <input onChange={handleInput} name="City" ></input><br></br>
            <button onClick={addMember}>Add</button> <button onClick={backToAllSubs}>Cancel</button>
        </div>

    );

}

export default AddMember;
