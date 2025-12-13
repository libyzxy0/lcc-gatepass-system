import { Request, Response } from "express";
import db from '@/db/drizzle'
import { visitor } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateRefreshToken, generateVisitorID } from '@/utils'

type Visitor = typeof visitor.$inferSelect;

class VisitorController {
  async registerVisitor(req: Request, res: Response) {
    try {
      const {
        firstname,
        lastname,
        middle_initial,
        email,
        phone_number,
        pin,
        valid_id_type,
        valid_id_photo_url,
        photo_url
      } = req.body;
      
      await db.insert(visitor).values({
        visitor_id: generateVisitorID(),
        firstname,
        lastname,
        middle_initial,
        email,
        phone_number,
        pin,
        valid_id_type,
        valid_id_photo_url,
        photo_url
      })
      console.log("gooddds:", req.body)
      res.status(200).json({
        success: true,
        data: {
          phone_number,
          pin
        }
      })
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      res.status(500).json({
        message: "Failed to register visitor, something went wrong"
      })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { phone_number, pin } = req.body;
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

      const accessToken = generateRefreshToken(visitorData[0].id);

      return res.status(200).json({
        message: "Login successful",
        access_token: accessToken,
      });
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async checkNum(req: Request, res: Response) {
    try {
      const { phone_number } = req.body;
      const visitorData = await db.select().from(visitor).where(eq(visitor.phone_number, phone_number));
      console.log(visitorData);
      if (visitorData.length <= 0) {
        return res.status(404).json({
          error: "No visitor associated with that phone number."
        })
      }

      res.status(200).json({
        success: true
      });
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      res.status(500).json({
        error: "Failed to get visitor, something went wrong"
      })
    }
  }

  async getSession(req: Request, res: Response) {
    try {
      if (!req.visitor) {
        return res.status(401).json({ message: "Unauthorized access!" });
      }

      console.log(req.visitor)

      const adminData: Visitor[] = await db
        .select()
        .from(visitor)
        .where(eq(visitor.id, req.visitor.id));

      const {
        id,
        firstname,
        lastname,
        middle_initial,
        email,
        phone_number,
        valid_id_type,
        valid_id_photo_url,
        photo_url,
        created_at,
        verified,
        activated
      } = adminData[0];

      return res.json({
        id,
        firstname,
        lastname,
        middle_initial,
        email,
        phone_number,
        valid_id_type,
        valid_id_photo_url,
        photo_url,
        created_at,
        verified,
        activated
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

      res.status(200).json({ message: "Visitor updated successfully" })
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error);
      res.status(500).json({
        error: "Failed to update visitor, something went wrong"
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