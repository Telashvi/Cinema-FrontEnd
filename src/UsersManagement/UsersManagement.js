import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserService } from '../services/user.service';
import { useDispatch, useSelector } from "react-redux";

function UsersManagement() {
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
    const [usersData, setUsersData] = useState([])
    const [showUsersManagment, setShowUsersManagment] = useState(false)
    useEffect(() => {
        isAdminLoggedIn()
    }, [])

  
    async function getAllUsersData() {
        let response = await UserService.getAllUsersData()
        setUsersData(response.data)
    }
     function erase(username) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to delete this user?")) {
            UserService.deleteUser(username)
        }
    }

    async function isAdminLoggedIn() {
        let response = await UserService.getAllUsers()
        if (state.id === response.data[0]._id) {
            setShowUsersManagment(true)
        }
    }
    if (!state.isLoggedIn) return (<div>You are not allowed to view this page.</div>)

    if (showUsersManagment) {
        return (
            <div>
                Welcome, {state.name}
                <h1>Users</h1>
                <button onClick={getAllUsersData}>All Users</button>
                <Link to="/AddUser">Add User</Link>
                {usersData.map((user, index) => {
                    let Permissions = ""
                    user.Permissions.forEach(perm => {
                        if (user.Permissions.length > 1 && perm !== user.Permissions[user.Permissions.length - 1]) Permissions += perm + ","
                        else Permissions += perm
                    })
                    return (
                        <div key={index} style={{ border: "1px solid black" }}>
                            <p>FirstName:{user.FirstName}</p>
                            <p>LastName:{user.LastName}</p>
                            <p>User Name:{user.UserName}</p>
                            <p>Session Time Out:{user.SessionTimeOut}</p>
                            <p>Created Date:{user.CreatedDate}</p>
                            <p>Permissions:{Permissions}</p>
                            <Link to={{ pathname: `/EditUser/${user.UserName}` }}>Edit</Link> <button onClick={() => erase(user.UserName)}>Delete</button>
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return (<div>You're not allowed to view this page.</div>)
    }

}

export default UsersManagement;
