import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

const UserCard = ({ user, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(user._id);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {user.name} {user.surname}
        </h5>
        <p className="card-text">Username: {user.username}</p>
        <p className="card-text">Email: {user.email}</p>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center rounded-bottom">
        {showConfirmation ? (
          <div className="popup">
            <p>Are you sure you want to delete?</p>
            <div className="btn-group">
              <button
                className="btn btn-danger btn-rounded"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary btn-rounded"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <div className="btn-group">
            <Link
              className="btn btn-primary btn-rounded"
              to={`/users/${user._id}`}
            >
              View
            </Link>
            <Link
              className="btn btn-outline-primary btn-rounded"
              to={`/users/edit/${user._id}`}
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

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading users:", error);
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container">
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      <div className={`py-4 ${loading ? "d-none" : ""}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="text-center">All Users</h1>
          <Link to="/user/add" className="btn1 btn-primary btn-rounded">
            Add a User
          </Link>
        </div>
        <div className="row">
          {users.map((user, index) => (
            <div className="col-md-6 col-lg-4 mb-4" key={user._id}>
              <UserCard user={user} onDelete={deleteUser} />
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
          .btn-group .btn {
            margin-right: 8px;
            border-radius: 13px;
            font-size: 14px;
            padding: 8px 16px;
            
          }

          .btn-rounded {
            border-radius: 13px;
            padding: 8px 16px;
          }

          .card {
            border-radius: 20px;
          }

          .text-center {
            margin-left: 8px;
          }

          a.btn1.btn-primary.btn-rounded {
            background-color: blue;
            margin-top: -7px;
            text-decoration: none;
            color: white;
            margin-right: 5px;
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

          /* Mobile View Styles */
          @media (max-width: 576px) {
            .row {
              margin-left: -8px;
              margin-right: -8px;
            }

            .col-md-6,
            .col-lg-4 {
              padding-left: 1px;
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
              margin-top: -7px;
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
              margin-top: -7px;
              text-decoration: none;
              color: white;
              margin-right: 5px;
            }
          }

          /* Large Desktop View Styles */
          @media (min-width: 1200px) {
            .col-lg-4 {
              width: 33.33%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AllUsers;
