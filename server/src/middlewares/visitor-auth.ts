import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from "express";
import { getAccessTokenFromHeaders } from '@/utils'
import { JWT_ACCESS_SECRET } from '@/secrets'
import db from '@/db/drizzle'
import { visitor } from '@/db/schema'

interface TokenDecodedType {
  id: string;
  iat: number;
  exp: number;
}

interface VisitorRequest extends Request {
  visitor?: TokenDecodedType;
}

export const visitor_auth = async (req: VisitorRequest, res: Response, next: NextFunction) => {
  try {
    const token = getAccessTokenFromHeaders(req);
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as TokenDecodedType;
    
    req.visitor = decoded;
    next();
  } catch (error) {
   // console.error("[ERROR VISITOR AUTH MIDDLEWARE]:", error);
    res.status(401).send({ error: 'Unauthorized access!' });
  }
};