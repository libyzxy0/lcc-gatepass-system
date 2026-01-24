import { Request, Response } from "express";
import AdminService from '@/services/admin.service'
import AuthService from '@/services/auth.service'
import { verifyTurnstile } from '@/utils/verify-cf-turnstile'

interface ITokenDecodedType {
  id: string;
  iat: number;
  exp: number;
}
interface IAdminRequest extends Request {
  admin?: ITokenDecodedType;
}

class AdminController {
  static async newAdmin(req: Request, res: Response) {
    try {
      const adm = req.body;

      const newAdmin = await AdminService.createAdmin({
        name: adm.name,
        role: adm.role,
        email: adm.email,
        phone_number: adm.phone_number,
        password: adm.password,
        photo_url: adm.photo_url ?? null
      });

      res.status(200).json({
        message: "Admin created successfully",
        data: {
          id: newAdmin.id,
          email: newAdmin.email
        }
      });
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  }
  static async login(req: Request, res: Response) {
    try {
      const { email, password, cloudflare_token } = req.body;

      /* Only verify CloudFlare turnstile in production */
      if (process.env.NODE_ENV === 'production') {
        const cloudflareTurnstile = await verifyTurnstile(cloudflare_token);
        if (!cloudflareTurnstile && !cloudflareTurnstile.success) {
          return res.status(403).json({ message: "Please verify CloudFlare captcha first to login" });
        }
      }

      const adminData = await AdminService.adminLogin({ email, password })

      const accessToken = AuthService.generateAdminAccessToken(adminData.id);
      const refreshToken = AuthService.generateAdminRefreshToken(adminData.id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: `You're currently logged in as ${adminData.email}`,
        access_token: accessToken,
      });

    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
      }

      const decoded = AuthService.verifyAdminRefreshToken(refreshToken)
      const newAccessToken = AuthService.generateAdminAccessToken(decoded.id);
      return res.status(200).json({
        access_token: newAccessToken,
      });
    } catch (error) {
      console.error("[ERROR ADMIN CONTROLLER]:", error);
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  }
  static async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
  }
  static async getSession(req: IAdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Unauthorized access!" });
      }
      const adminData = await AdminService.getAdmin(req.admin.id);
      return res.json(adminData);
    } catch (error) {
      return res.status(401).json({ error: "invalid or expired token" });
    }
  }
  static async getAll(req: Request, res: Response) {
    try {
      const admins = await AdminService.getAll();
      res.json(admins);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
  static async getOverviewCounts(req: Request, res: Response) {
    try {
      const result = await AdminService.getOverviewCounts();
      res.json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
  static async delete(req: Request, res: Response) {
    try {
      await AdminService.delete(req.params.id);
      res.json({ message: 'Admin successfully deleted' });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default AdminController;