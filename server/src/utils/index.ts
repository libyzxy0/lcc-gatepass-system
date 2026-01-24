import { Request } from "express";
import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_QR_SECRET
} from '@/secrets'

export const getAccessTokenFromHeaders = (req: Request) => {
  const authHeader = req?.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return token;
}

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export const generateVisitorToken = (id: string) => {
  return jwt.sign({ id }, JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });
}

export const generateQRToken = (id: string) => {
  return jwt.sign({ id }, JWT_QR_SECRET, {
    expiresIn: "7d",
  });
}

export const generateVisitorID = () => {
  const digit4 = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  const year = new Date().getFullYear();
  return `VST${year}${digit4}`
}
export const generateStaffID = () => {
  const digit4 = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  const year = new Date().getFullYear();
  return `STF${year}${digit4}`
}
export const generateLogID = () => {
  const digit4 = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  const year = new Date().getFullYear();
  return `LOG${year}${digit4}`
}
export const generateQRPassID = () => {
  const digit4 = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  const year = new Date().getFullYear();
  return `QRC${year}${digit4}`
}