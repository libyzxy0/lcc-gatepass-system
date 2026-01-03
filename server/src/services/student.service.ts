import db from '@/db/drizzle'
import { student } from '@/db/schema'
import { eq } from 'drizzle-orm'
import {
  BadRequestError,
  NotFoundError
} from '@/errors'
import { type CreateStudentType } from '@/types'

class StudentService {
  static async create(values: CreateStudentType) {
    try {
      const newStudent = await db.insert(student).values(values).returning({ id: student.id });
      if (!newStudent) throw new BadRequestError('No student data yet.');

      return newStudent;
    } catch (error) {
      throw error;
    }
  }
  static async getAll() {
    try {
      const students = await db.select().from(student);
      if (students.length === 0) throw new NotFoundError('No students added to the database yet');
      return students;
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
      if (!stdnt) throw new NotFoundError('Failed to update, student did not exist');
      const deleted = await db.delete(student)
        .where(eq(student.id, stdnt.id)).returning({ id: student.id });
    } catch (error) {
      throw error;
    }
  }
}

export default StudentService;