import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from "express";
import { getAccessTokenFromHeaders } from '@/utils'
import { JWT_ACCESS_SECRET } from '@/secrets'

interface TokenDecodedType {
  id: string;
  iat: number;
  exp: number;
}

interface AdminRequest extends Request {
  admin?: TokenDecodedType;
}

export const admin_auth = async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const token = getAccessTokenFromHeaders(req);
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as TokenDecodedType;
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized access!' });
  }
};