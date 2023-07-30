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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State to manage error messages

  const { name, surname, username, email, role } = user;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    const nameRegex = /^[A-Za-z\s]+$/; // Regex to allow only letters and spaces
    if (!nameRegex.test(name)) {
      setError("User name should only contain letters and spaces.");
      return;
    }

    const surnameRegex = /^[A-Za-z\s]+$/; // Regex to allow only letters and spaces
    if (!surnameRegex.test(surname)) {
      setError("User surname should only contain letters and spaces.");
      return;
    }

    const usernameRegex = /^[A-Za-z]+[A-Za-z0-9]*$/; // Regex to allow letters and numbers, starting with a letter
    if (!usernameRegex.test(username)) {
      setError("Username should start with a letter and may contain letters and numbers.");
      return;
    }

    if (!name || !surname || !username || !email || !role) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/users", user);
      setLoading(false);
      history.push("/users");
    } catch (error) {
      setLoading(false);
      setError("Error adding user.");
      console.error("Error adding user:", error);
    }
  };

  const isButtonDisabled = !name || !surname || !username || !email || !role;

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Add A User</h2>
        <div className={`alert alert-danger ${error ? "d-block" : "d-none"}`}>{error}</div>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Name"
              name="name"
              value={name}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Surname"
              name="surname"
              value={surname}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Username"
              name="username"
              value={username}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Your E-mail Address"
              name="email"
              value={email}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <select
              className="form-control form-control-lg"
              name="role"
              value={role}
              onChange={onInputChange}
            >
              <option value="">Select a Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button className="btn btn-primary btn-block" disabled={isButtonDisabled || loading}>
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
