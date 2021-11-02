import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { MembersService } from "../services/members.service";
import { MoviesService } from "../services/movies.service";
import { UserService } from "../services/user.service";
import NewSub from "./addSub/newSub";

function Subscriptions() {
  let { membername } = useParams();
  const [showAllMembers, setShowAllMembers] = useState(false)
  const [allMembers, setAllMembers] = useState([])
  const [showNewSub, setShowNewSub] = useState([])
  const [viewSub, setViewSub] = useState(false)
  const [createSub, setCreateSub] = useState(false)
  const [deleteSub, setDeleteSub] = useState(false)
  const [updateSub, setUpdateSub] = useState(false)
  const [showMoviesList, setShowMoviesList] = useState(false)
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
      alert("something went wrong. perhaps your time is up. please relogin. ")
      dispatch({ type: "LOGOUT" })
    }
  }
  useEffect(() => {
    getAllMembers()
    isAdminLoggedIn()
  }, [])

  useEffect(() => {
    limitUser()
  }, [isAdmin, loading])
  async function limitUser() {
    let response = await UserService.getAllUsersData()
    let loggedInUserDetails = response.data.find(user => user.id === state.id)
    if (isAdmin) {
      setLoading(false)
      setViewSub(true)
      setCreateSub(true)
      setDeleteSub(true)
      setUpdateSub(true)
      setShowMoviesList(true)
    } else if (loggedInUserDetails !== undefined) {
      setLoading(false)
      if (loggedInUserDetails.Permissions.includes('View Subscriptions')) setViewSub(true)
      if (loggedInUserDetails.Permissions.includes('Create Subscriptions')) { setCreateSub(true); setShowMoviesList(true) }
      if (loggedInUserDetails.Permissions.includes('Delete Subscriptions')) setDeleteSub(true)
      if (loggedInUserDetails.Permissions.includes('Update Subscriptions')) setUpdateSub(true)
    }
  }
  async function isAdminLoggedIn() {
    setLoading(false)
    let response = await UserService.getAllUsers()
    if (state.id === response.data[0]._id) {
      setIsAdmin(true)
    }
  }

  useEffect(() => {
    indexSubs()
  }, [allMembers])

  function indexSubs() {
    let copyArr = []
    allMembers.forEach(() => {
      copyArr.push(false)
    })
    setShowNewSub(copyArr)
  }


  function showMembers() {
    setShowAllMembers(!showAllMembers)
  }
  async function getAllMembers() {
    let allMembers = await MembersService.getAllMembers()
    if (membername === undefined) setAllMembers(allMembers)
    else {
      allMembers = allMembers.filter(member => member.Name === membername)
      setAllMembers(allMembers)
      setShowAllMembers(!showAllMembers)
    }
  }

  function addMemberPage() {
    history.push('/AddMember')
  }

  function showSub(index) {
    let copyArr = [...showNewSub]
    copyArr[index] = (!(copyArr[index]))
    setShowNewSub(copyArr)

  }

  function deleteMember(memberName, moviesArr, memberId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete this member?")) {
      MembersService.deleteMember(memberId)
      MembersService.deleteSubscription(memberName)
      if (moviesArr.length > 0) moviesArr.forEach(movie => {
        MoviesService.deleteSingleInnerSub(memberName, movie.movieId)
      })
    }
  }
  if (loading) return null
  else if ((!viewSub && !loading) || !state.isLoggedIn) {
    return (<div>You are not allowed to view this page.</div>)
  }
  if (showAllMembers) {

    if (allMembers.length > 1) {
      return (
        <div>
          Welcome, {state.name}
          <h1>Subscriptions</h1>
          <button onClick={showMembers}>All Members</button> {createSub && <button onClick={addMemberPage}>Add Member</button>}
          {allMembers.map((member, index) => {
              return (
                <div key={index} style={{ border: "3px solid black" }}>
                  <p><b>Name: {member.Name}</b></p>
                  <p>Email: {member.Email}</p>
                  <p>City: {member.City}</p>
                  {updateSub && <Link to={{
                    pathname: `/editMember/${member.Name}`
                  }}>Edit</Link>} {deleteSub && <button onClick={() => deleteMember(member.Name, member.MoviesArr, member._id)}>Delete</button>}
                  <div style={{ border: "1px solid black" }}>
                    <p><b>Movies Watched</b></p>
                    {showMoviesList && <button onClick={() => showSub(index)}>Subscribe to a new movie</button>}
                    {showNewSub[index] &&
                      <div style={{ border: "1px solid black" }}>

                        <NewSub id={allMembers[index]._id} name={allMembers[index].Name} />
                      </div>}
                    <br></br>
                    <div>
                      {member.MoviesArr.map((movie, index) =>
                        <div key={index}>
                          <li><Link to={{
                            pathname: `/Movies/${movie.movieName}`
                          }}>{movie.movieName}</Link> , {movie.date.split("T")[0]}</li>
                        </div>)}
                    </div>
                  </div>
                </div>
              )
          })}

        </div>
      );
    } else {
      return (
        <div>
          {allMembers.map((member, index) => {
            return (
              <div key={index} style={{ border: "3px solid black" }}>
                <p><b>Name: {member.Name}</b></p>
                <p>Email: {member.Email}</p>
                <p>City: {member.City}</p>
                {updateSub && <Link to={{
                  pathname: `/editMember/${member.Name}`
                }}>Edit</Link>} {deleteSub && <button onClick={() => deleteMember(member.Name, member.MoviesArr, member._id)}>Delete</button>}
                <div style={{ border: "1px solid black" }}>
                  <p><b>Movies Watched</b></p>
                  {showMoviesList && <button onClick={() => showSub(index)}>Subscribe to a new movie</button>}
                  {showNewSub[index] &&
                    <div style={{ border: "1px solid black" }}>

                      <NewSub id={allMembers[index]._id} name={allMembers[index].Name} />
                    </div>}
                  <br></br>
                  <div>
                    {member.MoviesArr.map((movie, index) =>
                      <div key={index}>
                        <li><Link to={{
                          pathname: `/Movies/${movie.movieName}`
                        }}>{movie.movieName}</Link> , {movie.date.split("T")[0]}</li>
                      </div>)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )
    }
  } else {
    return (
      <div>
        Welcome, {state.name}
        <h1>Subscriptions</h1>
        <button onClick={showMembers}>All Members</button> {createSub && <button onClick={addMemberPage}>Add Member</button>}
      </div>
    )
  }
}

export default Subscriptions;
