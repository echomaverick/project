const Task = require("../models/taskModel");
const mongoose = require("mongoose");
const Project = require("../models/projectModel");
const User = require("../models/userModel");

//create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projects } = req.body;

    if (!title || !description) {
      throw new Error("Title and description of the task are required!");
    }

    const titleRegex = /^[A-Za-z\s]+$/;
    if (!titleRegex.test(title)) {
      return res.status(404).json({
        error:
          "Invalid title format! Description should only contain alphanumeric characters and spaces",
      });
    }

    const descriptionRegex = /^[A-Za-z\s]+$/;
    if (!descriptionRegex.test(description)) {
      return res.status(404).json({
        error:
          "Invalid description format! Description should only contain alphanumeric characters and spaces",
      });
    }

    if (!assignedTo) {
      return res.status(404).json({ error: "User of the task is required!" });
    }

    const existingUser = await User.findById(assignedTo);
    if (!existingUser) {
      return res
        .status(404)
        .json({ error: "Invalid user ID! User does not exist." });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo,
      projects,
    });

    await newTask.save();

    await User.updateMany(
      { _id: { $in: assignedTo } },
      { $push: { tasks: newTask._id } }
    );
    await Project.updateMany(
      { _id: { $in: projects } },
      { $push: { tasks: newTask._id } }
    );

    res.status(200).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

//get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name surname username  email")
      .populate("projects", "name description");
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get all tasks" });
  }
};

//get a task by id
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({ error: "Invalid task ID" });
    }

    const task = await Task.findById(taskId)
      .populate("assignedTo", "name surname username email")
      .populate("projects", "name description");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, projects } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task ID does not exist" });
    }

    if (!title || !description || !projects) {
      return res.status(400).json({
        error: "All fields are required (title, description, projects)",
      });
    }

    const titleRegex = /^[A-Za-z\s]+$/;
    if (!titleRegex.test(title)) {
      return res.status(400).json({
        error:
          "Invalid title format! Title should only contain alphanumeric characters and spaces.",
      });
    }

    const descriptionRegex = /^[A-Za-z\s]+$/;
    if (!descriptionRegex.test(description)) {
      return res.status(400).json({
        error:
          "Invalid description format! Description should only contain alphanumeric characters and spaces.",
      });
    }

    if (
      !Array.isArray(assignedTo) ||
      !assignedTo.every((assignedToId) =>
        mongoose.Types.ObjectId.isValid(assignedToId)
      )
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid 'assignedTo' field. It should be an array of valid ObjectId.",
        });
    }

    const newAssignedTo = assignedTo.filter(
      (userId) =>
        !task.assignedTo.some((assignedUserId) => assignedUserId.equals(userId))
    );

    task.title = title;
    task.description = description;
    task.projects = projects;
    task.assignedTo = assignedTo;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

//delete a task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deleteTask) {
      res.status(404).json({ error: "Task not found" });
    }
    await User.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });
    await Project.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

const getTasksForUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const tasks = await Task.find({ assignedTo: user._id })
      .populate("assignedTo", "name surname username email")
      .populate("projects", "name description");
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An errror occurred" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksForUserByUsername,
};
