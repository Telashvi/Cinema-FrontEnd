import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { MoviesService } from "../services/movies.service"
import { MembersService } from "../services/members.service"
import { useDispatch, useSelector } from "react-redux";
import { UserService } from "../services/user.service";

function Movies() {

    const [allMoviesAndSubs, setAllMoviesAndSubs] = useState([])
    const [queryToSearchUpon, setQueryToSearchUpon] = useState()
    const [sourceAllMoviesAndSubs, setSourceAllMoviesAndSubs] = useState()
    const [viewMovie, setViewMovie] = useState(false)
    const [createMovie, setCreateMovie] = useState(false)
    const [deleteMovie, setDeleteMovie] = useState(false)
    const [updateMovie, setUpdateMovie] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [find, setFind] = useState(false)
    const { moviename } = useParams()
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
        getAllSubs()
        isAdminLoggedIn()
    }, [])
    useEffect(() => {
        limitUser()
    }, [isAdmin])
    async function limitUser() {
        let response = await UserService.getAllUsersData()
        let loggedInUserDetails = response.data.find(user => user.id === state.id)
        if (isAdmin) {
            setViewMovie(true)
            setCreateMovie(true)
            setDeleteMovie(true)
            setUpdateMovie(true)
        } else if (loggedInUserDetails !== undefined) {
            if (loggedInUserDetails.Permissions.includes('View Movies')) setViewMovie(true)
            if (loggedInUserDetails.Permissions.includes('Create Movies')) setCreateMovie(true)
            if (loggedInUserDetails.Permissions.includes('Delete Movies')) setDeleteMovie(true)
            if (loggedInUserDetails.Permissions.includes('Update Movies')) setUpdateMovie(true)
        }
    }

    async function isAdminLoggedIn() {
        setLoading(false)
        let response = await UserService.getAllUsers()
        if (state.id === response.data[0]._id) {
            setIsAdmin(true)
        }
    }

    async function getAllSubs() {
        let allMovies = await MoviesService.getAllMovies()
        if (moviename === undefined) {
            setAllMoviesAndSubs(allMovies)
            setSourceAllMoviesAndSubs(allMovies)
            setFind(true)
        } else {
            let allMovies2 = allMovies.filter(movie => movie.Name === moviename)
            setAllMoviesAndSubs(allMovies2)
            setSourceAllMoviesAndSubs(allMovies2)
        }
    }

    async function toAll() {
        let allMovies = await MoviesService.getAllMovies()
        setAllMoviesAndSubs(allMovies)
        setSourceAllMoviesAndSubs(allMovies)
        setFind(true)
        history.push('/Movies')

    }

    function toAdd() {
        history.push('/addMovie')
    }

    function handleFindMovie(e) {
        setQueryToSearchUpon(e.target.value)
    }

    function findMovie() {
        let sortedArray = sourceAllMoviesAndSubs.filter(movie => movie.Name.includes(queryToSearchUpon))
        setAllMoviesAndSubs(sortedArray)
    }

    function deleteAMovie(movieId, subsArr, movieName) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to delete this movie?")) {
            MoviesService.deleteAMovie(movieId)
            if (subsArr !== undefined) for (let sub of subsArr) {
                MembersService.deleteSpecificSub(movieId, sub)
                MembersService.deleteMovieFromSubArray(movieName, sub.MemberId)
            }
        }
    }
    if (loading) {
        return null
    }
    else if ((!viewMovie && !loading) || !state.isLoggedIn) {
        return (<div>You are not allowed to view this page.</div>)
    }
    else return (
        <div>
            Welcome, {state.name}
            <h1>Movies</h1>
            <button onClick={toAll}>All Movies</button> {createMovie && <button onClick={toAdd}>Add Movie</button>} {find && <input onChange={handleFindMovie}></input>} {find && <button onClick={findMovie}>Find</button>}
            {allMoviesAndSubs.map((movie,index) => {
                let genres = ""
                movie.Genres.forEach(genre => {
                    if (genre !== movie.Genres[movie.Genres.length - 1])
                        genres += genre + ","
                    else genres += genre
                })
                let PremieredYear = movie.Premiered.split("-")[0]
                if (movie.subsArr !== undefined && movie.subsArr.length > 0) {
                    let subsToReturn = movie.subsArr.map(sub => {
                        return sub.Movies.map((movie,index) => {
                            let date = movie.date.split('T')[0]
                            return (
                                <div key={index}>
                                    <li><Link to={{ pathname: `/Subscriptions/${sub.MemberName}` }}>{sub.MemberName}</Link>,{date}</li>
                                </div>
                            )
                        })
                    })
                    return (
                        <div key={index} style={{ border: "1px solid black" }}>
                            <p>{movie.Name + "," + PremieredYear}</p>
                            <p>genres:{genres}</p>
                            <img src={movie.Image} alt=""></img>
                            <div>
                                <p>Subscriptions watched</p>
                                {subsToReturn.map(sub => sub)}
                            </div>
                            {updateMovie && <Link to={{
                                pathname: `/editMovie/${movie.Name}`
                            }}>Edit</Link>} {deleteMovie && <button onClick={() => deleteAMovie(movie._id, movie.subsArr, movie.Name)}>Delete</button>}
                        </div>
                    )
                } else {
                    return (
                        <div key={index} style={{ border: "1px solid black" }}>
                            <p>{movie.Name + "," + PremieredYear}</p>
                            <p>genres:{genres}</p>
                            <img src={movie.Image} alt=""></img>
                            <div>
                                <p>Subscriptions watched</p>
                            </div>
                            {updateMovie && <Link to={{
                                pathname: `/editMovie/${movie.Name}`
                            }}>Edit</Link>} {deleteMovie && <button onClick={() => deleteAMovie(movie._id, movie.subsArr, movie.Name)}>Delete</button>}
                        </div>
                    )
                }

            })}
        </div>
    )

}

export default Movies;
