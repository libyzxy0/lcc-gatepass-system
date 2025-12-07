import { Request, Response } from "express";
import db from '@/db/drizzle'
import { visitor } from '@/db/schema'
import { eq } from 'drizzle-orm'

class VisitorController {
  async registerVisitor(req: Request, res: Response) {
    try {
      const {
        firstname,
        lastname,
        middle_initial,
        email,
        phone_number,
        purpose_of_visit,
        office,
        visit_date
      } = req.body;
      await db.insert(visitor).values({
        firstname,
        lastname,
        middle_initial,
        email,
        phone_number,
        purpose_of_visit,
        office,
        visit_date
      })
      res.status(200).json({
        message: "Visitor added successfully"
      })
    } catch (error: unknown) {
      res.status(500).json({
        message: "Failed to add visitor, something went wrong"
      })
    }
  }

  async getVisitor(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const visitorData = await db.select().from(visitor).where(eq(visitor.id, id));
      if (visitorData.length <= 0) {
        return res.status(404).json({
          error: "No product associated with that ID"
        })
      }
      res.status(200).json(visitorData[0])
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      res.status(500).json({
        error: "Failed to delete visitor, something went wrong"
      })
    }
  }
}

export default new VisitorController();
