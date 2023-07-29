import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

const ProjectCard = ({ project, onDelete }) => (
  <div className="card shadow-sm">
    <div className="card-body">
      <h5 className="card-title">Name: {project.name}</h5>
      <p className="card-text">Description: {project.description}</p>
      <div className="btn-group btn-space">
        <Link className="btn btn-primary btn-rounded" to={`/projects/${project._id}`}>
          View
        </Link>
        <Link className="btn btn-outline-primary btn-rounded" to={`/projects/edit/${project._id}`}>
          Edit
        </Link>
        <button className="btn btn-danger btn-rounded" onClick={() => onDelete(project._id)}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      setProjects(response.data);
      setLoading(false); // Once data is fetched, set loading state to false
    } catch (error) {
      setLoading(false); // Set loading state to false even in case of an error
      console.error("Error loading projects:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        <h1 className="text-center">All Projects</h1>
        <style>
          {`
            .btn-space .btn {
              margin-right: 8px;
            }

            .btn-rounded {
              border-radius: 20px;
            }

            .card {
              border-radius: 20px;
            }

            /* Additional styles for mobile view */
            @media (max-width: 576px) {
              .card {
                /* Adjust the card size and margins for mobile view */
                width: 90%;
                margin: 0 auto;
              }
            }
          `}
        </style>
        {loading ? (
          // Show loader when data is being fetched
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="row">
            {projects.map((project, index) => (
              <div className="col-md-4 mb-4" key={project._id}>
                <ProjectCard project={project} onDelete={deleteProject} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
