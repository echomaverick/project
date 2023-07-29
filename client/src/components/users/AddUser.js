import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

const AddUser = () => {
  let history = useHistory();
  const [user, setUser] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    role: "",
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading state

  const { name, surname, username, email, role } = user;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      setRoles(response.data); // Assuming the API returns an array of roles
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const onInputChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true); // Show loader when form submission starts

    try {
      await axios.post("http://localhost:5000/api/users", user);
      setLoading(false); // Hide loader when user is successfully added
      history.push("/users");
    } catch (error) {
      setLoading(false); // Hide loader in case of error
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Add A User</h2>
        <form onSubmit={e => onSubmit(e)}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Name"
              name="name"
              value={name}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Surname"
              name="surname"
              value={surname}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Username"
              name="username"
              value={username}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Your E-mail Address"
              name="email"
              value={email}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group mb-3">
            <select
              className="form-control form-control-lg"
              name="role"
              value={role}
              onChange={e => onInputChange(e)}
            >
              <option value="">Select a Role</option>
              {roles.map(role => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Adding User..." : "Add User"}
            </button>
          </div>
        </form>

        {/* Loader */}
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUser;
