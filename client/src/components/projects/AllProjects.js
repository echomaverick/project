import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

const ProjectCard = ({ project, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(project._id);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Name: {project.name}</h5>
        <p className="card-text">Description: {project.description}</p>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center rounded-bottom">
        {showConfirmation ? (
          <div className="popup">
            <p>Are you sure you want to delete?</p>
            <div className="btn-group">
              <button className="btn btn-danger btn-rounded" onClick={confirmDelete}>
                Yes
              </button>
              <button className="btn btn-secondary btn-rounded" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        ) : (
          <div className="btn-group btn-space">
            <Link className="btn btn-primary btn-rounded" to={`/projects/${project._id}`}>
              View
            </Link>
            <Link className="btn btn-outline-primary btn-rounded" to={`/projects/edit/${project._id}`}>
              Edit
            </Link>
            <button className="btn btn-danger btn-rounded" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
        {showConfirmation && <div className="popup-shadow"></div>}
      </div>
    </div>
  );
};

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [deleting, setDeleting] = useState(false); // Set initial deleting state to false

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
      setDeleting(true); // Start the delete operation, show the loader
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      setDeleting(false); // Finish the delete operation, hide the loader
      loadProjects(); // Load the updated list of projects
    } catch (error) {
      setDeleting(false); // Hide the loader in case of an error
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="text-center">All Projects</h1>
          <Link to="/project/add" className="btn1 btn-primary btn-rounded">
            Add a Project
          </Link>
        </div>
        <style>
          {`
            .btn-space .btn {
              margin-right: 10px;
              border-radius:13px;
            }

            .btn-rounded {
              border-radius: 13px;
              padding: 10px 17px;
            }

            a.btn1.btn-primary.btn-rounded {
              background-color: blue;
              margin-top: -10px;
              text-decoration: none;
              color: white;
              margin-right: 20px;
            }

            /* Popup Styles */
            .popup {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: #fff;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              padding: 20px;
              border-radius: 10px;
              z-index: 9999;
            }

            /* Background shadow when the popup is displayed */
            .popup-shadow {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              z-index: 9988;
            }
            .card {
              border-radius: 20px;
            }
            .text-center{
              margin-left: 20px;
            }
            a.btn1.btn-primary.btn-rounded {
              background-color: blue;
              margin-top: -10px;
              text-decoration: none;
              color: white;
              margin-right: 17px;
            }
            /* Mobile View Styles */
          @media (max-width: 576px) {
            .row {
              margin-left: -8px;
              margin-right: -8px;
            }

            .col-md-6,
            .col-lg-4 {
              padding-left: 8px;
              padding-right: 8px;
              width: 300px;
            }

            .btn-group .btn {
              margin-right: 6px;
              font-size: 12px;
              padding: 6px 12px;
            }

            .text-center {
              margin-left: 15px;
            }

            .card {
              font-size: 14px;
            }

            a.btn1.btn-primary.btn-rounded {
              background-color: blue;
              margin-top: -10px;
              text-decoration: none;
              color: white;
              margin-right: 15px;
            }
          }

          /* Tablet View Styles */
          @media (max-width: 768px) {
            .btn-group .btn {
              margin-right: 10px;
              font-size: 14px;
              padding: 8px 16px;
            }
            .text-center {
              margin-left: 10px;
            }
            a.btn1.btn-primary.btn-rounded {
              background-color: blue;
              margin-top: -9px;
              text-decoration: none;
              color: white;
              margin-right: 5px;
            }
          }

          /* Large Desktop View Styles */
          @media (min-width: 1024px) {
            .col-lg-4 {
              width: 33.33%;
            }
            .text-center {
              margin-left: 10px;
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
              <div className="col-md-6 col-lg-4 mb-4" key={project._id}>
                <ProjectCard project={project} onDelete={deleteProject} />
              </div>
            ))}
          </div>
        )}
        {deleting && ( // Show the loader when deleting is in progress
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;