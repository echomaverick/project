import React, { useState, useEffect, useContext } from "react";
import "./index.css";
import Home from "./components/pages/Home";
import AllUsers from "./components/users/AllUsers";
import AllTasks from "./components/tasks/AllTasks";
import {
  BrowserRouter as Router,
  Route,
  Switch,
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
import { AuthContext, AuthProvider } from "./components/layout/Auth";
import UserTasks from "./components/tasks/UserTask";
import AddUserTask from "./components/tasks/AddUserTask";
import AddUserProject from "./components/projects/AddUserProject";
import UserProject from "./components/projects/UserProject";
import ConfirmationPage from "./components/pages/ConfirmSubscripiton";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <AuthProvider>
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
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />

                {user ? (
                  <>
                    {/* task routes */}
                    <Route exact path="/usertask/add" component={AddUserTask} />
                    <Route
                      exact
                      path="/tasks/user/:username"
                      component={UserTasks}
                    />
                    <Route exact path="/tasks/:id" component={Task} />
                    <Route exact path="/tasks" component={AllTasks} />
                    <Route exact path="/task/add" component={AddTask} />
                    <Route exact path="/tasks/edit/:id" component={EditTask} />

                    {/* project routes*/}
                    <Route
                      exact
                      path="/userproject/add"
                      component={AddUserProject}
                    />
                    <Route
                      exact
                      path="/projects/user/:username"
                      component={UserProject}
                    />
                    <Route exact path="/projects/:id" component={Projects} />
                    <Route exact path="/projects" component={AllProjects} />
                    <Route
                      exact
                      path="/projects/edit/:id"
                      component={EditProject}
                    />
                    <Route exact path="/project/add" component={AddProject} />

                    {/*user routes */}
                    <Route exact path="/profile" component={User} />
                    <Route exact path="/users" component={AllUsers} />
                    <Route exact path="/user/add" component={AddUser} />
                    <Route exact path="/users/edit/:id" component={EditUser} />
                    <Route exact path="/users/:id" component={User} />

                    <Route
                      path="/confirm/:email"
                      component={ConfirmationPage}
                    />
                  </>
                ) : (
                  <Redirect to="/login" />
                )}

                <Route component={NotFound} />
              </Switch>
            )}
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
