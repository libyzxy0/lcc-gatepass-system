import db from '@/db/drizzle'
import { staff } from '@/db/schema'
import { eq } from 'drizzle-orm'
import {
  BadRequestError,
  NotFoundError
} from '@/errors'
import { generateStaffID } from '@/utils'

interface CreateNewStaff {
  staff_id: string;
  firstname: string;
  lastname: string;
  middle_name: string | null;
  phone_number: string;
  rfid_code: string;
  staff_type: "faculty" | "guard" | "administrator" | "canteen_vendors" | "other";
  email: string;
  photo_url: string;
};

class StudentService {
  static async create({ firstname, lastname, middle_name, phone_number, rfid_code, staff_type, email, photo_url }: CreateNewStaff) {
    try {
      const [newStaff] = await db.insert(staff).values({
        staff_id: generateStaffID(),
        firstname,
        lastname,
        middle_name,
        phone_number,
        rfid_code,
        staff_type,
        email,
        photo_url
      }).returning({ id: staff.id });

      if (!newStaff) throw new BadRequestError('Failed to create staff');

      return newStaff;
    } catch (error) {
      throw error;
    }
  }
  static async getAll() {
    try {
      const staffs = await db.select().from(staff);

      if (staffs.length === 0) throw new NotFoundError('No students added to the database yet');

      return staffs;
    } catch (error) {
      throw error;
    }
  }
  static async get(id: string) {
    try {
      const [staffData] = await db.select().from(staff).where(eq(staff.id, id))
      if (!staffData) throw new NotFoundError('Cant find staff to the database');
      return staffData;
    } catch (error) {
      throw error;
    }
  }

  static async update({ id, fields }: { id: string; fields: CreateNewStaff }) {
    try {
      const [updated] = await db.update(staff).set(fields).where(eq(staff.id, id)).returning({ id: staff.id });
      if (!updated) throw new NotFoundError('Failed to update, staff did not exist');
      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const stff = await this.get(id);
      if (!stff) throw new NotFoundError('Failed to delete, staff did not exist');
      const [deleted] = await db.delete(staff).where(eq(staff.id, stff.id)).returning({ id: staff.id });

      return deleted;
    } catch (error) {
      throw error;
    }
  }
}

export default StudentService;