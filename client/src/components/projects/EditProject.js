import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";

const EditProject = () => {
  let history = useHistory();
  const { id } = useParams();
  const [project, setProject] = useState({
    name: "",
    description: "",
    users: [],
    tasks: [],
  });
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    users: "",
    tasks: "",
  });
  const [notFound, setNotFound] = useState(false);

  const { name, description, users: selectedUsers, tasks: selectedTasks } = project;

  const loadUsersAndTasks = async () => {
    try {
      const [usersResponse, tasksResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/users"),
        axios.get("http://localhost:5000/api/tasks"),
      ]);
      setUsers(usersResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error("Error loading users and tasks:", error);
    }
  };

  useEffect(() => {
    loadProject();
    loadUsersAndTasks();
  }, []);

  const onInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "select-multiple"
        ? Array.from(e.target.selectedOptions).map((option) => option.value)
        : value;
    setProject((prevProject) => ({
      ...prevProject,
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

  const isString = (text) => {
    return typeof text === "string";
  };

  const isEmpty = (value) => value.trim() === "";

  const isFormValid = () => {
    const errors = {
      name: isEmpty(name) ? "Project name is required." : "",
      description: isEmpty(description) ? "Project description is required." : "",
      users: isAtLeastOneSelected(selectedUsers) ? "" : "At least one user should be selected.",
      tasks: isAtLeastOneSelected(selectedTasks) ? "" : "At least one task should be selected.",
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
      await axios.put(`http://localhost:5000/api/projects/${id}`, {
        ...project,
        users: project.users,
        tasks: project.tasks,
      });

      setLoading(false);
      history.push("/projects");
    } catch (error) {
      setLoading(false);
      console.error("Error updating project:", error);
    }
  };

  const loadProject = async () => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      setNotFound(true); 
      return;
    }

    try {
      const result = await axios.get(`http://localhost:5000/api/projects/${id}`);
      if (!result.data) {
        setNotFound(true);
        return;
      }

      const userIDs = result.data.users.map((user) => user._id.toString());
      const taskIDs = result.data.tasks.map((task) => task._id.toString());
      setProject({
        name: result.data.name,
        description: result.data.description,
        users: userIDs,
        tasks: taskIDs,
      });
    } catch (error) {
      console.error("Error loading project:", error);
      setNotFound(true); 
    }
  };

  const isAnyRequiredFieldEmpty = () => {
    return !name.trim() || !description.trim() || !isAtLeastOneSelected(selectedUsers) || !isAtLeastOneSelected(selectedTasks);
  };
  if (notFound) {
    return <Redirect to="/not-found" />;
  }

  return (
    <div className="container">
      <div className="shadow p-5">
        <h2 className="text-center mb-4">Edit Project</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name"
              placeholder="Enter Project Name"
              name="name"
              value={name}
              onChange={onInputChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              id="description"
              placeholder="Enter Project Description"
              name="description"
              value={description}
              onChange={onInputChange}
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="users" className="form-label">
              Select Users:
            </label>
            <select
              multiple
              className={`form-control ${errors.users ? "is-invalid" : ""}`}
              id="users"
              name="users"
              value={selectedUsers}
              onChange={onInputChange}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
            {errors.users && <div className="invalid-feedback">{errors.users}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="tasks" className="form-label">
              Select Tasks:
            </label>
            <select
              multiple
              className={`form-control ${errors.tasks ? "is-invalid" : ""}`}
              id="tasks"
              name="tasks"
              value={selectedTasks}
              onChange={onInputChange}
            >
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
            {errors.tasks && <div className="invalid-feedback">{errors.tasks}</div>}
          </div>
          <div className="d-flex justify-content-start">
            <button className="btn btn-primary" type="submit" disabled={loading || isAnyRequiredFieldEmpty()}>
              {loading ? "Updating..." : "Update Project"}
            </button>
            <Link className="btn btn-primary ms-2" to="/projects">
              Cancel
            </Link>
          </div>
        </form>

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

export default EditProject;
