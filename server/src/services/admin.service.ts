import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { admin, gatepass, visitor } from "@/db/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken
} from '@/utils';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from '@/errors'

type Admin = typeof admin.$inferSelect;
type AdminSafe = Omit<Admin, "password"> & {
  password?: string;
};

class AdminService {
  static async createAdmin({ firstname, lastname, role, email, phone_number, password, photo_url }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [newAdmin] = await db.insert(admin).values({
        firstname,
        lastname,
        role,
        email,
        phone_number,
        password: hashedPassword,
        photo_url
      }).returning({
        id: admin.id,
        email: admin.email
      });

      return newAdmin;
    } catch (error) {
      throw error;
    }
  }
  static async adminLogin({ email, password }) {
    try {
      console.log(email, password)

      const [adminData] = await db.select()
        .from(admin)
        .where(eq(admin.email, email));

      if (!adminData) throw new NotFoundError('Invalid email address');

      const isValidPassword = await bcrypt.compare(password, adminData.password);

      if (!isValidPassword) throw new UnauthorizedError('Incorrect password');

      return adminData;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  static async getAdmin(id: string) {
    try {
      const [adminData]: AdminSafe[] = await db
        .select({
          id: admin.id,
          firstname: admin.firstname,
          lastname: admin.lastname,
          email: admin.email,
          phone_number: admin.phone_number,
          role: admin.role,
          is_super_admin: admin.is_super_admin,
          photo_url: admin.photo_url,
          created_at: admin.created_at
        })
        .from(admin)
        .where(eq(admin.id, id));
      if (!adminData) throw new NotFoundError('No admin with that ID')
      return adminData;
    } catch (error) {
      throw error;
    }
  }

  /* Gatepass Data Services */

  static async getAllGatepassData() {
    try {
      const allGAtepass = await db.select().from(gatepass).leftJoin(visitor, eq(visitor.id, gatepass.visitor_id));
      if(allGAtepass.length === 0) throw new NotFoundError("No gatepass data yet.")
      console.log(allGAtepass);
      
      const good = allGAtepass.map((gpass) => {
        return {
          ...gpass.gatepass,
          visitor_fullname: gpass.visitor.firstname + ' ' + gpass.visitor.lastname,
          visitor_firstname: gpass.visitor.firstname,
          visitor_lastname: gpass.visitor.lastname,
          visitor_mi: gpass.visitor.middle_initial,
          visitor_id: gpass.visitor.id
        }
      })
      console.log(good)
      return good;
    } catch (error) {
      throw error;
    }
  }
}

export default AdminService;