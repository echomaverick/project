import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

const AddProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    fetchAvailableData();
  }, []);

  const fetchAvailableData = async () => {
    try {
      const usersResponse = await axios.get("http://localhost:5000/api/users");
      const tasksResponse = await axios.get("http://localhost:5000/api/tasks");

      setAvailableUsers(usersResponse.data);
      setAvailableTasks(tasksResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate project name and description
    const projectNameRegex = /^[A-Za-z\s]+$/; // Regex to allow only letters and spaces
    if (!projectNameRegex.test(name)) {
      setError("Project name should only contain letters and spaces.");
      return;
    }

    const descriptionRegex = /^[A-Za-z\s]+$/; // Regex to allow only letters and spaces
    if (!descriptionRegex.test(description)) {
      setError("Description should only contain letters and spaces.");
      return;
    }

    // Check if at least one user and one task are selected
    if (selectedUsers.length === 0 || selectedTasks.length === 0) {
      setError("Please select at least one user and one task.");
      return;
    }

    setLoading(true);
    setError("");

    const projectData = {
      name,
      description,
      users: selectedUsers,
      tasks: selectedTasks,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/projects", projectData);
      console.log("Project added successfully:", response.data.project);
      setLoading(false);
      history.push("/");
    } catch (error) {
      setLoading(false);
      console.error("Error adding project:", error);
    }
  };

  const isButtonDisabled = !name || !description || selectedUsers.length === 0 || selectedTasks.length === 0;

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5 rounded">
        <h2 className="text-center mb-4">Add Project</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="Enter Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              id="description"
              className="form-control form-control-lg"
              placeholder="Enter Project Description"
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
              onChange={(e) => setSelectedUsers(Array.from(e.target.selectedOptions, (option) => option.value))}
              required
            >
              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="tasks" className="form-label">
              Select Tasks:
            </label>
            <select
              multiple
              className="form-control form-control-lg"
              id="tasks"
              value={selectedTasks}
              onChange={(e) => setSelectedTasks(Array.from(e.target.selectedOptions, (option) => option.value))}
              required
            >
              {availableTasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-primary" onClick={() => history.push("/")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isButtonDisabled || loading}>
              Add Project
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

export default AddProject;
