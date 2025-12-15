import { Request, Response } from "express";
import db from '@/db/drizzle'
import { student } from '@/db/schema'
import { eq } from 'drizzle-orm'
import axios from 'axios'

class ESPController {
  async rfid(req: Request, res: Response) {
    try {
      const { apikey, rfid_code, timestamp } = req.body;
      
      const studentData = await db.select().from(student).where(eq(student.rfid_code, rfid_code));
      
      const date = new Date(timestamp);

      const formattedJson =
        `*SCANNER OUTPUT*\n\nRFID: ${rfid_code}\nDate: ${date.toISOString()}\nName: ${studentData[0].firstname + " " + studentData[0].lastname}\nStudent ID: ${studentData[0].student_id}
        `;
        
      await axios.get(`https://api.telegram.org/bot7874310993:AAGT3B8Qr4LrMUdzRv_NNP9tlip1LAiYcTw/sendMessage?chat_id=5544405507&text=${formattedJson}&parse_mode=Markdown`);
      
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