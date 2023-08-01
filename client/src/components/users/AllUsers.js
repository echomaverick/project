import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/allusers.css";
import ReactLoading from "react-loading";

const UserCard = ({ user, onDelete }) => {

  useEffect(() => {
    
  }, []);
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
        <Link className="btn btn-primary btn-rounded" to={`/users/${user._id}`}>
          View
        </Link>
        <Link className="btn btn-outline-primary btn-rounded" to={`/users/edit/${user._id}`}>
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

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [deletingUser, setDeletingUser] = useState(""); // State to track which user is currently being deleted

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);;
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      setDeletingUser(id); // Set the ID of the user that is being deleted
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeletingUser(""); // Reset the deletingUser state when the deletion is complete
    }
  };

  return (
    <div className="container mt-4">
     
        <div className="py-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-4">All Users</h1>
            <Link to="/user/add" className="btn btn-primary btn-rounded">
              Add a User
            </Link>
          </div>
          <div className="row mt-4">
            {users.map((user, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={user._id}>
                <UserCard user={user} onDelete={deleteUser} />
              </div>
            ))}
          </div>
        </div>

    </div>
  );
};

export default AllUsers;
