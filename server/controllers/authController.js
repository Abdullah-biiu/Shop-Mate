import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { generateEmailTemplate } from "../utils/generateForgotPasswordEmailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

// ============================
// REGISTER
// ============================

export const register = catchAsyncErrors(
  async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(
        new ErrorHandler(
          "Please provide all required fields.",
          400
        )
      );
    }

    if (
      password.length < 8 ||
      password.length > 16
    ) {
      return next(
        new ErrorHandler(
          "Password must be between 8 and 16 characters.",
          400
        )
      );
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = await database.query(
      "SELECT * FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return next(
        new ErrorHandler(
          "User already registered with this email.",
          400
        )
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await database.query(
      `INSERT INTO users
       (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        name.trim(),
        normalizedEmail,
        hashedPassword,
      ]
    );

    sendToken(
      user.rows[0],
      201,
      "User registered successfully",
      res
    );
  }
);

// ============================
// LOGIN
// ============================

export const login = catchAsyncErrors(
  async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ErrorHandler(
          "Please provide email and password.",
          400
        )
      );
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await database.query(
      `SELECT * FROM users
       WHERE LOWER(email) = $1
       LIMIT 1`,
      [normalizedEmail]
    );

    // User doesn't exist
    if (user.rows.length === 0) {
      console.log(
        "Login failed: user not found:",
        normalizedEmail
      );

      return next(
        new ErrorHandler(
          "Invalid email or password.",
          401
        )
      );
    }

    // Check password
    const isPasswordMatch =
      await bcrypt.compare(
        password,
        user.rows[0].password
      );

    if (!isPasswordMatch) {
      console.log(
        "Login failed: incorrect password for:",
        normalizedEmail
      );

      return next(
        new ErrorHandler(
          "Invalid email or password.",
          401
        )
      );
    }

    console.log(
      "Login successful:",
      normalizedEmail
    );

    sendToken(
      user.rows[0],
      200,
      "Logged In.",
      res
    );
  }
);

// ============================
// GET CURRENT USER
// ============================

export const getUser = catchAsyncErrors(
  async (req, res, next) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

// ============================
// LOGOUT
// ============================

export const logout = catchAsyncErrors(
  async (req, res, next) => {
    const isProduction =
      process.env.NODE_ENV === "production";

    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction
          ? "none"
          : "lax",
        path: "/",
      })
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  }
);

// ============================
// FORGOT PASSWORD
// ============================

export const forgotPassword = catchAsyncErrors(
  async (req, res, next) => {
    const { email } = req.body;

    // Always use production frontend URL from Render
    const frontendUrl =
      process.env.FRONTEND_URL ||
      req.query.frontendUrl;

    if (!frontendUrl) {
      return next(
        new ErrorHandler(
          "Frontend URL is not configured.",
          500
        )
      );
    }

    const userResult = await database.query(
      "SELECT * FROM users WHERE LOWER(email) = $1",
      [email.trim().toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return next(
        new ErrorHandler(
          "User not found with this email.",
          404
        )
      );
    }

    const user = userResult.rows[0];

    const {
      hashedToken,
      resetPasswordExpireTime,
      resetToken,
    } = generateResetPasswordToken();

    await database.query(
      `UPDATE users
       SET reset_password_token = $1,
           reset_password_expire = to_timestamp($2)
       WHERE email = $3`,
      [
        hashedToken,
        resetPasswordExpireTime / 1000,
        user.email,
      ]
    );

    const cleanFrontendUrl =
      frontendUrl.replace(/\/$/, "");

    const resetPasswordUrl =
      `${cleanFrontendUrl}/password/reset/${resetToken}`;

    const message =
      generateEmailTemplate(
        resetPasswordUrl
      );

    try {
      await sendEmail({
        email: user.email,
        subject:
          "Ecommerce Password Recovery",
        message,
      });

      return res.status(200).json({
        success: true,
        message:
          `Email sent to ${user.email} successfully.`,
      });
    } catch (error) {
      console.log(
        "Password reset email error:",
        error
      );

      await database.query(
        `UPDATE users
         SET reset_password_token = NULL,
             reset_password_expire = NULL
         WHERE email = $1`,
        [user.email]
      );

      return next(
        new ErrorHandler(
          "Email could not be sent.",
          500
        )
      );
    }
  }
);

// ============================
// RESET PASSWORD
// ============================

export const resetPassword = catchAsyncErrors(
  async (req, res, next) => {
    const { token } = req.params;

    const resetPasswordToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await database.query(
      `SELECT * FROM users
       WHERE reset_password_token = $1
       AND reset_password_expire > NOW()`,
      [resetPasswordToken]
    );

    if (user.rows.length === 0) {
      return next(
        new ErrorHandler(
          "Invalid or expired reset token.",
          400
        )
      );
    }

    const {
      password,
      confirmPassword,
    } = req.body;

    if (
      password !== confirmPassword
    ) {
      return next(
        new ErrorHandler(
          "Passwords do not match.",
          400
        )
      );
    }

    if (
      !password ||
      password.length < 8 ||
      password.length > 16
    ) {
      return next(
        new ErrorHandler(
          "Password must be between 8 and 16 characters.",
          400
        )
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const updatedUser =
      await database.query(
        `UPDATE users
         SET password = $1,
             reset_password_token = NULL,
             reset_password_expire = NULL
         WHERE id = $2
         RETURNING *`,
        [
          hashedPassword,
          user.rows[0].id,
        ]
      );

    sendToken(
      updatedUser.rows[0],
      200,
      "Password reset successfully",
      res
    );
  }
);

// ============================
// UPDATE PASSWORD
// ============================

export const updatePassword =
  catchAsyncErrors(
    async (req, res, next) => {
      const {
        currentPassword,
        newPassword,
        confirmPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        return next(
          new ErrorHandler(
            "Please provide all required fields.",
            400
          )
        );
      }

      const isPasswordMatch =
        await bcrypt.compare(
          currentPassword,
          req.user.password
        );

      if (!isPasswordMatch) {
        return next(
          new ErrorHandler(
            "Current password is incorrect.",
            401
          )
        );
      }

      if (
        newPassword !== confirmPassword
      ) {
        return next(
          new ErrorHandler(
            "Passwords do not match.",
            400
          )
        );
      }

      if (
        newPassword.length < 8 ||
        newPassword.length > 16
      ) {
        return next(
          new ErrorHandler(
            "Password must be between 8 and 16 characters.",
            400
          )
        );
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      await database.query(
        `UPDATE users
         SET password = $1
         WHERE id = $2`,
        [
          hashedPassword,
          req.user.id,
        ]
      );

      res.status(200).json({
        success: true,
        message:
          "Password updated successfully.",
      });
    }
  );

// ============================
// UPDATE PROFILE
// ============================

export const updateProfile =
  catchAsyncErrors(
    async (req, res, next) => {
      const { name, email } = req.body;

      if (!name || !email) {
        return next(
          new ErrorHandler(
            "Please provide all required fields.",
            400
          )
        );
      }

      if (
        name.trim().length === 0 ||
        email.trim().length === 0
      ) {
        return next(
          new ErrorHandler(
            "Name and email cannot be empty.",
            400
          )
        );
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      let avatarData = {};

      if (
        req.files &&
        req.files.avatar
      ) {
        const { avatar } = req.files;

        if (
          avatar.size >
          2 * 1024 * 1024
        ) {
          return next(
            new ErrorHandler(
              "Avatar size must be less than 2MB.",
              400
            )
          );
        }

        try {
          if (
            req.user?.avatar?.public_id
          ) {
            await cloudinary.uploader.destroy(
              req.user.avatar.public_id
            );
          }

          const newProfileImage =
            await cloudinary.uploader.upload(
              avatar.tempFilePath,
              {
                folder:
                  "Ecommerce_Avatars",
                transformation: [
                  {
                    width: 150,
                    crop: "scale",
                  },
                ],
              }
            );

          avatarData = {
            public_id:
              newProfileImage.public_id,
            url:
              newProfileImage.secure_url,
          };
        } catch (error) {
          console.log(
            "Cloudinary Upload Error:",
            error
          );

          return next(
            new ErrorHandler(
              "Avatar upload failed. Please check Cloudinary setup.",
              500
            )
          );
        }
      }

      let user;

      try {
        if (
          Object.keys(avatarData)
            .length === 0
        ) {
          user =
            await database.query(
              `UPDATE users
               SET name = $1,
                   email = $2
               WHERE id = $3
               RETURNING *`,
              [
                name.trim(),
                normalizedEmail,
                req.user.id,
              ]
            );
        } else {
          user =
            await database.query(
              `UPDATE users
               SET name = $1,
                   email = $2,
                   avatar = $3
               WHERE id = $4
               RETURNING *`,
              [
                name.trim(),
                normalizedEmail,
                avatarData,
                req.user.id,
              ]
            );
        }
      } catch (error) {
        console.log(
          "Database Update Error:",
          error
        );

        return next(
          new ErrorHandler(
            "Database update failed.",
            500
          )
        );
      }

      res.status(200).json({
        success: true,
        message:
          "Profile updated successfully.",
        user: user.rows[0],
      });
    }
  );