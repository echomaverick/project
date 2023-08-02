// import React, { useState, useEffect } from "react";
// import "./index.css";
// import Home from "./components/pages/Home";
// import AllUsers from "./components/users/AllUsers";
// import AllTasks from "./components/tasks/AllTasks";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   withRouter,
//   Redirect,
// } from "react-router-dom";
// import EditUser from "./components/users/EditUser";
// import User from "./components/users/User";
// import Task from "./components/tasks/Task";
// import AddTask from "./components/tasks/AddTask";
// import EditTask from "./components/tasks/EditTask";
// import Projects from "./components/projects/Project";
// import AllProjects from "./components/projects/AllProjects";
// import EditProject from "./components/projects/EditProject";
// import AddProject from "./components/projects/AddProject";
// import AddUser from "./components/users/AddUser";
// import Loader from "../src/components/layout/Loader";k
// import NavigationBar from "./components/layout/NavigationBar";
// import Login from "./components/layout/Login";
// import NotFound from "../src/components/layout/NotFound";
// function App(props) {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 2000);
//   }, []);

//   return (
//     <Router>
//       <div className="App">
//         <NavigationBar />
//         <div>
//           {isLoading && (
//             <div
//               style={{
//                 position: "fixed",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 zIndex: 9999,
//               }}
//             >
//               <Loader />
//             </div>
//           )}
//           {!isLoading && (
//             <Switch>
//               <Route exact path="/" component={Home} />
//               {/* task routes */}
//               <Route exact path="/tasks/:id" component={Task} />
//               <Route exact path="/tasks" component={AllTasks} />
//               <Route exact path="/task/add" component={AddTask} />
//               <Route exact path="/tasks/edit/:id" component={EditTask} />

//               {/* project routes*/}
//               <Route exact path="/projects/:id" component={Projects} />
//               <Route exact path="/projects" component={AllProjects} />
//               <Route exact path="/projects/edit/:id" component={EditProject} />
//               <Route exact path="/project/add" component={AddProject} />

//               {/*user routes */}
//               <Route exact path="/profile" component={User} />
//               <Route exact path="/users" component={AllUsers} />
//               <Route exact path="/user/add" component={AddUser} />
//               <Route exact path="/users/edit/:id" component={EditUser} />
//               <Route exact path="/users/:id" component={User} />

//               {/*login */}
//               <Route exact path="/login" component={Login} />

//               <Route component={NotFound} />
//               <Redirect to="/" />
//             </Switch>
//           )}
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;
// App.js
import React, { useState, useEffect } from "react";
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
import Login from "./components/layout/Login";
import NotFound from "../src/components/layout/NotFound";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Simulate an asynchronous login check
    setTimeout(() => {
      const user = checkLoggedInUser(); // Your function to check the user's login status
      setIsLoggedIn(user.isLoggedIn);
      setUsername(user.username);
      setIsLoading(false);
    }, 2000);
  }, []);

  // Function to check the user's login status
  const checkLoggedInUser = () => {
    // Your logic to check if the user is logged in
    // For now, I'm using a simple check with a username
    const loggedInUser = { isLoggedIn: false, username: '' };

    const storedUsername = localStorage.getItem('username');
    if (storedUsername === 'admin') {
      loggedInUser.isLoggedIn = true;
      loggedInUser.username = storedUsername;
    }

    return loggedInUser;
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear the username from localStorage and reset isLoggedIn state
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  // Custom ProtectedRoute component to handle protected routes
  const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );

  return (
    <Router>
      <div className="App">
        <NavigationBar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />
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
              <Route exact path="/login">
                {isLoggedIn ? <Redirect to="/users" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
              </Route>
              <ProtectedRoute exact path="/users" component={AllUsers} />
              <ProtectedRoute exact path="/user/add" component={AddUser} />
              <ProtectedRoute exact path="/users/edit/:id" component={EditUser} />
              <ProtectedRoute exact path="/users/:id" component={User} />

              <ProtectedRoute exact path="/tasks/:id" component={Task} />
              <ProtectedRoute exact path="/tasks" component={AllTasks} />
              <ProtectedRoute exact path="/task/add" component={AddTask} />
              <ProtectedRoute exact path="/tasks/edit/:id" component={EditTask} />

              <ProtectedRoute exact path="/projects/:id" component={Projects} />
              <ProtectedRoute exact path="/projects" component={AllProjects} />
              <ProtectedRoute exact path="/projects/edit/:id" component={EditProject} />
              <ProtectedRoute exact path="/project/add" component={AddProject} />

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
