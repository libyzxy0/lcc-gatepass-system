import { Request } from "express";
import jwt from "jsonwebtoken";
export const getAccessTokenFromHeaders = (req: Request) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return token;
}

export const generateAccessToken = (id: string) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "15m",
    });
    return token;
  } catch (error) {
    return null;
    console.error("Token error:", error);
  }

}

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "30d",
  });
}

export const generateVisitorID = () => {
  const digit4 = Math.floor(Math.random() * (1000 - 9999 + 1)) + 1000;
  const year = new Date().getFullYear();
  return `VST${year}${digit4}`
}