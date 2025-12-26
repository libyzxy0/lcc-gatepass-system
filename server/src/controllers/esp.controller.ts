import { Request, Response } from "express";
import db from '@/db/drizzle'
import { student } from '@/db/schema'
import { eq } from 'drizzle-orm'
import axios from 'axios'
import { tg_api } from '@/sms-api/tgapi'
import EspService from '@/services/esp.service'

class ESPController {
  async handleEvent(req: Request, res: Response) {
    try {
      const payload = req.body;

      const localDate = new Date(
        payload.time).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          day: 'numeric',
          month: 'long'
        });

      const localTime = new Date(payload.time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      if (payload.action == 'SCAN_QR') {
        const data = await EspService.verifyQR(payload.data);
        
        const resp = {
          time_in: `${localDate} ${localTime}`,
          detail: {
            purpose: data.gatepass.purpose,
            description: data.gatepass.description
          },
          visitor: {
            name: data.visitor.firstname + " " + data.visitor.lastname,
            verified: data.visitor.verified
          }
        }

        console.log(resp);
       tg_api(encodeURIComponent(`<b>SCANNED</b>\n[Debug Notification]\n\n<b>Name</b>: ${resp.visitor.name}\n<b>Purpose</b>: ${resp.detail.purpose}\n<b>Description</b>: ${resp.detail.description}\n<b>Time</b>: ${localDate} ${localTime}\n\n<i>Received from ESP32 MQTT powered by HiveMQ</i>`));
        res.status(200).json(resp);
      }


    } catch (error) {
      console.error(error.message, error.status || 500);
      res.status(500).json({
        error: 'An error occurred while listening to event!'
      })
    }
  }
}

export default new ESPController();