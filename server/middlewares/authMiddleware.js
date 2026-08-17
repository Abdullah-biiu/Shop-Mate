import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import database from "../database/db.js";

export const isAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    let token = null;

    // ============================
    // 1. Check Authorization Header
    // ============================

    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    // ============================
    // 2. Check Cookie
    // ============================

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // ============================
    // 3. No Token
    // ============================

    if (!token) {
      return next(
        new ErrorHandler(
          "Please login to access this resource.",
          401
        )
      );
    }

    // ============================
    // 4. Verify JWT
    // ============================

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );
    } catch (error) {
      console.log("JWT verification failed:", error.message);

      return next(
        new ErrorHandler(
          "Invalid or expired token.",
          401
        )
      );
    }

    // ============================
    // 5. Find User
    // ============================

    const user = await database.query(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [decoded.id]
    );

    if (user.rows.length === 0) {
      return next(
        new ErrorHandler(
          "User no longer exists.",
          401
        )
      );
    }

    req.user = user.rows[0];

    next();
  }
);

// ============================
// Authorized Roles
// ============================

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ErrorHandler(
          "User not authenticated.",
          401
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource.`,
          403
        )
      );
    }

    next();
  };
};