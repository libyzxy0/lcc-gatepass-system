import { eq, count, and, or, isNull } from "drizzle-orm";
import db from "@/db/drizzle";
import { admin, gatepass, visitor, student, logs, config } from "@/db/schema";
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
import StudentService from '@/services/student.service'
import GatepassService from '@/services/gatepass.service'
import ESPService from '@/services/esp.service'
import { getDailyCounts, getWeekdayCounts } from '@/utils/charts'

type Admin = typeof admin.$inferSelect;
type AdminSafe = Omit<Admin, "password"> & {
  password?: string;
};

class AdminService {
  static async createAdmin({ name, role, email, phone_number, password, photo_url }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [newAdmin] = await db.insert(admin).values({
        name,
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
  static async getAll() {
    const admins: AdminSafe[] = await db.select({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone_number: admin.phone_number,
      role: admin.role,
      is_super_admin: admin.is_super_admin,
      photo_url: admin.photo_url,
      created_at: admin.created_at
    }).from(admin);

    if (admins.length === 0) throw new NotFoundError('No admins added in the database yet.');
    return admins;
  }
  static async getAdmin(id: string) {
    try {
      const [adminData]: AdminSafe[] = await db
        .select({
          id: admin.id,
          name: admin.name,
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
  static async getOverviewCounts() {
    try {
      const [students] = await db.select({ count: count() }).from(student);
      const [gatepasses] = await db.select({ count: count() }).from(gatepass).where(eq(gatepass.status, 'pending'));

      const [allLogs] = await db.selectDistinct({ count: count() }).from(logs).where(
        isNull(logs.time_out),
      );

      const [studentsToday] = await db.selectDistinct({ count: count() }).from(logs).where(and(
        isNull(logs.time_out),
        eq(logs.type, 'student')
      ));

      const [visitorsToday] = await db.selectDistinct({ count: count() }).from(logs).where(and(
        isNull(logs.time_out),
        eq(logs.type, 'visitor')
      ));

      const [staffToday] = await db.selectDistinct({ count: count() }).from(logs).where(and(
        isNull(logs.time_out),
        eq(logs.type, 'staff'),
      ));

      const [otherPeopleToday] = await db.selectDistinct({ count: count() }).from(logs).where(
        and(
          isNull(logs.time_out),
          eq(logs.type, 'guardian'),
        ));

      return {
        students: students.count || 0,
        pending_gatepass: gatepasses.count || 0,
        other_people: otherPeopleToday.count || 0,
        students_today: studentsToday.count || 0,
        visitors_today: visitorsToday.count || 0,
        staffs_today: staffToday.count || 0,
        people_today: allLogs.count || 0
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getCharts() {
    try {
      const daily = await getDailyCounts();
      const weekday = await getWeekdayCounts();
      const overviewCounts = await this.getOverviewCounts();
      return {
        daily,
        weekday,
        most: {
          students: overviewCounts.students_today,
          visitors: overviewCounts.visitors_today,
          staffs: overviewCounts.staffs_today,
          other: overviewCounts.other_people
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async delete(id: string) {
    try {
      if(!id) throw new BadRequestError('Please specify admin id you want to delete!');
      
      const result = await db.delete(admin).where(eq(admin.id, id)).returning({ id: admin.id });
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getConfig() {
    try {
      const [configData] = await db.select().from(config);
      return configData;
    } catch (error) {
      throw error;
    }
  }
  static async updateConfig(field) {
    try {
      const conf = await this.getConfig();
      
      if(typeof(field.emergency_open) === 'boolean') {
        console.log('emergency_open updated')
        await ESPService.updateConfig({
          emergency_open: field.emergency_open ?? false
        })
      }
      
      const [updated] = await db.update(config).set(field).where(eq(config.id, conf.id)).returning({ id: config.id });
      return updated;
    } catch (error) {
      console.error(error)
      throw error;
    }
  }
}

export default AdminService;