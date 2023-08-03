import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import "../styles/edittask.css";

const EditTask = () => {
  let history = useHistory();
  const { id } = useParams();
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: [],
    projects: [],
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    assignedTo: "",
    projects: "",
  });
  const [notFound, setNotFound] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isProjectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const { title, description, assignedTo, projects: selectedProjects } = task;

  const loadTasksAndUsers = async () => {
    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks"),
        axios.get("http://localhost:5000/api/users"),
      ]);
      setTasks(tasksResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Error loading tasks and users:", error);
    }
  };

  useEffect(() => {
    loadTask();
    loadTasksAndUsers();
    loadProjects();
  }, []);

  const onInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "select-multiple"
        ? Array.from(e.target.selectedOptions).map((option) => option.value)
        : value;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: newValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const isAtLeastOneSelected = (array) => {
    return array.length > 0;
  };

  const isEmpty = (value) => value.trim() === "";

  const isFormValid = () => {
    const errors = {
      title: isEmpty(title) ? "Task title is required." : "",
      description: isEmpty(description) ? "Task description is required." : "",
      assignedTo: isAtLeastOneSelected(assignedTo)
        ? ""
        : "At least one user should be selected.",
      projects: isAtLeastOneSelected(selectedProjects)
        ? ""
        : "At least one project should be selected.",
    };
    setErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    setLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        ...task,
        assignedTo: task.assignedTo,
        projects: task.projects,
      });

      setLoading(false);
      history.push("/tasks");
    } catch (error) {
      setLoading(false);
      console.error("Error updating task:", error);
    }
  };

  const loadTask = async () => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      setNotFound(true);
      return;
    }

    try {
      const result = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      if (!result.data) {
        setNotFound(true);
        return;
      }

      const userIDs = result.data.assignedTo.map((user) => user._id.toString());
      const projectIDs = result.data.projects.map((project) =>
        project._id.toString()
      );
      setTask({
        title: result.data.title,
        description: result.data.description,
        assignedTo: userIDs,
        projects: projectIDs,
      });
    } catch (error) {
      console.error("Error loading task:", error);
      setNotFound(true);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const isAnyRequiredFieldEmpty = () => {
    return (
      isEmpty(title) ||
      isEmpty(description) ||
      !isAtLeastOneSelected(assignedTo) ||
      !isAtLeastOneSelected(selectedProjects)
    );
  };

  if (notFound) {
    return <Redirect to="/not-found" />;
  }

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleProjectDropdownToggle = () => {
    setProjectDropdownOpen(!isProjectDropdownOpen);
  };

  const handleSelectAll = (event) => {
    const { name, options } = event.target;
    const allValues = Array.from(options).map((option) => option.value);
    setTask((prevTask) => ({
      ...prevTask,
      [name]: allValues,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleUnselectAll = (event) => {
    const { name } = event.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: [],
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  return (
    <div className="container">
      <div className="shadow p-5">
        <h2 className="text-center mb-4">Edit Task</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title:
            </label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              id="title"
              placeholder="Enter Task Title"
              name="title"
              value={title}
              onChange={onInputChange}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              id="description"
              placeholder="Enter Task Description"
              name="description"
              value={description}
              onChange={onInputChange}
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="assignedTo" className="form-label">
              Assigned To:
            </label>
            <div className="custom-dropdown" style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                className="btn btn-secondary custom-dropdown-toggle"
                onClick={handleUserDropdownToggle}
                style={{ width: "100%" }}
              >
                {assignedTo.length === 0
                  ? "Select Users"
                  : `Selected Users (${assignedTo.length})`}{" "}
                <i className="bi bi-caret-down-fill"></i>
              </button>
              {isUserDropdownOpen && (
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
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {users.map((user) => (
                        <div key={user._id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={user._id}
                            checked={assignedTo.includes(user._id)}
                            onChange={onInputChange}
                            name="assignedTo"
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
            {errors.assignedTo && (
              <div className="text-danger">{errors.assignedTo}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="projects" className="form-label">
              Projects:
            </label>
            <div className="custom-dropdown" style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                className="btn btn-secondary custom-dropdown-toggle"
                onClick={handleProjectDropdownToggle}
                style={{ width: "100%" }}
              >
                {selectedProjects.length === 0
                  ? "Select Projects"
                  : `Selected Projects (${selectedProjects.length})`}{" "}
                <i className="bi bi-caret-down-fill"></i>
              </button>
              {isProjectDropdownOpen && (
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
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {projects.map((project) => (
                        <div key={project._id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={project._id}
                            checked={selectedProjects.includes(project._id)}
                            onChange={onInputChange}
                            name="projects"
                          />
                          <label className="form-check-label custom-dropdown-label">
                            {project.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.projects && (
              <div className="text-danger">{errors.projects}</div>
            )}
          </div>
          <div className="d-flex justify-content-start">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || isAnyRequiredFieldEmpty()}
            >
              {loading ? "Updating..." : "Update Task"}
            </button>
            <Link className="btn btn-primary ms-2" to="/tasks">
              Cancel
            </Link>
          </div>
        </form>

        {/* Loader */}
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
      <style>
        {`
          /* Additional styles for mobile view */
          @media (max-width: 576px) {
            .btn {
              margin-top: 10px;
              pointer-events: ${isAnyRequiredFieldEmpty() ? "none" : "auto"};
            }

            /* Adjust the error message position */
            .invalid-feedback {
              display: block;
              margin-top: 4px;
              font-size: 12px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EditTask;
