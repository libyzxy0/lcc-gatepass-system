import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from "express";
import { getAccessTokenFromHeaders } from '@/utils'

interface TokenDecodedType {
  id: string;
  iat: number;
  exp: number;
}

export const admin_auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getAccessTokenFromHeaders(req);
    const decoded: TokenDecodedType = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("[ERROR ADMIN AUTH MIDDLEWARE]:", error);
    res.status(401).send({ error: 'Unauthorized access!' });
  }
};