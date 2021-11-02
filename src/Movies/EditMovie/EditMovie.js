import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { MoviesService } from "../../services/movies.service";
import { UserService } from "../../services/user.service";

function EditMovie() {
  const { moviename } = useParams()
  const [movieData, setMovieData] = useState()
  const [genres, setGenres] = useState()
  const [isAllowed, setIsAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const history = useHistory()
  const state = useSelector(state => state)
  useEffect(() => {
    setLoading(false)
    initiateMovieData()
    checkIfIsAllowedToView()

  }, [])


  async function checkIfIsAllowedToView() {
    let response = await UserService.getAllUsers()
    if (state.id === response.data[0]._id) {
      setIsAllowed(true)
      return
    }
    let permissions = await UserService.getUserDataPermissionsById(state.id)
    if (permissions.includes('Update Movies')) {
      setIsAllowed(true)
    }
  }

  async function initiateMovieData() {
    let specificMovie = await MoviesService.getSpecificMovie(moviename)
    setMovieData(specificMovie)
    setGenres(specificMovie.Genres)
  }



  function handleInput(e) {
    let inputData = e.target.value
    let inputName = e.target.name
    let objCopy = { ...movieData }
    objCopy[inputName] = inputData
    setMovieData(objCopy)
  }

  async function editMovie() {
    let response = await MoviesService.editMovie(movieData,moviename)
    alert(response.data)
    history.push('/Movies')
  }

  function toAllMovies() {
    history.push('/Movies')
  }
  if (loading) return null
  if (!state.isLoggedIn || !isAllowed) return (<div>You are not allowed to view this page.</div>)

  if (movieData !== undefined && genres !== undefined) {

    return (
      <div>
        Welcome, {state.name}

        <h1>Movies</h1>
        Name: <input onChange={handleInput} name="Name" defaultValue={movieData.Name} ></input><br></br>
        Genres: <input onChange={handleInput} name="Genres" defaultValue={genres.join()}></input><br></br>
        Image url: <input onChange={handleInput} name="Image" defaultValue={movieData.Image}></input><br></br>
        Premired: <input type="date" onChange={handleInput} name="Premiered" defaultValue={movieData.Premiered.split("T")[0]}></input><br></br>
        <button onClick={editMovie}>Save</button> <button onClick={toAllMovies}>Cancel</button>

      </div>
    )
  } else return null
}

export default EditMovie;
