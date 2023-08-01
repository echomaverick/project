import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";

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

    // Clear the corresponding error message when the user starts typing again
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const isAtLeastOneSelected = (array) => {
    return array.length > 0;
  };

  const isString = (text) => {
    return typeof text === "string";
  };

  // Helper function to check if a field is empty
  const isEmpty = (value) => value.trim() === "";

  // Validate form fields and set error messages
  const isFormValid = () => {
    const errors = {
      title: isEmpty(title) ? "Task title is required." : "",
      description: isEmpty(description) ? "Task description is required." : "",
      assignedTo: isAtLeastOneSelected(assignedTo) ? "" : "At least one user should be selected.",
      projects: isAtLeastOneSelected(selectedProjects) ? "" : "At least one project should be selected.",
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
    // Check if the ID matches the expected format of a MongoDB ObjectID (12-byte hexadecimal)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      setNotFound(true); // Set notFound state to true when an invalid ID is detected
      return;
    }

    try {
      const result = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      if (!result.data) {
        // If the result data is null (task not found), set notFound state to true
        setNotFound(true);
        return;
      }

      const userIDs = result.data.assignedTo.map((user) => user._id.toString());
      const projectIDs = result.data.projects.map((project) => project._id.toString());
      setTask({
        title: result.data.title,
        description: result.data.description,
        assignedTo: userIDs,
        projects: projectIDs,
      });
    } catch (error) {
      console.error("Error loading task:", error);
      setNotFound(true); // Set notFound state to true in case of an error while fetching the task
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
    return !title.trim() || !description.trim() || !isAtLeastOneSelected(assignedTo) || !isAtLeastOneSelected(selectedProjects);
  };

  // If notFound state is true, redirect to "Not Found" page
  if (notFound) {
    return <Redirect to="/not-found" />;
  }

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
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              id="description"
              placeholder="Enter Task Description"
              name="description"
              value={description}
              onChange={onInputChange}
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="assignedTo" className="form-label">
              Assigned To:
            </label>
            <select
              multiple
              className={`form-control ${errors.assignedTo ? "is-invalid" : ""}`}
              id="assignedTo"
              name="assignedTo"
              value={assignedTo}
              onChange={onInputChange}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
            {errors.assignedTo && <div className="invalid-feedback">{errors.assignedTo}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="projects" className="form-label">
              Projects:
            </label>
            <select
              multiple
              className={`form-control ${errors.projects ? "is-invalid" : ""}`}
              id="projects"
              name="projects"
              value={selectedProjects}
              onChange={onInputChange}
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projects && <div className="invalid-feedback">{errors.projects}</div>}
          </div>
          <div className="d-flex justify-content-start">
            <button className="btn btn-primary" type="submit" disabled={loading || isAnyRequiredFieldEmpty()}>
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
