import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

const AddTask = () => {
  let history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Set initial loading state to false

  useEffect(() => {
    fetchAvailableData();
  }, []);

  const fetchAvailableData = async () => {
    try {
      const usersResponse = await axios.get("http://localhost:5000/api/users");
      setAvailableUsers(usersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskNameRegex = /^[A-Za-z\s]+$/;
    if (!taskNameRegex.test(title)) {
      setError("Task title should only contain letters and spaces.");
      return;
    }

    const taskDescriptionRegex = /^[A-Za-z\s]+$/;
    if (!taskDescriptionRegex.test(description)) {
      setError("Task description should only contain letters and spaces.");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Please select at least one user.");
      return;
    }

    setError("");
    setLoading(true);

    const taskData = {
      title,
      description,
      assignedTo: selectedUsers,
    };

    try {
      await axios.post("http://localhost:5000/api/tasks", taskData);
      setLoading(false); // Set loading to false on success
      history.push("/tasks");
    } catch (error) {
      setLoading(false); // Set loading to false on error
      console.error("Error adding task:", error);
    }
  };

  const isButtonDisabled = !title || !description || selectedUsers.length === 0;

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5 rounded">
        <h2 className="text-center mb-4">Add Task</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="Enter Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              id="description"
              className="form-control form-control-lg"
              placeholder="Enter Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="users" className="form-label">
              Select Users:
            </label>
            <select
              multiple
              className="form-control form-control-lg"
              id="users"
              value={selectedUsers}
              onChange={(e) =>
                setSelectedUsers(Array.from(e.target.selectedOptions, (option) => option.value))
              }
              required
            >
              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-primary" onClick={() => history.push("/tasks")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isButtonDisabled || loading}>
              Add Task
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

export default AddTask;
