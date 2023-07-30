import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

const AddUser = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // New state for role selection
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  // Function to check if all required fields are filled
  const areAllFieldsFilled = () => {
    return name.trim() !== "" && surname.trim() !== "" && username.trim() !== "" && email.trim() !== "" && role.trim() !== "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name, surname, and username
    const nameSurnameRegex = /^[A-Za-z]{3,}$/;
    if (!nameSurnameRegex.test(name) || !nameSurnameRegex.test(surname)) {
      setError("Name and Surname should contain only alphabetic characters and be at least 3 characters long.");
      return;
    }

    const usernameRegex = /^[A-Za-z\d]{3,}$/;
    if (!usernameRegex.test(username) || username === "1234") {
      setError("Username should contain at least one letter, be at least 3 characters long, and should not be '1234'.");
      return;
    }

    setLoading(true);
    setError("");

    // Check if the role "admin" exists in the database
    try {
      const roleResponse = await axios.get("http://localhost:5000/api/roles");
      const existingRoles = roleResponse.data;
      const adminRole = existingRoles.find((role) => role.name.toLowerCase() === "admin");

      if (!adminRole) {
        setError("The 'admin' role does not exist in the database.");
        setLoading(false);
        return;
      }

      const roleData = {
        _id: adminRole._id,
      };

      const userData = {
        name,
        surname,
        username,
        email,
        role: roleData,
      };

      const response = await axios.post("http://localhost:5000/api/users", userData);
      console.log("User added successfully:", response.data);
      setLoading(false);
      history.push("/users");
    } catch (error) {
      setLoading(false);
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Add User</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Your E-mail Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="role" className="form-label">
              Select Role:
            </label>
            <select
              className="form-control form-control-lg"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a Role
              </option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="d-flex justify-content-start">
            <button className="btn btn-primary me-2" disabled={!areAllFieldsFilled() || loading}>
              Add User
            </button>
            <button className="btn btn-primary" onClick={() => history.push("/users")}>
              Cancel
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