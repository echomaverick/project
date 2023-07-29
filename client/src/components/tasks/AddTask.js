import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles/loader.css"; // Import the loader CSS file

const AddTask = () => {
  let history = useHistory();
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: [],
  });
  const [loading, setLoading] = useState(true); // State to manage loading state, set it to true initially
  const [isComponentMounted, setComponentMounted] = useState(false);

  const { title, description, assignedTo } = task;

  const validateForm = () => {
    return title.trim() !== "" && description.trim() !== "" && assignedTo.length > 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true); // Show loader when form submission starts

    try {
      await axios.post("http://localhost:5000/api/tasks", task);
      setLoading(false); // Hide loader when task is successfully added
      history.push("/");
    } catch (error) {
      setLoading(false); // Hide loader in case of error
      console.error("Error adding task:", error);
    }
  };

  useEffect(() => {
    // This will be executed after the component has mounted
    setComponentMounted(true);
  }, []);

  useEffect(() => {
    // This will be executed whenever the isComponentMounted state changes
    if (isComponentMounted) {
      setLoading(false); // Hide loader when the component has mounted
    }
  }, [isComponentMounted]);

  return (
    <div className="container">
      <div className="w-75 mx-auto p-5 shadow rounded">
        <h2 className="text-center mb-4">Add A Task</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Task Title"
              name="title"
              value={title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Task Description"
              name="description"
              value={description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter User Ids(comma-separated)"
              name="assignedTo"
              value={assignedTo.join(", ")}
              onChange={(e) => {
                const usersArray = e.target.value.split(",").map((userId) => userId.trim());
                setTask({ ...task, assignedTo: usersArray });
              }}
              required
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary btn-block" disabled={!validateForm()}>
              Add task
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
