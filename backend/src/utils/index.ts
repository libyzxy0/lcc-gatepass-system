import { Request } from "express";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process?.env?.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process?.env?.JWT_REFRESH_SECRET;

if(!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET cannot be found on engironment variables.")
}
if(!JWT_REFRESH_SECRET) {
  throw new Error("JWT_ACCESS_SECRET cannot be found on engironment variables.")
}

export const getAccessTokenFromHeaders = (req: Request) => {
  const authHeader = req?.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return token;
}

export const generateAccessToken = (id: string) => {
  try {
    const token = jwt.sign({ id }, JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    return token;
  } catch (error) {
    return null;
    console.error("Token error:", error);
  }

}

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
}

export const generateVisitorID = () => {
  const digit4 = Math.floor(Math.random() * (1000 - 9999 + 1)) + 1000;
  const year = new Date().getFullYear();
  return `VST${year}${digit4}`
}