import expressAsyncHandler from 'express-async-handler';

import User from "../models/userModel.js";
import generateToken from "../utills/generateToken.js";

// @desc    Authenticate user and get token
// @route   POST api/users/login
// @access  Public
const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password');
  }
})

// @desc    Register a new user
// @route   POST api/users/register
// @access  Public
const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExits = await User.findOne({ email });
  if(userExits) {
    res.status(400);
    throw new Error('User already exits');
  }
  const user = await User.create({
    name, email, password
  });
  if(user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(404);
    throw new Error('User not found!');
  }
})

// @desc    Get user profile
// @route   GET api/users/profile
// @access  Private
const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if(user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404);
    throw new Error('User not found!');
  }
})

// @desc    Update user profile
// @route   PUT api/users/profile
// @access  Private
const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if(user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if(req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id)
    })
  } else {
    res.status(404);
    throw new Error('User not found!');
  }
})

// @desc    Get all users
// @route   GET api/users
// @access  Private/Admin
const getUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
})

// @desc    Delete a user
// @route   DELETE api/users/:id
// @access  Private/Admin
const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if(user) {
    await user.remove();
    res.json({ message: 'User removed!'});
  } else {
    res.status(404);
    throw new Error('User not found!');
  }
})

// @desc    Delete a user
// @route   DELETE api/users/:id
// @access  Private/Admin
const getUserById = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if(user) res.json(user);
  else {
    res.status(404);
    throw new Error('User not found!');
  }
});

// @desc    Update any user
// @route   PUT api/users/:id
// @access  Private/Admin
const updateUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if(user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } else {
    res.status(404);
    throw new Error('User not found!');
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
}
