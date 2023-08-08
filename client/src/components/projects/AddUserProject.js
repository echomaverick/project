import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const AddUserProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isTasksDropdownOpen, setTasksDropdownOpen] = useState(false);

  useEffect(() => {
    fetchAvailableData();
  }, []);

  const fetchAvailableData = async () => {
    try {
      const usersResponse = await axios.get("http://localhost:5000/api/users");
      const tasksResponse = await axios.get("http://localhost:5000/api/tasks");
      setAvailableTasks(tasksResponse.data);
      setAvailableUsers(usersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectNameRegex = /^[A-Za-z\s]+$/;
    const projectDescriptionRegex = /^[A-Za-z\s]+$/;

    const newErrors = {};

    if (!projectNameRegex.test(name)) {
      newErrors.name = "Project name should only contain letters and spaces.";
    } else if (name.trim() !== "" && name[0] !== name[0].toUpperCase()) {
      newErrors.name = "Project name should start with an uppercase letter.";
    }

    if (!projectDescriptionRegex.test(description)) {
      newErrors.description =
        "Project description should only contain letters and spaces.";
    } else if (
      description.trim() !== "" &&
      description[0] !== description[0].toUpperCase()
    ) {
      newErrors.description =
        "Project description should start with an uppercase letter.";
    }

    if (selectedUsers.length === 0) {
      newErrors.users = "Please select at least one user.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    const projectData = {
      name,
      description,
      users: selectedUsers.map((user) => user._id),
      tasks: selectedTasks.map((task) => task._id),
    };

    try {
      await axios.post("http://localhost:5000/api/projects", projectData);
      setLoading(false);
      history.push("/projects"); 
    } catch (error) {
      setLoading(false);
      console.error("Error adding project:", error);
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleTitleChange = (e) => {
    setName(e.target.value);
    clearError("name"); 
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    clearError("description");
  };

  const handleUserToggle = (user) => () => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user._id)
        ? prevSelectedUsers.filter((id) => id !== user._id)
        : [...prevSelectedUsers, user._id]
    );
    clearError("users");
  };

  const handleTaskToggle = (task) => () => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(task._id)
        ? prevSelectedTasks.filter((id) => id !== task._id)
        : [...prevSelectedTasks, task._id]
    );
  };

  const handleTasksDropdownToggle = () => {
    setTasksDropdownOpen(!isTasksDropdownOpen);
  };

  const handleSelectAllTasks = () => {
    setSelectedTasks(availableTasks.map((task) => task._id));
  };

  const handleUnselectAllTasks = () => {
    setSelectedTasks([]);
  };

  const clearError = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  const isButtonDisabled = !name || !description || selectedUsers.length === 0;

  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  };

  const handleSelectAll = () => {
    setSelectedUsers(availableUsers.map((user) => user._id));
  };

  const handleUnselectAll = () => {
    setSelectedUsers([]);
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5 rounded">
        <h2 className="text-center mb-4">Add Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label">
              Project Name:
            </label>
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="Enter Project Name"
              style={{ fontSize: "14px" }}
              value={name}
              onChange={handleTitleChange}
              required
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="description" className="form-label">
              Project Description:
            </label>
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
            {errors.description && (
              <div className="text-danger">{errors.description}</div>
            )}
          </div>
          <div className="form-group mb-3">
          <label htmlFor="users" className="form-label">
            Select Users:
          </label>
          <div className="custom-dropdown" style={{ marginBottom: "1rem" }}>
            <button
              type="button"
              className="btn btn-secondary custom-dropdown-toggle"
              onClick={handleDropdownToggle}
              style={{ width: "100%" }}
            >
              {selectedUsers.length === 0
                ? "Select Users"
                : `Selected Users (${selectedUsers.length})`}{" "}
              <i className="bi bi-caret-down-fill"></i>
            </button>
            {isDropdownOpen && (
              <div className="card custom-dropdown-content">
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={handleSelectAll}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleUnselectAll}
                    >
                      Unselect All
                    </button>
                  </div>
                  <div
                    className="custom-dropdown-user-list"
                    style={{ maxHeight: "150px", overflowY: "auto" }}
                  >
                    {availableUsers.map((user) => (
                      <div key={user._id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={user._id}
                          checked={selectedUsers.includes(user._id)}
                          onChange={handleUserToggle(user)}
                        />
                        <label className="form-check-label custom-dropdown-label">
                          {user.name} {user.surname}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {errors.users && <div className="text-danger">{errors.users}</div>}
        </div>
        <div className="form-group mb-3">
          <label htmlFor="tasks" className="form-label">
            Select Tasks:
          </label>
          <div className="custom-dropdown" style={{ marginBottom: "1rem" }}>
            <button
              type="button"
              className="btn btn-secondary custom-dropdown-toggle"
              onClick={handleTasksDropdownToggle}
              style={{ width: "100%" }}
            >
              {selectedTasks.length === 0
                ? "Select Tasks"
                : `Selected Tasks (${selectedTasks.length})`}{" "}
              <i className="bi bi-caret-down-fill"></i>
            </button>
            {isTasksDropdownOpen && (
              <div className="card custom-dropdown-content">
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={handleSelectAllTasks}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleUnselectAllTasks}
                    >
                      Unselect All
                    </button>
                  </div>
                  <div
                    className="custom-dropdown-task-list"
                    style={{ maxHeight: "150px", overflowY: "auto" }}
                  >
                    {availableTasks.map((task) => (
                      <div key={task._id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={task._id}
                          checked={selectedTasks.includes(task._id)}
                          onChange={handleTaskToggle(task)}
                        />
                        <label className="form-check-label custom-dropdown-label">
                          {task.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-start">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isButtonDisabled || loading}
          >
            Add Project
          </button>
          <button className="btn btn-primary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default AddUserProject;
