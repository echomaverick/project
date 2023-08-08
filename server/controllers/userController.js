const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const Role = require("../models/roleModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//create a user
// const createUser = async(req, res) => {
//   try{
//     const { name, surname, username, email, role} = req.body;
//     if(!name || !surname || !username || !email || !role){
//       return res.status(404).json({error: 'Name, surname, username, email and role are required'})
//     }

//     const nameRegex = /^[A-Za-z\s]+$/;
//     if (!nameRegex.test(name)) {
//       return res.status(404).json({ error: 'Invalid name format! Name should only contain letters and spaces.' });
//     }

//     const existingUsername = await User.findOne({ username });
//     if (existingUsername) {
//       return res.status(409).json({ error: 'Username already exists! Please choose a different username.' });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
//     if(!emailRegex.test(email)){
//       return res.status(404).json({error: 'Invalid email format'});
//     }

//     const emailExists = await User.findOne({ email });
//     if (emailExists) {
//       return res.status(409).json({ error: 'Email already exists! Please use a different email address.' });
//     }

//     const existingRole = await Role.findById(role);
//     if (!existingRole) {
//       return res.status(404).json({ error: 'Invalid role ID! Role does not exist.' });
//     }

//     const newUser = new User ({name, surname, username, email, role});
//     const savedUser = await newUser.save();
//     res.status(200).json(savedUser);
//   }catch(error){
//     console.log(error);
//     res.status(500).json({error: 'An error occurred'});
//   }
// };

const createUser = async (req, res) => {
  try {
    const { name, surname, username, email, password, role } = req.body;
    if (!name || !surname || !username || !email || !password || !role) {
      return res.status(404).json({ error: "All fields are required!" });
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid name format! Name should only contain letters and spaces.",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format!" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(404)
        .json({ error: "Username already exists! Try a different one" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(404)
        .json({ error: "Email already exists! Try a different one" });
    }

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(404)
        .json({
          error:
            "Invalid password format! Password must be at least 8 characters long and should contain at least one number, one letter and one symbol",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      role,
    });
    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ user: savedUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};



//login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(404).json({ error: "Username and password are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Invalid username" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username }, 
      process.env.SECRET_KEY,
      { expiresIn: "5h" }
    );

    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: "30d" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};



//refreshToken
const refreshAccessToken = async (req,res) =>{
  try{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
      return res.status(404).json({error: 'Refresh token not found'});
    }
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (error, decoded) => {
      if(error){
        return res.status(404).json({error: 'Invalid refresh token'});
      }
      const newAccessToken = jwt.sign({userId: decoded.userId}, process.env.SECRET_KEY, {expiresIn: '5h'});
      res.json({token: newAccessToken});
    });
  }catch(error){
    console.log(error);
    res.status(500).json({error: 'An error occurred'});
  }
}


//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("tasks", "title description")
      .populate("projects", "name description");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//get user by id
const getUserById = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId)
      .populate("tasks", "title description")
      .populate("projects", "name description");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
};

//update user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, tasks, projects } = req.body;

    if (!name || !email || !role || !tasks) {
      return res
        .status(404)
        .json({ error: "Name, email, role, tasks are required fields" });
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(404).json({ error: "Invalid email format!" });
    }

    const existingRole = await Role.findById(role);
    if (!existingRole) {
      return res
        .status(404)
        .json({ error: "Invalid role ID! Role does not exist." });
    }

    const existingTasks = await Task.find({ _id: { $in: tasks } });
    if (existingTasks.length !== tasks.length) {
      return res
        .status(404)
        .json({ error: "Invalid task ID! Task does not exist." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role, tasks, projects },
      { new: true }
    )
      .populate("tasks", "title description")
      .populate("projects", "name description");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//delete a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await Task.updateMany(
      { assignedTo: userId },
      { $pull: { assignedTo: userId } }
    );

    await Project.updateMany({ users: userId }, { $pull: { users: userId } });

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user." });
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
