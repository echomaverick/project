const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const mongoose = require("mongoose");
const User = require("../models/userModel");


//create a new project
const createProject = async (req, res) => {
  try {
    const { name, description, users, tasks } = req.body;
    console.log("Received project data:", { name, description, users, tasks });

    if (!name || !description || !users) {
      return res
        .status(404)
        .json({ error: "Name, description, and userIds are required fields!" });
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return res
        .status(404)
        .json({
          error:
            "Invalid name format! Name should only contain letters and spaces.",
        });
    }

    const descriptionRegex = /^[A-Za-z\s]+$/;
    if (!descriptionRegex.test(description)) {
      return res
        .status(404)
        .json({
          error:
            "Invalid description format! Description should only contain letters and spaces.",
        });
    }

    const [existingUsers, existingTasks] = await Promise.all([
      User.find({ _id: { $in: users } }),
      tasks ? Task.find({ _id: { $in: tasks } }) : [],
    ]);

    if (users.length !== existingUsers.length) {
      return res
        .status(404)
        .json({ error: "Invalid userId! One or more users do not exist." });
    }

    if (tasks && tasks.length !== existingTasks.length) {
      return res
        .status(404)
        .json({ error: "Invalid taskId! One or more tasks do not exist." });
    }

    const project = new Project({
      name,
      description,
      tasks: tasks || [],
      users,
    });

    const newProject = await project.save();

    await User.updateMany(
      { _id: { $in: users } },
      { $push: { projects: newProject._id } }
    );

    if (tasks) {
      await Task.updateMany(
        { _id: { $in: tasks } },
        { $push: { projects: newProject._id } }
      );
    }

    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create project" });
  }
};


//get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate({
        path: "users",
        select: "name surname username email",
      })
      .populate({
        path: "tasks",
        select: "title description",
      });

    res.json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//get project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate({
        path: "users",
        select: "name surname username email",
      })
      .populate({
        path: "tasks",
        select: "title description",
      });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


//update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, users, tasks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid project ID" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project ID does not exist" });
    }

    if (!name || !description) {
      return res.status(400).json({
        error: "Name and description are required fields",
      });
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        error: "Invalid name format! Name should only contain letters and spaces.",
      });
    }

    const descriptionRegex = /^[A-Za-z\s]+$/;
    if (!descriptionRegex.test(description)) {
      return res.status(400).json({
        error: "Invalid description format! Description should only contain letters and spaces.",
      });
    }

    if (!Array.isArray(users) || !users.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid 'users' field. It should be an array of valid ObjectId." });
    }

    if (!Array.isArray(tasks) || !tasks.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid 'tasks' field. It should be an array of valid ObjectId." });
    }

    // Update the project data
    project.name = name;
    project.description = description;

    // Add new tasks to the existing tasks array
    project.tasks.push(...tasks);

    // Add new users to the existing users array
    project.users.push(...users);

    await project.save();

    // Update the tasks with the project ID
    await Task.updateMany({ _id: { $in: tasks } }, { $addToSet: { projects: id } });

    // Update the users with the project ID
    await User.updateMany({ _id: { $in: users } }, { $addToSet: { projects: id } });

    const populatedProject = await Project.findById(id).populate({
      path: "users",
      select: "id name surname email username",
    }).exec();

    res.status(200).json(populatedProject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update project" });
  }
};





















//delete project
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log("Received project ID for deletion:", projectId);

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    await User.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    await Task.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
