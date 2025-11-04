import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verifyToken(token) {
  try {
    console.log("Veryifying token")
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
