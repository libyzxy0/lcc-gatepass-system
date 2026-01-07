import db from '@/db/drizzle'
import { student, guardian } from '@/db/schema'
import { eq } from 'drizzle-orm'
import {
  BadRequestError,
  NotFoundError
} from '@/errors'
import { type CreateStudentType } from '@/types'

class StudentService {
  static async create({
    student_id,
    firstname,
    lastname,
    middle_name,
    section,
    grade_level,
    address,
    rfid_code,
    photo_url,
    guardian_photo_url,
    guardian_phone_number,
    guardian_firstname,
    guardian_lastname,
    guardian_middle_name,
    guardian_rfid_code,
    relationship
  }: CreateStudentType) {
    try {

      const [newStudent] = await db.insert(student).values({
        student_id,
        firstname,
        lastname,
        middle_name,
        section,
        grade_level,
        address,
        rfid_code,
        photo_url
      }).returning({ id: student.id });

      if (!newStudent) throw new BadRequestError('Failed to create student!');
      
      const [newGuardian] = await db.insert(guardian).values({
        firstname: guardian_firstname,
        lastname: guardian_lastname,
        middle_name: guardian_middle_name,
        phone_number: guardian_phone_number,
        address,
        rfid_code: guardian_rfid_code,
        photo_url: guardian_photo_url,
        relationship,
        student_id: newStudent.id
      }).returning({ id: guardian.id })
      
      if (!newGuardian) throw new BadRequestError('Failed to create student!');

      return newStudent;
    } catch (error) {
      throw error;
    }
  }
  static async getAll() {
    try {
      const students = await db.select().from(student).innerJoin(guardian, eq(guardian.student_id, student.id));

      if (students.length === 0) throw new NotFoundError('No students added to the database yet');
      
      return students.map((data) => {
        return {
          ...data.student,
          parent_fullname: data.guardian.firstname + " " + data.guardian.lastname
        }
      });
    } catch (error) {
      throw error;
    }
  }
  static async get(id: string) {
    try {
      const [studentData] = await db.select().from(student).where(eq(student.id, id));
      if (!studentData) throw new NotFoundError('Cant find student to the database');
      return studentData;
    } catch (error) {
      throw error;
    }
  }

  static async update({ id, fields }) {
    try {
      if (!fields) throw new BadRequestError('Please specify fields to be updated!');

      const stdnt = await this.get(id);
      if (!stdnt) throw new NotFoundError('Failed to update, student did not exist');

      const updated = await db.update(student)
        .set(fields)
        .where(eq(student.id, stdnt.id))
        .returning({ id: student.id });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const stdnt = await this.get(id);
      if (!stdnt) throw new NotFoundError('Failed to delete, student did not exist');
      const [deleted] = await db.delete(student).where(eq(student.id, stdnt.id)).returning({ id: student.id });
      
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}

export default StudentService;