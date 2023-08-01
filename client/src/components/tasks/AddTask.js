import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const AddTask = () => {
  let history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    const taskDescriptionRegex = /^[A-Za-z\s]+$/;

    const newErrors = {};

    if (!taskNameRegex.test(title)) {
      newErrors.title =
        "Task title should only contain letters and spaces.";
    } else if (title.trim() !== "" && title[0] !== title[0].toUpperCase()) {
      newErrors.title = "Task title should start with an uppercase letter.";
    }

    if (!taskDescriptionRegex.test(description)) {
      newErrors.description =
        "Task description should only contain letters and spaces.";
    } else if (description.trim() !== "" && description[0] !== description[0].toUpperCase()) {
      newErrors.description = "Task description should start with an uppercase letter.";
    }

    if (selectedUsers.length === 0) {
      newErrors.users = "Please select at least one user.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    const taskData = {
      title,
      description,
      assignedTo: selectedUsers,
    };

    try {
      await axios.post("http://localhost:5000/api/tasks", taskData);
      setLoading(false);
      history.push("/tasks");
    } catch (error) {
      setLoading(false);
      console.error("Error adding task:", error);
    }
  };

  const isButtonDisabled = !title || !description || selectedUsers.length === 0;

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    clearError("title");
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    clearError("description");
  };

  const handleUsersChange = (e) => {
    setSelectedUsers(
      Array.from(e.target.selectedOptions, (option) => option.value)
    );
    clearError("users");
  };

  const clearError = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5 rounded">
        <h2 className="text-center mb-4">Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label">
              Task Title:
            </label>
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="Enter Task Title"
              style={{ fontSize: "14px" }}
              value={title}
              onChange={handleTitleChange}
              required
            />
            {errors.title && (
              <div className="text-danger">{errors.title}</div>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="description" className="form-label">
              Task Description:
            </label>
            <input
              type="text"
              id="description"
              className="form-control form-control-lg"
              placeholder="Enter Task Description"
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
            <select
              multiple
              className="form-control form-control-lg"
              id="users"
              value={selectedUsers}
              onChange={handleUsersChange}
              required
            >
              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
            {errors.users && (
              <div className="text-danger">{errors.users}</div>
            )}
          </div>

          <div className="d-flex justify-content-start">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isButtonDisabled || loading}
            >
              Add Task
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => history.push("/tasks")}
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

export default AddTask;
