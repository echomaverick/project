import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
          <h5 className="card-title">
            <strong>Title:</strong> {task.title}
          </h5>
        </div>
        <div className="task-description">
          <p className="card-text">
            <strong>Description:</strong> {task.description}
          </p>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between rounded-bottom">
        {showConfirmation ? (
          <div
            className="popup bg-white rounded p-3 d-flex flex-column align-items-center justify-content-center"
            style={{ width: "600px", minHeight: "200px" }}
          >
            <p className="confirmation-text" style={{ fontSize: "24px" }}>
              Are you sure you want to delete?
            </p>
            <div className="btn-group d-flex align-items-center">
              <button
                className="btn1 btn-danger btn-rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="btn1 btn-secondary btn-rounded ml-2"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="btn-group">
            <Link
              className="btn btn-primary btn-rounded"
              to={`/tasks/${task._id}`}
            >
              View
            </Link>
            <Link
              className="btn btn-outline-primary btn-rounded"
              to={`/tasks/edit/${task._id}`}
            >
              Edit
            </Link>
            <button
              className="btn btn-danger btn-rounded ml-2"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
        {showConfirmation && <div className="popup-shadow"></div>}
      </div>
    </div>
  );
};

const UserTasks = ({ match }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = match.params;

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tasks/user/${username}`
        );
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [username]);

  const onDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      // After successfully deleting the task, update the tasks list
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Tasks for {username}</h2>
        <Link className="btn btn-success" to="/usertask/add">
          Add Task
        </Link>
      </div>
      <div className="row">
        {tasks.map((task) => (
          <div key={task._id} className="col-md-4 mb-4">
            <TaskCard task={task} onDelete={onDeleteTask} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTasks;
