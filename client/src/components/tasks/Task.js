import React, { useState, useEffect } from "react";
import { Link, useParams, Redirect } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Task = () => {
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState({
    title: "",
    description: "",
    users: [],
    projects: []
  });

  const { id } = useParams();

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
      setLoading(false);
      console.log("Invalid task ID");
      return;
    }
  
    try {
      console.log("Fetching task data...");
      const res = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      console.log("Task data:", res.data);
      setTask(res.data);
  
      if (res.data.assignedTo && res.data.assignedTo.length > 0) {
        const assignedUsersPromises = res.data.assignedTo.map(async (userId) => {
          const userRes = await axios.get(
            `http://localhost:5000/api/users/${userId["$oid"]}`
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
  
      setLoading(false);
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
    }
  };
  

  if (!task && !loading) {
    return <Redirect to="/not-found" />;
  }

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <Link className="btn btn-primary" to="/tasks">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Go back to tasks
          </Link>
          <hr />

          {!loading && (
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
          )}

          {!loading && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;
