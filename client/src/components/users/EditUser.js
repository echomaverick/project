import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

const EditUser = () => {
  let history = useHistory();
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const { name, surname, username, email, role } = user;
  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, user);
      setLoading(false);
      history.push("/users");
    } catch (error) {
      setLoading(false);
      console.error("Error updating user:", error);
    }
  };

  const loadUser = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/api/users/${id}`);
      const { role, ...userData } = result.data;
      setUser({ ...userData, role });
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Edit A User</h2>
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
            <label hidden>Role:</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={role}
              disabled
              hidden
            />
          </div>
          <div className="d-flex justify-content-start">
            <button className="btn btn-primary me-2">Update User</button>
            <button
              className="btn btn-primary"
              onClick={() => history.push("/users")}
            >
              Cancel
            </button>
          </div>
        </form>
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUser;
