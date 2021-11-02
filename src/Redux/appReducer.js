















const appReducer = (state = { name: "", id: "", isLoggedIn: false }, action) => {
    switch (action.type) {
        case "SUBMIT":
            return { ...state, name: action.payload.UserName, id: action.payload.id, isLoggedIn: true }
        case "LOGOUT":
            return { ...state, name: "", id: "", isLoggedIn: false }
        default:
            return state
    }
}
export default appReducer;