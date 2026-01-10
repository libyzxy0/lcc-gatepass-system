import { Request, Response } from "express";
import { tg_api } from '@/sms-api/tgapi'
import EspService from '@/services/esp.service'
import LogService from '@/services/logs.service'

class ESPController {
  static async handleEvent(req: Request, res: Response) {
    try {
      const payload = req.body;
      console.log(payload);
      console.log("==================");
      const localDate = new Date().toLocaleDateString('en-PH', {
        weekday: 'long',
        year: 'numeric',
        day: 'numeric',
        month: 'long'
      });

      const localTime = new Date().toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      if (payload.topic === `${process.env.NODE_ENV === 'production' ? 'scan/qr' :'dev/scan/qr'}`) {
        try {
          const data = await EspService.verifyQR(payload.data);
          
          await LogService.create({
            name: data.visitor.firstname + " " + data.visitor.lastname,
            type: 'visitor',
            entity_id: data.visitor.id,
            entry_type: 'qr',
            device_id: 'esp-gate-01'
          })

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
          
          await LogService.create({
            name: `${rfid_verification.firstname + " " + rfid_verification.lastname}`,
            type: 'student',
            entity_id: rfid_verification.id,
            entry_type: 'rfid',
            device_id: 'esp-gate-01'
          })
          
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