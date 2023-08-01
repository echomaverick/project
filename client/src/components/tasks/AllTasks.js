import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/alltasks.css";

const TaskCard = ({ task, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(task._id);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="task-title">
          <label>Task Title:</label>
          <h5 className="card-title">{task.title}</h5>
        </div>
        <div className="task-description">
          <label>Description:</label>
          <p className="card-text">{task.description}</p>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between rounded-bottom">
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
            <Link className="btn btn-primary btn-rounded" to={`/tasks/${task._id}`}>
              View
            </Link>
            <Link className="btn btn-outline-primary btn-rounded" to={`/tasks/edit/${task._id}`}>
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

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <div className={`py-4`}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="text-center">All Tasks</h1>
          <Link to="/task/add" className="btn btn1 btn-primary btn-rounded">
            Add a task
          </Link>
        </div>
        <div className="row">
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            tasks.map((task) => (
              <div className="col-md-6 col-lg-4 mb-4" key={task._id}>
                <TaskCard task={task} onDelete={deleteTask} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTasks;
