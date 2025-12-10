import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { getAccessTokenFromHeaders } from '@/utils'

export const admin_auth = async (req: Request, res: Response, next) => {
  try {
    const token = getAccessTokenFromHeaders(req);
    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized access!' });
  }
};