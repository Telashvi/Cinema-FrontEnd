import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { MoviesService } from "../../services/movies.service"
import { UserService } from "../../services/user.service"

function AddMovie() {

  const [movieData, setMovieData] = useState()
  const [createMovie, setCreateMovie] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const history = useHistory()
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
    isAdminLoggedIn()
  }, [])

  useEffect(() => {
    limitUser()
  }, [isAdmin,loading])



  function handleInput(e) {
    let inputData = e.target.value
    let inputName = e.target.name
    let objCopy = { ...movieData }
    objCopy[inputName] = inputData
    setMovieData(objCopy)
  }

  async function isAdminLoggedIn() {
    setLoading(false)
    let response = await UserService.getAllUsers()
    if (state.id === response.data[0]._id) {
      setIsAdmin(true)
    }
  }
  async function limitUser() {
    let response = await UserService.getAllUsersData()
    let loggedInUserDetails = response.data.find(user => user.id === state.id)
    if (isAdmin) {
      setLoading(false)
      setCreateMovie(true)
    } else if (loggedInUserDetails !== undefined) {
      setLoading(false)
      if (loggedInUserDetails.Permissions.includes('Create Movies')) setCreateMovie(true)
    }
  }


  if (loading) return null
  else if ((!createMovie && !loading) || !state.isLoggedIn) return (<div>You are not allowed to view this page.</div>)
  function toAllMovies() {
    history.push('/Movies')
  }

  async function addMovie() {
    let response = await MoviesService.addMovie(movieData)
    alert(response.data);
  }


  return (
    <div>
      Welcome, {state.name}
      <h1>Movies</h1>
      Name: <input onChange={handleInput} name="Name" ></input><br></br>
      Genres: <input onChange={handleInput} name="Genres" ></input><br></br>
      Image url: <input onChange={handleInput} name="ImageUrl" ></input><br></br>
      Premired: <input type="date" onChange={handleInput} name="Premired" ></input><br></br>
      <button onClick={addMovie}>Save</button> <button onClick={toAllMovies}>Cancel</button>
    </div>

  );
}

export default AddMovie;
