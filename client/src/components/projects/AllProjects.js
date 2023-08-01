import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProjectCard = ({ project, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    console.log("Delete button clicked for project ID:", project._id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    console.log("Confirm delete called with project ID:", project._id);
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
      <div className="popup bg-white rounded p-3 d-flex flex-column align-items-center justify-content-center" style={{ width: '600px', minHeight: '400px' }}>
         <p className="confirmation-text" style={{ fontSize: '24px' }}>Are you sure you want to delete?</p>
        <div className="btn-group d-flex align-items-center">
          <button className="btn1 btn-danger btn-rounded" onClick={confirmDelete}>
            Delete
          </button>
          <button className="btn1 btn-secondary btn-rounded ml-2" onClick={cancelDelete}>
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="btn-group">
        <Link className="btn btn-primary btn-rounded" to={`/projects/${project._id}`}>
          View
        </Link>
        <Link className="btn btn-outline-primary btn-rounded" to={`/projects/edit/${project._id}`}>
          Edit
        </Link>
        <button className="btn btn-danger btn-rounded ml-2" onClick={handleDelete}>
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
  const [loading, setLoading] = useState(true); 
  const [deleting, setDeleting] = useState(false); 

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      setProjects(response.data);
      setLoading(false); 
    } catch (error) {
      setLoading(false); 
      console.error("Error loading projects:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      setDeleting(true); 
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      setDeleting(false);
      loadProjects(); 
    } catch (error) {
      setDeleting(false); 
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="text-center">All Projects</h1>
          <Link to="/project/add" className="btn btn-primary btn-sm btn-rounded">
            Add a Project
          </Link>
        </div>
        <div className="row">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            projects.map((project) => (
              <div className="col-md-6 col-lg-4 mb-4" key={project._id}>
                <ProjectCard project={project} onDelete={deleteProject} />
              </div>
            ))
          )}
        </div>
        {deleting && ( 
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
