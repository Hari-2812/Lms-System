import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// 🔐 PROTECT
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (err) {
      res.status(401);
      throw new Error("Invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("No token");
  }
});

// 👨‍💼 ADMIN
export const admin = (req, res, next) => {
  if (req.user?.role === "admin") next();
  else {
    res.status(403);
    throw new Error("Admin only");
  }
};

// 🧑‍🏫 MENTOR
export const mentor = (req, res, next) => {
  if (req.user?.role === "mentor") next();
  else {
    res.status(403);
    throw new Error("Mentor only");
  }
};

// 🎓 STUDENT
export const student = (req, res, next) => {
  if (req.user?.role === "student") next();
  else {
    res.status(403);
    throw new Error("Student only");
  }
};