import { Request, Response } from "express";
import db from "@/db/drizzle";
import { admin } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from '@/utils'

type Admin = {
  id: string;
  firstname: string;
  lastname: string;
  role: 'admin' | 'staff';
  email: string;
  phone_number: string;
  password: string;
  is_super_admin: boolean;
  created_at: string;
};

class AdminController {
  async newAdmin(req: Request, res: Response) {
    try {
      const {
        firstname,
        lastname,
        role,
        email,
        phone_number,
        password,
        is_super_admin
      } = req.body;
      await db.insert(admin).values({
        firstname,
        lastname,
        role,
        email,
        phone_number,
        password,
        is_super_admin
      });
      res.status(200).json({
        message: "Admin created successfully",
      });
    } catch (error: any) {
      res.status(500).send({ message: "Something went wrong" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const adminData: Admin[] = await db
        .select()
        .from(admin)
        .where(eq(admin.email, email));

      if (adminData.length <= 0) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (adminData[0].password !== password) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const accessToken = generateAccessToken(adminData[0].id);
      const refreshToken = generateRefreshToken(adminData[0].id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login successful",
        access_token: accessToken,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
      }

      const decoded: any = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      );

      const newAccessToken = generateAccessToken(decoded.id);

      return res.status(200).json({
        access_token: newAccessToken,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
  }

  async getSession(req: Request, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Unauthorized access!" });
      }

      const adminData: Admin[] = await db
        .select()
        .from(admin)
        .where(eq(admin.id, req.admin.id));

      return res.json(adminData[0]);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
}

export default new AdminController();
