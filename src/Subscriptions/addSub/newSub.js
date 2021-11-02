import { useEffect, useState } from "react";
import { MembersService } from "../../services/members.service";
import { MoviesService } from "../../services/movies.service";

function NewSub(props) {

  const [allMovies, setAllMovies] = useState([])
  const [currentSub, setCurrentSub] = useState()
  const [date, setDate] = useState()
  const [choosenMovieId, setChoosenMovieId] = useState()
  const [choosenMovieName, setChoosenMovieName] = useState()
  const [filteredAllMovies, setFilteredAllMovies] = useState([])
  useEffect(() => {
    getAllMovies()
    getAllSubs()
  }, [])

  useEffect(() => {
    setFirstOption()
  }, [allMovies, currentSub])
  async function getAllMovies() {
    let allMovies = await MoviesService.getAllMovies()
    setAllMovies(allMovies)
  }

  async function getAllSubs() {
    let allSubs = await MembersService.getAllSubs()
    let sub = allSubs.find(sub => sub.MemberId === props.id)
    setCurrentSub(sub)
  }
  function setFirstOption() {
    let filteredAllMovies = allMovies.filter(movie => {
      let isSubbed
      if (currentSub !== undefined) isSubbed = currentSub.Movies.find(mov => String(mov.movieId) === String(movie._id))
      return isSubbed === undefined
    })
    if (filteredAllMovies.length > 0) {
      setChoosenMovieId(filteredAllMovies[0]._id)
      setChoosenMovieName(filteredAllMovies[0].Name)
      setFilteredAllMovies(filteredAllMovies)
    }
  }
  function handleInput(e) {
    setDate(e.target.value)
  }

  function setOption(e) {
    setChoosenMovieId(e.target.value.split(",")[0])
    setChoosenMovieName(e.target.value.split(",")[1])
  }

  function saveSub(MemberId, MemberName, movieId, date, movieName) {
    MembersService.editSub(MemberId, MemberName, movieId, date, movieName)
  }


  return (
    <div>
      <label for="movies">Add a new movie:</label> <br></br>
      <select onChange={setOption} name="movies" id="movies">
        {filteredAllMovies.map((movie,index) => {
          return (
            <option key={index} value={[String(movie._id),movie.Name]} >{movie.Name}</option>
          )
        }
        )}
      </select>    &nbsp;
      <input type="date" onChange={handleInput} ></input><br></br>
      <button onClick={() => saveSub(props.id, props.name, choosenMovieId, date, choosenMovieName)}>Subscribe</button>
    </div>
  );
}

export default NewSub;
