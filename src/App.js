import Login from './Login/Login';
import CreateAccount from './CreateAccount/CreateAccount';
import MainPage from './MainPage/MainPage';
import UsersManagement from './UsersManagement/UsersManagement';
import AddUser from './UsersManagement/AddUser/AddUser';
import EditUser from './UsersManagement/EditUser/EditUser';
import { Switch, Route, Redirect } from 'react-router-dom';
import Movies from './Movies/Movies';
import EditMovie from './Movies/EditMovie/EditMovie';
import Subscriptions from './Subscriptions/Subscriptions';
import AddMovie from './Movies/AddMovie/AddMovie';
import EditMember from './EditMember/EditMember';
import AddMember from './AddMember/AddMember';


function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/CreateAccount">
        <CreateAccount />
      </Route>
      <Route path="/MainPage">
        <MainPage />
      </Route>
      <Route path="/UsersManagement">
        <UsersManagement />
      </Route>
      <Route path="/AddUser">
        <AddUser />
      </Route>
      <Route path="/EditUser/:username">
        <EditUser />
      </Route>
      <Route path="/Movies/:moviename">
        <Movies />
      </Route>
      <Route path="/Movies">
        <Movies />
      </Route>
      <Route path="/EditMovie/:moviename">
        <EditMovie />
      </Route>
      <Route path="/Subscriptions/:membername">
        <Subscriptions />
      </Route>
      <Route path="/Subscriptions">
        <Subscriptions />
      </Route>
      <Route path="/addMovie">
        <AddMovie />
      </Route>
      <Route path="/editMember/:membername">
        <EditMember />
      </Route>
      <Route path="/addMember">
        <AddMember/>
      </Route>
    </Switch>
  );
}

export default App;
