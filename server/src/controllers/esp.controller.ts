import { Request, Response } from "express";
import db from '@/db/drizzle'
import { student } from '@/db/schema'
import { eq } from 'drizzle-orm'
import axios from 'axios'
import { tg_api } from '@/sms-api/tgapi'
import EspService from '@/services/esp.service'

class ESPController {
  static async handleEvent(req: Request, res: Response) {
    try {
      const payload = req.body;
      console.log(payload);
      console.log("==================");
      const localDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        day: 'numeric',
        month: 'long'
      });

      const localTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      if (payload.topic === `${process.env.NODE_ENV === 'production' ? 'scan/qr' :'dev/scan/qr'}`) {
        try {
          const data = await EspService.verifyQR(payload.data);

          tg_api(encodeURIComponent(`<b>SCANNED</b>\n[Debug Notification]\n\n<b>Name</b>: ${data.visitor.firstname + " " + data.visitor.lastname}\n<b>Purpose</b>: ${data.gatepass.purpose}\n<b>Description</b>: ${data.gatepass.description}\n<b>Time</b>: ${localDate} ${localTime}\n\n<i>Received from ${process.env.NODE_ENV === 'production' ? "Production Server" : "Development Server"}</i>`));

          return res.json({
            status: 'ok',
            id: data.visitor.id,
            name: data.visitor.firstname + " " + data.visitor.lastname
          })
        } catch (error) {
          return res.json({
            status: 'bad'
          })
        }

      } else if (payload.topic == `${process.env.NODE_ENV === 'production' ? 'scan/rfid' : 'dev/scan/rfid'}`) {
        try {
          const rfid_verification = await EspService.verifyRFID(payload.data);
          console.log(rfid_verification)
          tg_api(encodeURIComponent(`<b>SCANNED</b>\n[Debug Notification]\n\n<b>Name</b>: ${rfid_verification.firstname + " " + rfid_verification.lastname}\n<b>Section</b>: ${rfid_verification.section}\n<b>Student ID:RFID</b>: ${rfid_verification.student_id}:${rfid_verification.rfid_code}\n<b>Time</b>: ${localDate} ${localTime}\n\n<i>Received from ${process.env.NODE_ENV === 'production' ? "Production Server" : "Development Server"}</i>`));
          return res.json({
            status: 'ok',
            id: rfid_verification.id,
            name: rfid_verification.firstname + " " + rfid_verification.lastname
          })
        } catch (error) {
          return res.json({
            status: 'bad'
          })
        }
      }


    } catch (error) {
      console.error(error.message, error.status || 500);
      res.status(500).json({
        error: 'An error occurred while listening to event!'
      })
    }
  }
}

export default ESPController;