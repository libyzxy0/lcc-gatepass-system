import db from '@/db/drizzle'
import { student, gatepass, visitor } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import axios from 'axios'
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from '@/errors'
import AuthService from '@/services/auth.service'

class ESPService {
  static async verifyRFID(rfid: string) {
    try {
      const [studentData] = await db.select().from(student).where(eq(student.rfid_code, rfid));
      if (!studentData) throw new UnauthorizedError('Invalid gatepass');
      return studentData;
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