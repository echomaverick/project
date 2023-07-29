import React from "react";
import "./index.css";
import '../src/components/styles/Navbar.css'
import Home from "./components/pages/Home";
import AllUsers from "./components/users/AllUsers";
import AllTasks from "./components/tasks/AllTasks";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import EditUser from "./components/users/EditUser";
import User from "./components/users/User";
import Task from "./components/tasks/Task";
import AddTask from "./components/tasks/AddTask";
import EditTask from "./components/tasks/EditTask";
import Projects from "./components/projects/Project";
import AllProjects from "./components/projects/AllProjects";
import EditProject from "./components/projects/EditProject";
import AddProject from "./components/projects/AddProject";
import AddUser from "./components/users/AddUser";
import Navbar from "./components/layout/Navbar";

function App(props) {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Switch>
          <Route exact path="/" component={Home} />
          /* task routes */
          <Route exact path="/tasks/:id" component={Task}/>
          <Route exact path="/tasks" component={AllTasks} />
          <Route exact path="/task/add" component={AddTask} /> 
          <Route exact path="/tasks/edit/:id" component={EditTask} />


          /* project routes*/
          <Route exact path="/projects/:id" component={Projects}/>
          <Route exact path="/projects" component={AllProjects}/>
          <Route exact path="/projects/edit/:id" component={EditProject}/>
          <Route exact path="/project/add" component={AddProject}/>



          /*user routes */
          <Route exact path="/profile" component={User} />
          <Route exact path="/users" component={AllUsers} />
          <Route exact path="/user/add" component={AddUser} />
          <Route exact path="/users/edit/:id" component={EditUser} />
          <Route exact path="/users/:id" component={User} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
