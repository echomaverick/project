import React, { useState, useEffect } from "react";
import axios from "axios";
import MultipleSelectChip from "./MultipleSelector";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AddProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchAvailableData();
  }, []);

  const fetchAvailableData = async () => {
    try {
      const usersResponse = await axios.get("http://localhost:5000/api/users");
      const users = usersResponse.data.map((user) => user._id); // Assuming the User model has "_id" field as MongoDB ObjectId
      setAvailableUsers(users);

      const tasksResponse = await axios.get("http://localhost:5000/api/tasks");
      const tasks = tasksResponse.data.map((task) => task._id); // Assuming the Task model has "_id" field as MongoDB ObjectId
      setAvailableTasks(tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate project name and description
    const projectNameRegex = /^[A-Za-z\s]+$/; // Regex to allow only letters and spaces
    const descriptionRegex = /^[A-Za-z\s]+$/; // Regex to allow only letters and spaces

    const newErrors = {};

    if (!projectNameRegex.test(name)) {
      newErrors.name = "Project name should only contain letters and spaces.";
    } else if (name.trim() !== "" && name[0] !== name[0].toUpperCase()) {
      newErrors.name = "Project name should start with an uppercase letter.";
    }

    if (!descriptionRegex.test(description)) {
      newErrors.description = "Description should only contain letters and spaces.";
    } else if (description.trim() !== "" && description[0] !== description[0].toUpperCase()) {
      newErrors.description = "Description should start with an uppercase letter.";
    }

    // Check if at least one user and one task are selected
    if (selectedUsers.length === 0 || selectedTasks.length === 0) {
      newErrors.users = "Please select at least one user and one task.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    setErrors({});

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
      // Redirect to the projects page after adding the project
      // Replace this with the correct route of your projects page if needed
      // history.push("/projects");
    } catch (error) {
      setLoading(false);
      console.error("Error adding project:", error);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    clearError("name");
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    clearError("description");
  };

  const handleUsersChange = (value) => {
    const { users, tasks } = value; // Extract selected users and tasks from the value object
    setSelectedUsers(users);
    setSelectedTasks(tasks);
    clearError("users");
  };

  const clearError = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  const isButtonDisabled =
    !name || !description || selectedUsers.length === 0 || selectedTasks.length === 0;

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5 rounded">
        <h2 className="text-center mb-4">Add Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="Enter Project Name"
              style={{ fontSize: "14px" }}
              value={name}
              onChange={handleNameChange}
              required
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              id="description"
              className="form-control form-control-lg"
              placeholder="Enter Project Description"
              style={{ fontSize: "14px" }}
              value={description}
              onChange={handleDescriptionChange}
              required
            />
            {errors.description && <div className="text-danger">{errors.description}</div>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="users" className="form-label">
              Select Users:
            </label>
            <MultipleSelectChip
              value={{ users: selectedUsers, tasks: selectedTasks }}
              onChange={handleUsersChange}
              availableUsers={availableUsers}
              availableTasks={availableTasks}
            />
            {errors.users && <div className="text-danger">{errors.users}</div>}
          </div>

          <div className="d-flex justify-content-start">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isButtonDisabled || loading}
            >
              Add Project
            </button>
            <button className="btn btn-primary" onClick={() => history.push("/projects")}>
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

export default AddProject;
