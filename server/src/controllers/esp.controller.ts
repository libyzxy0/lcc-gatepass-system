import { Request, Response } from "express";
import { sendSMSGuardianNotif } from '@/sms-api/student-entry-exit'
import EspService from '@/services/esp.service'
import LogService from '@/services/logs.service'
import GateService from '@/services/gate.service'
import AdminService from '@/services/admin.service'

class ESPController {
  static async handleEvent(req: Request, res: Response) {
    try {
      const payload = req.body;
      console.log(payload);
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
      
      const config = await AdminService.getConfig();

      if(payload.topic == `${process.env.NODE_ENV === 'production' ? 'config' : 'dev/config'}` && payload.action === "READ") {
        console.log("Catch config?")
        res.json({
          action: 'WRITE',
          emergency_open: config.emergency_open ? 'yes' : 'no'
        })
      } else if (payload.topic === `${process.env.NODE_ENV === 'production' ? 'scan/qr' : 'dev/scan/qr'}`) {
        try {
          console.log("Catch qr");
          const data = await EspService.verifyQR(payload.data);

          const { entry } = await LogService.create({
            name: data.visitor.firstname + " " + data.visitor.lastname,
            type: data.gatepass.student_pass ? 'student' : 'visitor',
            entity_id: data.gatepass.student_pass ? data.gatepass.entity_id : data.visitor.id,
            entry_type: 'qr',
            device_id: 'esp-gate-01'
          })

          if (data.gatepass.student_pass && config.sms_alerts) {
            sendSMSGuardianNotif(data.gatepass.entity_id, entry);
          }

          return res.json({
            status: 'ok',
            entry,
            id: data.visitor.id,
            name: data.visitor.firstname + " " + data.visitor.lastname
          })
        } catch (error) {
          console.log(error)
          return res.json({
            status: 'bad'
          })
        }

      } else if (payload.topic == `${process.env.NODE_ENV === 'production' ? 'scan/rfid' : 'dev/scan/rfid'}`) {
        try {
          console.log("Verifiying rfid")
          const rfid_verification = await EspService.verifyRFID(payload.data);

          const { entry } = await LogService.create({
            name: `${rfid_verification.firstname + " " + rfid_verification.lastname}`,
            type: rfid_verification.rfid_from,
            entity_id: rfid_verification.id,
            entry_type: 'rfid',
            device_id: 'esp-gate-01'
          })
          console.log(entry)

          if(rfid_verification.rfid_from === 'student' && config.sms_alerts) {
            sendSMSGuardianNotif(rfid_verification.id, entry);
          }

          return res.json({
            status: 'ok',
            entry,
            id: rfid_verification.id,
            name: rfid_verification.firstname + " " + rfid_verification.lastname
          })
        } catch (error) {
          console.log(error)
          return res.json({
            status: 'bad'
          })
        }
      } else if (payload.topic?.startsWith('status/')) {
        await GateService.updateStatus(payload.status, payload.client_id, payload.secret_key);
        res.json({ ping: 'ok' })
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