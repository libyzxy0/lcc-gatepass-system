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
      if(!result) throw new Error('Cannot find RFID from the database');

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

      if (gatepassData.gatepass.status !== "approved") {
        throw new UnauthorizedError("Gatepass not valid");
      }
      return gatepassData;
    } catch (error) {
      throw error;
    }
  }
}

export default ESPService;