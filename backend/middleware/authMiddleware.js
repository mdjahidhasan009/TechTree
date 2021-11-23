import jwt from 'jsonwebtoken';
import expressAsyncHandler from "express-async-handler";

import User from '../models/userModel.js';

const protect = expressAsyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;
  if(req.headers.authorization && token.startsWith('Bearer')) {
  } else {
    res.status(401);
    throw new Error('Not authorized, No token');
  }
  try {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select('-password');
  } catch (e) {
    console.error(e);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
  next();
})

const isAdmin = expressAsyncHandler(async(req, res, next) => {
  if(req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, user is not an admin');
  }
})

export { protect, isAdmin };
