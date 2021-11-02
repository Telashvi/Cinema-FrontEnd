
let apiUrl = 'http://localhost:8000'
const axios = require('axios')

const fetchParams = {
    headers: {
        "x-access-token": localStorage['token']
    }
}



export class UserService {
    static async auth() {
        try {
            let response = await axios.get(apiUrl + '/api/subs/authFrontEnd', fetchParams)
            return response.status
        }
        catch (err) { return err.response.status }
    }


    static login(creds) {
        return axios.post(apiUrl + '/api/subs/login', {
            data: { creds }
        })
    }
    static UserNameCheckInDB(creds) {
        return axios.post(apiUrl + '/api/subs/checkUserName', {
            data: { creds, token: localStorage['token'] }
        })
    }

    static saveUser(creds) {
        return axios.post(apiUrl + '/api/subs/checkUserName', {
            data: { creds, token: localStorage['token'] }
        })
    }


    static async addUser(creds) {
        let response = await axios.post(apiUrl + '/api/subs/addUser', {
            data: { creds, token: localStorage['token'] }
        })
        return response
    }
    static async getAllUsersData() {
        const response = await axios.get(apiUrl + '/api/subs/getAllUsersData', {
            headers: {
                "x-access-token": localStorage['token']
            }
        })
        return response
    }
    static async editUser(userObj, userId) {
        let response = await axios.put(apiUrl + '/api/subs/editUser', {
            data: { userObj: userObj, userId: userId, token: localStorage['token'] }
        })
        return response
    }
    static deleteUser(username) {
        axios.delete(apiUrl + '/api/subs/deleteUser', {
            data: { username: username, token: localStorage['token'] }
        })
    }
    static async getAllUsers() {
        const response = await axios.get(apiUrl + '/api/subs/getAllUsers', fetchParams)
        return response
    }
    static async getUserIdByUserName(name) {
        let response = await this.getAllUsers()
        let allUsers = response.data
        let user = allUsers.find(user => user.UserName === name)
        return user._id
    }
    static async getUserDataPermissionsById(id) {
        let response = await this.getAllUsersData()
        let allUsers = response.data
        let user = allUsers.find(user => user.id === id)
        return user.Permissions
    }

    static async getUserTimeById(id) {
        let time = await axios.get(apiUrl + '/api/subs/getUserTimeById/' + id, fetchParams)
        return time.data
    }
}