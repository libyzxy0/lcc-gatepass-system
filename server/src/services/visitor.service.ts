import db from '@/db/drizzle'
import { visitor } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateVisitorID } from '@/utils'
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from '@/errors'

type Visitor = typeof visitor.$inferSelect;
type VisitorSafe = Omit<Visitor, "pin"> & {
  pin?: string;
};

type NewVisitor = {
  firstname: string;
  lastname: string;
  middle_initial: string;
  email: string;
  phone_number: string;
  pin: string;
}

class VisitorService {
  static async createVisitor({ firstname, lastname, middle_initial, email, phone_number, pin }: NewVisitor) {
    try {
      const [newVisitor] = await db.insert(visitor).values({
        visitor_id: generateVisitorID(),
        firstname,
        lastname,
        middle_initial,
        email,
        phone_number,
        pin
      }).returning({
        id: visitor.id,
        phone_number: visitor.phone_number
      })

      return newVisitor;
    } catch (error) {
      throw error;
    }
  }
  static async login({ phone_number, pin }) {
    try {
      const [visitorData]: Visitor[] = await db
        .select()
        .from(visitor)
        .where(eq(visitor.phone_number, phone_number));

      if (!visitorData) throw new NotFoundError('Invalid phone number');

      if (visitorData.pin !== pin) throw new UnauthorizedError('Incorrect Pin');

      return visitorData;
    } catch (error) {
      throw error;
    }
  }
  static async getVisitor(id: string) {
    try {
      const [visitorData]: VisitorSafe[] = await db
        .select({
          id: visitor.id,
          visitor_id: visitor.visitor_id,
          firstname: visitor.firstname,
          lastname: visitor.lastname,
          middle_initial: visitor.middle_initial,
          address: visitor.address,
          email: visitor.email,
          phone_number: visitor.phone_number,
          verified: visitor.verified,
          activated: visitor.activated,
          valid_id_type: visitor.valid_id_type,
          valid_id_photo_url: visitor.valid_id_photo_url,
          photo_url: visitor.photo_url,
          created_at: visitor.created_at,
        })
        .from(visitor)
        .where(eq(visitor.id, id));

      if (!visitorData) throw new NotFoundError('No visitor with that ID');
      return visitorData;
    } catch (error) {
      throw error;
    }
  }
  static async updateVisitor({ id, fields }) {
    try {
      const visitorData = await this.getVisitor(id);

      if (!visitorData) throw new NotFoundError('No visitor with that ID');

      const updatedVisitor = await db.update(visitor)
        .set(fields)
        .where(eq(visitor.id, id))
        .returning({
          id: visitor.id
        });
      return updatedVisitor;
    } catch (error) {
      throw error;
    }
  }
  static async isThereVisitorWithNumber(phone_number: string) {
    try {
      const [visitorData] = await db.select({ id: visitor.id }).from(visitor).where(eq(visitor.phone_number, phone_number)) ?? null;

      if (!visitorData) throw new NotFoundError('No visitor with that Phone Number');

      return visitorData;
    } catch (error) {
      throw error;
    }
  }
}

export default VisitorService;