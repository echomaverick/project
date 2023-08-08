import React, { useState, useEffect } from "react";
import { useParams, Redirect, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const Task = () => {
  console.log("Task1");
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState({
    title: "",
    description: "",
    users: [],
    projects: []
  });

  const { id } = useParams();
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    if (!objectIdRegex.test(id)) {
      setLoading(false);
      console.log("Invalid task ID");
      setTask(null);
      return;
    }

    try {
      console.log("Fetching task data...");
      const res = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      console.log("Task data:", res.data);
      setTask(res.data);

      if (res.data.assignedTo && res.data.assignedTo.length > 0) {
        const assignedUsersPromises = res.data.assignedTo.map(async (userId) => {
          console.log("User id", userId);
          const userRes = await axios.get(
            `http://localhost:5000/api/users/${userId["_id"]}`
          );
          return userRes.data;
        });
        const assignedUsersData = await Promise.all(assignedUsersPromises);
        setTask((prevState) => ({
          ...prevState,
          assignedTo: assignedUsersData,
        }));
      }

      if (res.data.projects && res.data.projects.length > 0) {
        const associatedProjectsPromises = res.data.projects.map(
          async (projectId) => {
            const projectRes = await axios.get(
              `http://localhost:5000/api/projects/${projectId["_id"]}`
            );
            return projectRes.data;
          }
        );
        const associatedProjectsData = await Promise.all(
          associatedProjectsPromises
        );
        setTask((prevState) => ({
          ...prevState,
          projects: associatedProjectsData,
        }));
      }

      setLoading(false);
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
      setTask(null);
    }
  };

  // if (!task) {
  //   return <Redirect to="/not-found" />;
  // }

  return (
    <div className="container py-4">
    {loading ? (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    ) : (
      <>
        <Link className="btn btn-primary mb-4" to={`/tasks/user/${task.assignedTo[0].username}`}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Go back to tasks
        </Link>
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-4">
              <div className="card-body">
                <h2>Title: {task.title}</h2>
                <p>
                  <strong>Description:</strong> {task.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h4>Assigned Users:</h4>
                {task.assignedTo && task.assignedTo.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {task.assignedTo.map((user) => (
                      <li key={user._id} className="list-group-item">
                        <p>
                          <strong>Name:</strong> {user.name}
                        </p>
                        <p>
                          <strong>Username:</strong> {user.username}
                        </p>
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No users assigned to this task.</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h4>Associated Projects:</h4>
                {task.projects && task.projects.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {task.projects.map((project) => (
                      <li key={project._id} className="list-group-item">
                        <p>
                          <strong>Project name:</strong> {project.name}
                        </p>
                        <p>
                          <strong>Project description:</strong>{" "}
                          {project.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No projects associated with this task.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);
};

export default Task;



// import React, { useState, useEffect, useContext } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import { AuthContext } from "../layout/Auth";

// const Task = () => {
//   const { user } = useContext(AuthContext);
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);

//   const { id } = useParams();
//   const objectIdRegex = /^[0-9a-fA-F]{24}$/;

//   useEffect(() => {
//     if (user) {
//       fetchTasksForUser(user.username);
//     }
//   }, [user]);

//   const fetchTasksForUser = async (username) => {
//     try {
//       setLoading(true);

//       const res = await axios.get(`/api/tasks/user/${username}`);
//       setTasks(res.data);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-4">
//       {loading ? (
//         <div className="loader-container">
//           <div className="loader"></div>
//         </div>
//       ) : (
//         <>
//           <Link className="btn btn-primary mb-4" to="/tasks">
//             <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Go back to tasks
//           </Link>
//           <h1>Your Tasks</h1>
//           {tasks.length > 0 ? (
//             <ul>
//               {tasks.map((task) => (
//                 <li key={task._id}>
//                   <h2>{task.title}</h2>
//                   <p><strong>Description:</strong> {task.description}</p>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>You have no tasks.</p>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Task;
