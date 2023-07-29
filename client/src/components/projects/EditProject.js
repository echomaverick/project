import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

const EditProject = () => {
  let history = useHistory();
  const { id } = useParams();
  const [project, setProject] = useState({
    name: "",
    description: "",
    users: [],
    tasks: [],
  });

  const [allUsers, setAllUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const { name, description, users, tasks } = project;

  useEffect(() => {
    loadProject();
    loadAllUsers();
    loadAllTasks();
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Remove any duplicate user and task IDs
    const uniqueUserIDs = Array.from(new Set(users));
    const uniqueTaskIDs = Array.from(new Set(tasks));

    const updatedProject = { ...project, users: uniqueUserIDs, tasks: uniqueTaskIDs };

    try {
      await axios.put(`http://localhost:5000/api/projects/${id}`, updatedProject);
      setSuccess(true); // Set success to true when project is updated successfully
      setLoading(true); // Set loading back to true to show the loader
      setTimeout(() => {
        setSuccess(false); // Hide the success alert after 1 second
        history.push("/projects"); // Redirect to all projects page
      }, 1000);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const loadProject = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/api/projects/${id}`);
      setProject({
        name: result.data.name,
        description: result.data.description,
        users: result.data.users.map((user) => user._id),
        tasks: result.data.tasks.map((task) => task._id),
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error loading project:", error);
    }
  };

  const loadAllUsers = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api/users");
      setAllUsers(result.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadAllTasks = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api/tasks");
      setAllTasks(result.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const isString = (value) => {
    return typeof value === "string" && isNaN(Number(value));
  };

  const isAtLeastOneSelected = (array) => {
    return Array.isArray(array) && array.length > 0;
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Edit Project</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Project Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={onInputChange}
              required
              pattern="^[a-zA-Z\s]+$"
              title="Project name should only contain letters and spaces."
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Project Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={description}
              onChange={onInputChange}
              required
              pattern="^[a-zA-Z\s]+$"
              title="Project description should only contain letters and spaces."
            />
          </div>
          <div className="mb-3">
            <label htmlFor="users" className="form-label">Select Users:</label>
            <select
              multiple
              className="form-control"
              id="users"
              name="users"
              value={users}
              onChange={onInputChange}
              required
            >
              {allUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="tasks" className="form-label">Select Tasks:</label>
            <select
              multiple
              className="form-control"
              id="tasks"
              name="tasks"
              value={tasks}
              onChange={onInputChange}
              required
            >
              {allTasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex justify-content-start gap-3">
            <button className="btn btn-primary" type="submit" disabled={!isString(name) || !isString(description) || !isAtLeastOneSelected(users) || !isAtLeastOneSelected(tasks)}>
              Update Project
            </button>
            <button className="btn btn-primary" onClick={() => history.push("/projects")}>
              Cancel
            </button>
          </div>
        </form>

        {/* Success Alert */}
        {success && (
          <div className="alert alert-success mt-3">
            Project successfully updated!
          </div>
        )}

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

export default EditProject;
