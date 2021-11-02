import { useState } from 'react';
import { UserService } from '../services/user.service';
import { useHistory } from 'react-router-dom';

function CreateAccount() {
    const history = useHistory();
    const [UserName, setUserName] = useState()
    const [Password, setPassword] = useState()

    async function check() {
        try {
            let creds = {
                UserName: UserName,
                Password: Password
            }
            let result = await UserService.UserNameCheckInDB(creds)
            if (result.status === 200) {
                alert("Password added successfuly")
                history.push("/login");
            }
        } catch (err) {
            alert(err.response.data)
        }


    }
    return (
        <div>
            <h1>Movies - Subscriptions Web Site</h1>
            <p>Create an Account</p><br></br>

            User name: <input onChange={(e) => { setUserName(e.target.value) }}></input><br></br>
            Password: <input onChange={(e) => { setPassword(e.target.value) }}></input><br></br>
            <button onClick={check}>Create</button>
        </div>

    );
}

export default CreateAccount;
