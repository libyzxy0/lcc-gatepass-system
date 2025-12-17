import { Request, Response } from "express";
import db from '@/db/drizzle'
import { visitor } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateVisitorToken, generateVisitorID } from '@/utils'

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
  async registerVisitor(req: Request, res: Response) {
    try {
      if (!req.body) {
        res.status(400).json({
          error: "Failed to register visitor, missing request body!"
        })
      }
      await db.insert(visitor).values({
        visitor_id: generateVisitorID(),
        ...req.body
      })
      res.status(200).json({
        message: `Account for ${req.body.phone_number} created successfully!`
      })
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      res.status(500).json({
        error: "Failed to register visitor, something went wrong"
      })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { phone_number, pin } = req.body;
      console.log({ phone_number, pin });
      const visitorData: Visitor[] = await db
        .select()
        .from(visitor)
        .where(eq(visitor.phone_number, phone_number));

      if (visitorData.length <= 0) {
        return res.status(404).json({ message: "No visitor associated with that phone number." });
      }

      if (visitorData[0].pin !== pin) {
        return res.status(400).json({ message: "Please enter the correct pin" });
      }

      const accessToken = generateVisitorToken(visitorData[0].id);

      return res.status(200).json({
        message: "Login successful",
        access_token: accessToken,
      });
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error.message);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async checkPhoneNumber(req: Request, res: Response) {
    try {
      const { phone_number } = req.body;

      const visitorData = await db.select({ id: visitor.id, activated: visitor.activated }).from(visitor).where(eq(visitor.phone_number, phone_number)) ?? null;

      if (visitorData.length === 0) {
        res.status(404).json({
          error: "Phone number not signed!"
        });
      }

      console.log(visitorData[0]);

      res.status(200).json(visitorData[0]);

    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      res.status(500).json({
        error: "Failed to get visitor, something went wrong"
      })
    }
  }

  async getSession(req: VisitorRequest, res: Response) {
    try {
      if (!req.visitor) {
        return res.status(401).json({ message: "Unauthorized access!" });
      }

      const visitorData: VisitorSession[] = await db
        .select({
          id: visitor.id,
          visitor_id: visitor.visitor_id,
          firstname: visitor.firstname,
          lastname: visitor.lastname,
          middle_initial: visitor.middle_initial,
          email: visitor.email,
          phone_number: visitor.phone_number,
          verified: visitor.verified,
          activated: visitor.activated,
          valid_id_type: visitor.valid_id_type,
          valid_id_photo_url: visitor.valid_id_photo_url,
          photo_url: visitor.photo_url,
          created_at: visitor.created_at,
        })
        .from(visitor)
        .where(eq(visitor.id, req.visitor.id));

      return res.json({
        ...visitorData[0],
        middle_initial: visitorData[0].middle_initial === '' ? null : visitorData[0].middle_initial
      });
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  async getVisitor(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const visitorData = await db.select().from(visitor).where(eq(visitor.id, id));
      if (visitorData.length <= 0) {
        return res.status(404).json({
          error: "No visitor associated with that ID"
        })
      }
      res.status(200).json(visitorData[0])
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      res.status(500).json({
        error: "Failed to get visitor, something went wrong"
      })
    }
  }

  async getVisitors(req: Request, res: Response) {
    const visitors = await db.select().from(visitor);
    if (visitors.length <= 0) {
      return res.status(404).json({
        error: "No visitor added on the database yet."
      })
    }
    res.status(200).json(visitors)
  }

  async updateVisitor(req: Request, res: Response) {
    try {
      const { id, fields } = req.body;

      if (!fields) {
        return res.status(400).json({
          error: "Specify a fields to be updated"
        })
      }

      const visitorData = await db.select().from(visitor).where(eq(visitor.id, id));
      if (visitorData.length <= 0) {
        return res.status(404).json({
          error: "No visitor associated with that ID"
        })
      }

      await db.update(visitor)
        .set(fields)
        .where(eq(visitor.id, visitorData[0].id));

      res.status(200).json({ message: "Successfully updated your account information" })
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      res.status(500).json({
        error: "Failed to update account information, something went wrong"
      })
    }
  }

  async deleteVisitor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const visitorData = await db.select().from(visitor).where(eq(visitor.id, id));
      if (visitorData.length <= 0) {
        return res.status(404).json({
          error: "No visitor associated with that ID"
        })
      }

      await db.delete(visitor)
        .where(eq(visitor.id, visitorData[0].id));

      res.status(200).json({ message: "Visitor deleted successfully" })
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      res.status(500).json({
        error: "Failed to delete visitor, something went wrong"
      })
    }
  }
}

export default new VisitorController();