import { createError } from "./error.js";
import jwt from "jsonwebtoken";

// VERIFY TOKEN
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT, (error, user) => {
    if (error) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

// VERIFY USER TOKEN
export const verifyUser = async (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// VERIFY IF ADMIN
export const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
