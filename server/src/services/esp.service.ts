import db from '@/db/drizzle'
import { student, gatepass, visitor, staff, guardian } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { union } from 'drizzle-orm/pg-core'
import axios from 'axios'
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from '@/errors'
import AuthService from '@/services/auth.service'
import { MQTT_BRIDGE } from '@/secrets'

class ESPService {
  static async findRFIDHolder(rfid: string) {
    try {
    const [result] = await union(
      db.select({
        id: student.id,
        firstname: student.firstname,
        lastname: student.lastname,
        rfid_code: student.rfid_code,
        rfid_from: sql`'student'`.as("rfid_from"),
      }).from(student).where(eq(student.rfid_code, rfid)), 
      db.select({
        id: staff.id,
        firstname: staff.firstname,
        lastname: staff.lastname,
        rfid_code: staff.rfid_code,
        rfid_from: sql`'staff'`.as("rfid_from"),
      }).from(staff).where(eq(staff.rfid_code, rfid)),
      db.select({
        id: guardian.id,
        firstname: guardian.firstname,
        lastname: guardian.lastname,
        rfid_code: guardian.rfid_code,
        rfid_from: sql`'guardian'`.as("rfid_from"),
      }).from(guardian).where(eq(guardian.rfid_code, rfid))
      );
      console.log("Data:", result)
      if(!result) throw new BadRequestError('Cannot find RFID from the database');
      console.log('Still continued')

    return result;
    } catch (error) {
      throw error;
    }
  }
  static async verifyRFID(rfid: string): Promise<any> {
    try {
      const result = await this.findRFIDHolder(rfid);

      if (!result) throw new UnauthorizedError('Invalid gatepass');
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async verifyQR(qr_token: string) {
    try {
      const decoded = AuthService.verifyQRToken(qr_token);

      const [gatepassData] = await db.select()
        .from(gatepass)
        .innerJoin(visitor, eq(visitor.id, gatepass.visitor_id))
        .where(and(
          eq(gatepass.id, decoded.id),
          eq(gatepass.qr_token, qr_token),
        ));

      if (!gatepassData) {
        throw new NotFoundError('Gatepass not valid');
      }
      
      if(gatepassData.gatepass.scan_count === 2) {
        await db.update(gatepass).set({ status: 'expired' }).where(eq(gatepass.id, gatepassData.gatepass.id));
      }

      if (gatepassData.gatepass.status !== "approved") {
        throw new UnauthorizedError("Gatepass not valid");
      }
      
      await db.update(gatepass).set({ scan_count: gatepassData.gatepass.scan_count + 1 }).where(eq(gatepass.id, gatepassData.gatepass.id));
      
      return gatepassData;
    } catch (error) {
      throw error;
    }
  }
  static async updateConfig({ emergency_open }: { emergency_open: boolean; }) {
    try {
      console.log(emergency_open, MQTT_BRIDGE);
      const response = await axios.post(`${MQTT_BRIDGE}/config`, {
        emergency_open: emergency_open === true ? 'yes' : 'no'
      })
      console.log("Data:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ESPService;