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
      const event = req.body;
      const payload = JSON.parse(event.payload);

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

        console.log({
          time_in: `${localDate} ${localTime}`,
          detail: {
            purpose: data.gatepass.purpose,
            description: data.gatepass.description
          },
          visitor: {
            name: data.visitor.firstname + " " + data.visitor.lastname,
            verified: data.visitor.verified
          }
        });
        await tg_api(`${encodeURIComponent(`${data.gatepass.purpose} by ${data.visitor.firstname}`)}`);
        res.status(200).json(data);
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