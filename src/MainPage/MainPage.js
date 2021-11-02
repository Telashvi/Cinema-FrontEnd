import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { UserService } from '../services/user.service';

function MainPage() {
    const state = useSelector(state => state)
    const [showUsersManagment, setShowUsersManagment] = useState(false)
    const dispatch = useDispatch()


    useEffect(() => {
        auth()
        isAdminLoggedIn()
    }, [])

    async function auth() {
        let responseStatus = await UserService.auth()
        if (responseStatus === 401 || responseStatus === 500) {
            dispatch({ type: "LOGOUT" })
        }
    }

    async function isAdminLoggedIn() {
        let response = await UserService.getAllUsers()
        if (state.id === response.data[0]._id) {
            setShowUsersManagment(true)
        }

    }

    function logout() {
        dispatch({ type: "LOGOUT" })
    }



    if (!state.isLoggedIn) return (<div>You are not allowed to view this page.</div>)

    return (
        <div>
            Welcome,  {state.name}
            <h1>Movies - Subscriptions Web Site </h1>
            <Link to="/Movies">Movies</Link> &nbsp;
            <Link to="/Subscriptions">Subscriptions</Link> &nbsp;
            {showUsersManagment && <Link to="/UsersManagement">Users Management</Link>} &nbsp;
            <Link onClick={logout} to="/login">Log Out</Link> &nbsp;
        </div>

    );
}

export default MainPage;
