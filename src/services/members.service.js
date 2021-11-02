let apiUrl = 'http://localhost:8001'
const axios = require('axios')
const fetchParams = {
    headers: {
        "x-access-token": localStorage['token']
    }
}
export class MembersService {
    static async getAllMembers() {
        const response = await axios.get(apiUrl + '/api/members/getAllMembersData')
        return response.data
    }
    static initiateToken() {
        axios.get(apiUrl + '/api/members/initiateToken', fetchParams)
    }
    static async getSpecificMemberById(memberId) {
        const response = await axios.get(apiUrl + '/api/members/getAllMembersData')
        let member = response.data.find(member => String(member._id) === String(memberId))
        return member
    }
    static async getSpecificMemberByName(memberName) {
        const response = await axios.get(apiUrl + '/api/members/getAllMembersData')
        let member = response.data.find(member => String(member.Name) === String(memberName))
        return member
    }
    static async getAllSubs() {
        const response = await axios.get(apiUrl + "/api/members/getAllSubs")
        return response.data
    }
    static editSub(MemberId, MemberName, movieId, date, movieName) {
        axios.put(apiUrl + '/api/members/editSub', {
            data: { MemberId: MemberId, MemberName: MemberName, movieId: movieId, date: date, movieName: movieName }
        })
    }
    static deleteSpecificSub(movieId, sub) {
        axios.delete(apiUrl + '/api/members/deleteInnerSingleSub', {
            data: { movieId: movieId, sub: sub }
        })
    }
    static async findSubToPush(memberId) {
        let allSubs = await this.getAllSubs()
        let sub = allSubs.find(sub => String(sub.MemberId) === memberId)
        if (sub !== undefined) return sub.Movies
        else return null
    }
    static editMember(memberObj, prevMemberName) {
        let response = axios.put(apiUrl + '/api/members/editMember', {
            data: { memberObj: memberObj, prevMemberName: prevMemberName }
        })
        return response
    }
    static addMember(memberObj) {
        axios.post(apiUrl + '/api/members/addMember', {
            data: { memberObj: memberObj }
        })
    }
    static deleteMember(memberId) {
        axios.delete(apiUrl + '/api/members/deleteMember', {
            data: { memberId }
        })
    }
    static deleteMovieFromSubArray(movieName, MemberId) {
        axios.delete(apiUrl + '/api/members/deleteMovieFromSubArray', {
            data: { movieName, MemberId }
        })
    }
    static deleteSubscription(memberName) {
        axios.delete(apiUrl + '/api/members/deleteSubscription', {
            data: { memberName }
        })
    }
}