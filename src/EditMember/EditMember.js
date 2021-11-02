import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { MembersService } from "../services/members.service";
import { UserService } from "../services/user.service";

function EditMember() {
    const { membername } = useParams()
    const [memberData, setMemberData] = useState([])
    const [isAdmin,setIsAdmin]=useState(null)
    const [editMember,setEditMember]=useState(false)
    const state = useSelector(state => state)
    let history = useHistory()
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
            setEditMember(true)
        } else if (loggedInUserDetails !== undefined) {
            if (loggedInUserDetails.Permissions.includes('Update Subscriptions')) setEditMember(true)
        }
    }
    useEffect(() => {
        initiateMemberData()
    }, [])

    async function initiateMemberData() {
        let memberDetails = await MembersService.getSpecificMemberByName(membername)
        setMemberData(memberDetails)
    }



    function handleInput(e) {
        let inputData = e.target.value
        let inputName = e.target.name
        let objCopy = { ...memberData }
        objCopy[inputName] = inputData
        setMemberData(objCopy)
    }

    function updateMember() {
        MembersService.editMember(memberData, membername)
        history.push("/editMember/"+String(memberData.Name));
    }

    function backToAllSubs() {
        history.push("/Subscriptions");
    }
    if (!state.isLoggedIn || !editMember) return (<div>You are not allowed to view this page.</div>)

    return (
        <div>
            Welcome, {state.name}
            <h1>Members</h1>
            <h1>Edit member : {membername}</h1>
            Name: <input onChange={handleInput} name="Name" defaultValue={memberData.Name}></input><br></br>
            Email: <input onChange={handleInput} name="Email" defaultValue={memberData.Email}></input><br></br>
            City: <input onChange={handleInput} name="City" defaultValue={memberData.City}></input><br></br>
            <button onClick={updateMember}>Update</button> <button onClick={backToAllSubs}>Cancel</button>
        </div>

    );

}

export default EditMember;
