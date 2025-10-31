import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Prevent XSS
    secure: process.env.NODE_ENV === "production", // Only HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-site cookies for Render + Vercel
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
