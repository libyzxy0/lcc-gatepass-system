import { Request, Response } from "express";
import db from '@/db/drizzle'
import { visitor } from '@/db/schema'
import { eq } from 'drizzle-orm'
import VisitorService from '@/services/visitor.service'
import AuthService from '@/services/auth.service'

type Visitor = typeof visitor.$inferSelect;

type VisitorSession = Omit<Visitor, "pin"> & {
  pin?: string;
};

interface TokenDecodedType {
  id: string;
  iat: number;
  exp: number;
}

interface VisitorRequest extends Request {
  visitor?: TokenDecodedType;
}

class VisitorController {
  static async register(req: Request, res: Response) {
    try {
      const vst = req.body;

      const { phone_number } = await VisitorService.createVisitor({
        firstname: vst.firstname,
        lastname: vst.lastname,
        middle_initial: vst.middle_initial ?? null,
        email: vst.email,
        phone_number: vst.phone_number,
        pin: vst.pin
      })

      res.status(200).json({
        message: `Account for ${phone_number} created successfully!`
      })
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }
  static async login(req: Request, res: Response) {
    try {
      const { phone_number, pin } = req.body;

      if (!phone_number) return res.status(401).json({ error: "Please enter your mobile number" })
      if (!pin) return res.status(401).json({ error: "Please enter your pin" })

      const visitorData = await VisitorService.login({ phone_number, pin });

      const accessToken = AuthService.generateVisitorAccessToken(visitorData.id);

      return res.status(200).json({
        message: `Logged in as ${visitorData.phone_number}`,
        access_token: accessToken,
      });

    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
  static async getSession(req: VisitorRequest, res: Response) {
    try {
      if (!req.visitor) {
        return res.status(401).json({ error: "Unauthorized access!" });
      }

      const visitorData = await VisitorService.getVisitor(req.visitor.id);

      return res.json({
        ...visitorData,
        middle_initial: visitorData.middle_initial === '' ? null : visitorData.middle_initial
      });
    } catch (error) {
      return res.status(401).json({ error: "Failed to get session, please authenticate first" });
    }
  }
  static async updateAccount(req: Request, res: Response) {
    try {
      const { id, fields } = req.body;

      if (!fields) {
        return res.status(400).json({
          error: "Specify a fields to be updated"
        })
      }

      await VisitorService.updateVisitor({ id, fields })

      res.status(200).json({ message: "Successfully updated your account information" })
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }
  static async checkPhoneNumber(req: Request, res: Response) {
    try {
      const { phone_number } = req.body;

      const visitorData = await VisitorService.isThereVisitorWithNumber(phone_number);

      res.status(200).json(visitorData);

    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }
}

export default VisitorController;