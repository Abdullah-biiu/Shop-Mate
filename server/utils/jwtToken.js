import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, message, res) => {
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    }
  );

  const cookieExpiresDays =
    Number(process.env.COOKIE_EXPIRES_IN) || 30;

  const isProduction = process.env.NODE_ENV === "production";

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() +
          cookieExpiresDays * 24 * 60 * 60 * 1000
      ),

      httpOnly: true,

      // Required for HTTPS production
      secure: isProduction,

      // Render frontend/backend are on HTTPS
      sameSite: isProduction ? "none" : "lax",

      path: "/",
    })
    .json({
      success: true,
      user,
      message,
      token,
    });
};