import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

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
        <h5 className="card-title">Title: {task.title}</h5>
        <p className="card-text">Description: {task.description}</p>
        <div className="btn-group btn-space">
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
            <>
              <Link className="btn btn-primary btn-rounded" to={`/tasks/${task._id}`}>
                View
              </Link>
              <Link className="btn btn-primary btn-rounded" to={`/tasks/edit/${task._id}`}>
                Edit
              </Link>
              <button className="btn btn-danger btn-rounded" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      {showConfirmation && <div className="popup-shadow"></div>}
    </div>
  );
};

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
      setLoading(false); // Hide loader after tasks are loaded
    } catch (error) {
      console.error("Error loading tasks:", error);
      setLoading(false); // Hide loader in case of error
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
      {loading ? ( // Display the loader if loading is true
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className={`py-4`}>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="text-center">All Tasks</h1>
            <Link to="/task/add" className="btn1 btn-primary btn-rounded">
              Add a task
            </Link>
          </div>
          <div className="row">
            {tasks.map((task, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={task._id}>
                <TaskCard task={task} onDelete={deleteTask} />
              </div>
            ))}
          </div>
        </div>
      )}
      <style>
        {`
          .btn-space .btn {
            margin-right: 10px;
            border-radius: 13px;
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

          .btn-rounded {
            border-radius: 13px;
            padding: 10px 17px;
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
              width: 100%;
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
    </div>
  );
};

export default AllTasks;
