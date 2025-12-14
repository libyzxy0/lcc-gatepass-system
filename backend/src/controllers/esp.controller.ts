import { Request, Response } from "express";
import db from '@/db/drizzle'
import { student } from '@/db/schema'
import { eq } from 'drizzle-orm'

class ESPController {
  async rfid(req: Request, res: Response) {
    try {
      const { apikey, rfid_code, time } = req.body;
      
      console.log(JSON.stringify(req.body, null, 2) + '\n');
      
      res.status(200).json({
        code: 'RFID_OK'
      })
    } catch (error) {
      console.error("[ERROR ESP CONTROLLER]:", error);
      res.status(500).json({
        code: 'RFID_NOT_OK'
      })
    }
  }
  async config(req: Request, res: Response) {
    try {
      const { apikey } = req.query;
      console.log(apikey);
      
      res.status(200).json({
        emergency_open: false
      })
    } catch (error) {
      console.error("[ERROR ESP CONTROLLER]:", error);
      res.status(500).json({
        code: 'CONFIG_NOT_OK'
      })
    }
  }
}

export default new ESPController();