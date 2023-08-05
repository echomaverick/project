import React, { useState, useEffect } from "react";
import "./index.css";
import Home from "./components/pages/Home";
import AllUsers from "./components/users/AllUsers";
import AllTasks from "./components/tasks/AllTasks";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
  Redirect,
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
import Loader from "../src/components/layout/Loader";
import NavigationBar from "./components/layout/NavigationBar";
import NotFound from "../src/components/layout/NotFound";
import About from "./components/pages/About";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import { AuthContext } from "./components/layout/Auth";



function App(props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div>
          {isLoading && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
              }}
            >
              <Loader />
            </div>
          )}
          {!isLoading && (
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              {/* task routes */}
              <Route exact path="/tasks/:id" component={Task} />
              <Route exact path="/tasks" component={AllTasks} />
              <Route exact path="/task/add" component={AddTask} />
              <Route exact path="/tasks/edit/:id" component={EditTask} />

              {/* project routes*/}
              <Route exact path="/projects/:id" component={Projects} />
              <Route exact path="/projects" component={AllProjects} />
              <Route exact path="/projects/edit/:id" component={EditProject} />
              <Route exact path="/project/add" component={AddProject} />

              {/*user routes */}
              <Route exact path="/profile" component={User} />
              <Route exact path="/users" component={AllUsers} />
              <Route exact path="/user/add" component={AddUser} />
              <Route exact path="/users/edit/:id" component={EditUser} />
              <Route exact path="/users/:id" component={User} />


              <Route exact path="/login" component={Login}/>
              <Route exact path="/signup" component={Signup}/>
              <Route component={NotFound} />
              <Redirect to="/" />
            </Switch>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
