import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/loader.css"; // Import the loader CSS file

const User = () => {
  const [user, setUser] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    role: "",
    tasks: [],
    projects: [],
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state, set it to true initially

  const { id } = useParams();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}`);
      setUser(res.data);

      const roleRes = await axios.get(`http://localhost:5000/api/roles/${res.data.role["$oid"]}`);
      setUser((prevState) => ({ ...prevState, role: roleRes.data.name }));

      const userTaskIds = res.data.tasks.map((taskId) => taskId["$oid"]);

      const userTasks = tasks.filter((task) => userTaskIds.includes(task._id["$oid"]));
      setTasks(userTasks);

      setLoading(false); // Hide loader when user data is fetched
    } catch (error) {
      console.error("Error loading user:", error);
      setLoading(false); // Hide loader in case of error
    }
  };

  return (
    <div className="container py-4">
      {/* Loader */}
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      <div className={`card ${loading ? "d-none" : ""}`}>
        {/* Use "d-none" class to hide the card when loading */}
        <div className="card-body">
          <Link className="btn btn-primary" to="/users">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Go back users
          </Link>
          <hr />

          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h4>Tasks Assigned:</h4>
                  {user.tasks.length > 0 ? (
                    <ul className="list-group">
                      {user.tasks.map((task) => (
                        <li key={task["$oid"]} className="list-group-item">
                          <p>
                            <strong>Task title: </strong> {task.title}
                          </p>
                          <p>
                            <strong>Task description: </strong> {task.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tasks assigned.</p>
                  )}
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h4>Projects Assigned:</h4>
                  {user.projects.length > 0 ? (
                    <ul className="list-group">
                      {user.projects.map((project) => (
                        <li key={project["$oid"]} className="list-group-item">
                          <p>
                            <strong>Project name: </strong> {project.name}
                          </p>
                          <p>
                            <strong>Project description: </strong> {project.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No projects assigned.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
