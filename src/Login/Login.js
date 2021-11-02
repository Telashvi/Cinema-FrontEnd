import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { UserService } from '../services/user.service';
import { useDispatch } from "react-redux";
import { MembersService } from '../services/members.service';
import { MoviesService } from '../services/movies.service';

function Login() {
  const history = useHistory();
  const [UserName, setUserName] = useState()
  const [Password, setPassword] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    logout()
  }, [])


  async function submit() {
    try {
      let creds = { UserName: UserName, Password: Password }
      let response = await UserService.login(creds)
      let tokenData = response.data.token
      localStorage['token'] = tokenData
      let id = await UserService.getUserIdByUserName(UserName)
      dispatch({ type: "SUBMIT", payload: { UserName, id } })
      MembersService.initiateToken()
      MoviesService.initiateToken()
      history.push("/MainPage")
    }
    catch (err) {
      alert(err.response.data.message)
    }

  }

  function logout() {
    dispatch({ type: "LOGOUT" })
  }

  return (
    <div>
      <h1>Movies - Subscriptions Web Site</h1>
      <p>Login Page</p><br></br>
      User name: <input onChange={(e) => { setUserName(e.target.value) }}></input><br></br>
      Password: <input onChange={(e) => { setPassword(e.target.value) }}></input><br></br>
      <button onClick={submit}>Login</button><br></br>
      New User? <Link to="/CreateAccount">Create account</Link>

    </div>

  );
}

export default Login;
