import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Task = () => {
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: [],
    projects: [],
  });

  const { id } = useParams();

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      setTask(res.data);

      if (res.data.assignedTo && res.data.assignedTo.length > 0) {
        const assignedUsersPromises = res.data.assignedTo.map(
          async (userId) => {
            const userRes = await axios.get(
              `http://localhost:5000/api/users/${userId["$oid"]}`
            );
            return userRes.data;
          }
        );
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
              `http://localhost:5000/api/projects/${projectId["$oid"]}`
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

      setLoading(false); // Hide the loader once data is loaded
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false); // Hide the loader in case of error
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

      <div
        className="card"
        style={{ visibility: loading ? "hidden" : "visible" }}
      >
        <div className="card-body">
          <Link className="btn btn-primary" to="/tasks">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Go back to tasks
          </Link>
          <hr />

          <div className="row">
            <div className="col-md-12">
              {/* Task Title and Description Card */}
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
              {/* Assigned Users Card */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4>Assigned Users:</h4>
                  {task.assignedTo && task.assignedTo.length > 0 ? (
                    <ul className="list-group list-group-flush"> {/* Add list-group-flush class to remove the square bullets */}
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
              {/* Associated Projects Card */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4>Associated Projects:</h4>
                  {task.projects && task.projects.length > 0 ? (
                    <ul className="list-group list-group-flush"> {/* Add list-group-flush class to remove the square bullets */}
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
        </div>
      </div>
    </div>
  );
};

export default Task;
