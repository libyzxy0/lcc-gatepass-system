import { Request, Response } from "express";
import db from '@/db/drizzle'
import { visitor } from '@/db/schema'
import { eq } from 'drizzle-orm'

class QRCodeController {
  async verifyQR(req: Request, res: Response) {
    try {
      res.status(200).json({
        message: "Hi world"
      })
    } catch (error: unknown) {
      res.status(500).json({
        message: "Failed to add product, something went wrong"
      })
    }
  }
}

export default new QRCodeController();