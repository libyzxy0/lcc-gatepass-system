import { Request, Response } from "express";
import db from '@/db/drizzle'
import { visit } from '@/db/schema'
import { eq } from 'drizzle-orm'

class QRController {
  async getQR(req: Request, res: Response) {
    try {
      const { visit_id } = req.body;
      
      const visitData = await db.select().from(visit).where(eq(visit.id, visit_id));
      
    } catch (error) {
      console.error("[ERROR QR CONTROLLER]:", error);
      res.status(500).json({
        error: 'Failed to get gatepass qrcode data'
      })
    }
  }
}

export default new QRController();