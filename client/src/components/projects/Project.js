import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
      setLoading(false); // Once data is fetched, set loading state to false
    } catch (error) {
      setLoading(false); // Set loading state to false even in case of an error
      console.error("Error fetching projects:", error);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-body">
          <Link className="btn btn-primary" to="/projects">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Go back to projects
          </Link>
          <hr />
          <h2 className="border-bottom pb-3">Projects</h2>
          {loading ? (
            // Show loader when data is being fetched
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : projects.length > 0 ? (
            <div>
              {projects.map((project) => (
                <div key={project._id} className="mb-4">
                  <div className="card p-3 border-0">
                    <h4><strong>Name:</strong> {project.name}</h4>
                    <p><strong>Description:</strong> {project.description}</p>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="card border-0">
                        <div className="card-body">
                          <h5>Assigned Users:</h5>
                          {project.users.length > 0 ? (
                            <ul className="list-group">
                              {project.users.map((user) => (
                                <li key={user._id} className="list-group-item">
                                  <p><strong>Name:</strong> {user.name}</p>
                                  <p><strong>Username:</strong> {user.username}</p>
                                  <p><strong>Email:</strong> {user.email}</p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No users assigned to this project.</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0">
                        <div className="card-body">
                          <h5>Associated Tasks:</h5>
                          {project.tasks.length > 0 ? (
                            <ul className="list-group">
                              {project.tasks.map((task) => (
                                <li key={task._id} className="list-group-item">
                                  <p><strong>Task title:</strong> {task.title}</p>
                                  <p><strong>Task description:</strong> {task.description}</p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No tasks associated with this project.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
