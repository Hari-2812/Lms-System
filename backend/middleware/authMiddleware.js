import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found for this token');
    }

    req.user = user;
    next();
  } catch (_err) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

export const admin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
    return;
  }

  res.status(403);
  throw new Error('Admin only');
};

export const mentor = (req, res, next) => {
  if (req.user?.role === 'mentor' || req.user?.role === 'admin') {
    next();
    return;
  }

  res.status(403);
  throw new Error('Mentor only');
};

export const student = (req, res, next) => {
  if (req.user?.role === 'student') {
    next();
    return;
  }

  res.status(403);
  throw new Error('Student only');
};
