import db from '@/db/drizzle'
import { gatepass } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from '@/errors'
import AuthService from '@/services/auth.service'

type Gatepass = typeof gatepass.$inferSelect;

class GatepassService {
  static async getAll() {
    const allGAtepass = await db.select().from(gatepass);
    console.log(allGAtepass);
    return allGAtepass;
  }
  static async createGatepass({
    visitor_id,
    purpose,
    description,
    schedule_date,
    vehicle
  }) {
    try {
      const [gatepassData] = await db.insert(gatepass).values({
        visitor_id,
        purpose,
        description,
        schedule_date,
        vehicle_type: vehicle ? vehicle.type : null,
        vehicle_plate: vehicle ? vehicle.plate_number : null
      }).returning({ 
        id: gatepass.id
      });

      if(!gatepassData) throw new BadRequestError('Unable to create gatepass!');

      const qr_token = AuthService.generateQRToken(gatepassData.id);
      
      const [gatePassWithToken] = await db.update(gatepass).set({
        qr_token
      }).where(eq(gatepass.id, gatepassData.id)).returning({
        id: gatepass.id
      });
      
      return gatePassWithToken;
    } catch (error) {
      throw error;
    }
  }
  static async getAllGatepass(visitor_id: string) {
    try {
      const allGatepass: Gatepass[] = await db.select().from(gatepass).where(eq(gatepass.visitor_id, visitor_id)).orderBy(desc(gatepass.created_at));
      
      if(allGatepass.length === 0) throw new NotFoundError('No gatepass yet!')
      
      return allGatepass;
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
}

export default GatepassService;