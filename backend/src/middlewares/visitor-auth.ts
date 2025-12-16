import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from "express";
import { getAccessTokenFromHeaders } from '@/utils'
import { JWT_ACCESS_SECRET } from '@/secrets'

interface TokenDecodedType {
  id: string;
  iat: number;
  exp: number;
}

export const visitor_auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getAccessTokenFromHeaders(req);
    const decoded: TokenDecodedType = jwt.verify(token, JWT_ACCESS_SECRET);
    req.visitor = decoded;
    next();
  } catch (error) {
   // console.error("[ERROR VISITOR AUTH MIDDLEWARE]:", error);
    res.status(401).send({ error: 'Unauthorized access!' });
  }
};