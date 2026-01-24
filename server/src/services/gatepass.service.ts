import db from '@/db/drizzle'
import { gatepass, visitor, student } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from '@/errors'
import AuthService from '@/services/auth.service'
import { sendGatepassStatus } from '@/mailer/gatepass-status';
import { generateQRPassID } from '@/utils'

type Gatepass = typeof gatepass.$inferSelect;
type Visitor = typeof visitor.$inferSelect;

class GatepassService {
  static async createGatepass({
    student_pass_secret,
    visitor_id,
    purpose,
    description,
    schedule_date,
    vehicle
  }) {
    try {

      if (student_pass_secret) {
        const [studentData] = await db.select({ id: student.id }).from(student).where(eq(student.enrollment_secret, student_pass_secret));
        if (!studentData) throw new UnauthorizedError('Invalid QRKey!');

        const [gatepassData] = await db.insert(gatepass).values({
          student_pass: !!studentData,
          gatepass_id: generateQRPassID(),
          entity_id: studentData.id,
          visitor_id,
          purpose,
          description,
          schedule_date,
          vehicle_type: vehicle ? vehicle.type : null,
          vehicle_plate: vehicle ? vehicle.plate_number : null,
          status: 'approved'
        }).returning({
          id: gatepass.id
        });

        if (!gatepassData) throw new BadRequestError('Unable to create gatepass!');

        const qr_token = AuthService.generateQRToken(gatepassData.id);

        const [gatePassWithToken] = await db.update(gatepass).set({
          qr_token
        }).where(eq(gatepass.id, gatepassData.id)).returning({
          id: gatepass.id
        });

        return gatePassWithToken;
      } else {
        const [gatepassData] = await db.insert(gatepass).values({
          gatepass_id: generateQRPassID(),
          visitor_id,
          purpose,
          description,
          schedule_date,
          vehicle_type: vehicle ? vehicle.type : null,
          vehicle_plate: vehicle ? vehicle.plate_number : null,

        }).returning({
          id: gatepass.id
        });

        if (!gatepassData) throw new BadRequestError('Unable to create gatepass!');

        const qr_token = AuthService.generateQRToken(gatepassData.id);

        const [gatePassWithToken] = await db.update(gatepass).set({
          qr_token
        }).where(eq(gatepass.id, gatepassData.id)).returning({
          id: gatepass.id
        });

        return gatePassWithToken;
      }

    } catch (error) {
      throw error;
    }
  }
  
  static async getAllGatepass(visitor_id: string) {
    try {
      const allGatepass: Gatepass[] = await db.select().from(gatepass).where(eq(gatepass.visitor_id, visitor_id)).orderBy(desc(gatepass.created_at));

      if (allGatepass.length === 0) throw new NotFoundError('No gatepass yet!')

      return allGatepass;
    } catch (error) {
      throw error;
    }
  }
  static async getGatepass(id: string): Promise<{ visitor: Visitor, gatepass: Gatepass }> {
    try {
      const [gpass] = await db.select().from(gatepass).where(eq(gatepass.id, id)).leftJoin(visitor, eq(visitor.id, gatepass.visitor_id));

      if (!gpass) throw new NotFoundError('No qrpass with that ID exists!');

      return gpass;
    } catch (error) {
      throw error;
    }
  }
  static async deleteGatepass(id: string) {
    try {
      const [gatepassData] = await db.select().from(gatepass).where(eq(gatepass.id, id));

      if (!gatepassData) throw new NotFoundError('No gatepass with that ID')

      const [deletedGatepass] = await db.delete(gatepass)
        .where(eq(gatepass.id, gatepassData.id)).returning({
          id: gatepass.id
        });

      return deletedGatepass;
    } catch (error) {
      throw error;
    }
  }

  /* Gatepass Data Services */
  static async getAllGatepassData() {
    try {
      const allGatepass = await db.select().from(gatepass).leftJoin(visitor, eq(visitor.id, gatepass.visitor_id));

      if (allGatepass.length === 0) throw new NotFoundError("No gatepass data yet.")

      return allGatepass.map((gpass) => {
        return {
          ...gpass.gatepass,
          visitor_fullname: gpass.visitor.firstname + ' ' + gpass.visitor.lastname,
          visitor_firstname: gpass.visitor.firstname,
          visitor_lastname: gpass.visitor.lastname,
          visitor_mi: gpass.visitor.middle_initial,
          visitor_id: gpass.visitor.id
        }
      })
    } catch (error) {
      throw error;
    }
  }

  static async approve(id: string) {
    try {
      const [result] = await db.update(gatepass).set({ status: 'approved' }).where(eq(gatepass.id, id)).returning({
        id: gatepass.id
      });

      const gpassData = await this.getGatepass(result.id);
      await sendGatepassStatus({
        email: gpassData.visitor.email,
        status: 'approve',
        purpose: gpassData.gatepass.purpose,
        description: gpassData.gatepass.description
      })

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async reject(id: string, reason: string) {
    try {
      if(!reason) throw new BadRequestError('Please enter a valid reason to reject it!')
      const [result] = await db.update(gatepass).set({ status: 'rejected', reject_reason: reason }).where(eq(gatepass.id, id)).returning({
        id: gatepass.id
      });
      const gpassData = await this.getGatepass(result.id);
      await sendGatepassStatus({
        email: gpassData.visitor.email,
        status: 'reject',
        purpose: gpassData.gatepass.purpose,
        description: gpassData.gatepass.description
      })
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default GatepassService;