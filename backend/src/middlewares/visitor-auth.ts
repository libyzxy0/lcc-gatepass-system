import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { getAccessTokenFromHeaders } from '@/utils'

export const visitor_auth = async (req: Request, res: Response, next) => {
  try {
    const token = getAccessTokenFromHeaders(req);
    const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.visitor = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized access!' });
  }
};