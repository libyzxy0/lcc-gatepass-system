import { Request, Response } from "express";
import db from '@/db/drizzle'
import { visitor, visit } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { generateVisitorToken, generateVisitorID } from '@/utils'

type Visitor = typeof visitor.$inferSelect;
type Visits = typeof visit.$inferSelect;

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
  async register(req: Request, res: Response) {
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
      const visitorData: Visitor[] = await db
        .select()
        .from(visitor)
        .where(eq(visitor.phone_number, phone_number));

      if (visitorData.length <= 0) {
        return res.status(404).json({ error: "Invalid Phone Number" });
      }

      if (visitorData[0].pin !== pin) {
        return res.status(400).json({ error: "Incorrect Pin" });
      }

      const accessToken = generateVisitorToken(visitorData[0].id);

      return res.status(200).json({
        message: "Login successful",
        access_token: accessToken,
      });
    } catch (error) {
      console.error("[ERROR VISITOR CONTROLLER]:", error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getSession(req: VisitorRequest, res: Response) {
    try {
      if (!req.visitor) {
        return res.status(401).json({ error: "Unauthorized access!" });
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
      console.error("[ERROR GET SESSION]:", error);
      return res.status(401).json({ error: "Failed to get session, please authenticate first" });
    }
  }
  
  async createVisit(req: VisitorRequest, res: Response) {
    try {
      const { purpose, description, visiting, date, secured } = req.body;
      
      await db.insert(visit).values({
        visitor_id: req.visitor.id,
        purpose,
        description,
        visiting,
        schedule_date: date,
        secured
      });
      
      return res.status(200).json({
        message: 'Visit request has been sent to Administrators!'
      })
      
    } catch (error) {
      console.error("[ERROR CREATE VISIT]:", error);
      return res.status(500).json({ error: "Failed to create visit, something went wrong!" });
    }
  }
  
  async visits(req: VisitorRequest, res: Response) {
    try {
      const visits: Visits[] = await db.select().from(visit).where(eq(visit.visitor_id, req.visitor.id)).orderBy(desc(visit.created_at))
      
      return res.status(200).json(visits);
    } catch (error) {
      console.error("[ERROR GET VISIT]:", error);
      return res.status(500).json({ error: "Failed to create visit, something went wrong!" });
    }
  }

  async updateAccount(req: Request, res: Response) {
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
  
  async checkPhoneNumber(req: Request, res: Response) {
    try {
      const { phone_number } = req.body;

      const visitorData = await db.select({ id: visitor.id }).from(visitor).where(eq(visitor.phone_number, phone_number)) ?? null;

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