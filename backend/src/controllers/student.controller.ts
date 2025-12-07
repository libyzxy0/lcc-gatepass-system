import { Request, Response } from "express";
import db from '@/db/drizzle'
import { student } from '@/db/schema'
import { eq } from 'drizzle-orm'

class StudentController {
  async createStudent(req: Request, res: Response) {
    try {
      const {
        student_id,
        firstname,
        lastname,
        middle_initial,
        grade_level,
        section,
        parent_phone_number,
        parent_email,
        rfid_code,
        photo_url
      } = req.body;
      await db.insert(student).values({
        student_id,
        firstname,
        lastname,
        middle_initial,
        grade_level,
        section,
        parent_phone_number,
        parent_email,
        rfid_code,
        photo_url
      })
      res.status(200).json({
        message: "Student added successfully"
      })
    } catch (error: unknown) {
      res.status(500).json({
        message: "Failed to add product, something went wrong"
      })
    }
  }

  async getStudent(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const studentData = await db.select().from(student).where(eq(student.id, id));
      if (studentData.length <= 0) {
        return res.status(404).json({
          error: "No product associated with that ID"
        })
      }
      res.status(200).json(studentData[0])
    } catch (error: unknown) {
      res.status(500).json({
        error: "Failed to get student, something went wrong"
      })
    }
  }

  async getStudents(req: Request, res: Response) {
    const students = await db.select().from(student);
    if (students.length <= 0) {
      return res.status(404).json({
        error: "No student added on the database yet."
      })
    }
    res.status(200).json(students)
  }

  async updateStudent(req: Request, res: Response) {
    try {
      const { id, fields } = req.body;
      if (!fields) {
        return res.status(400).json({
          error: "Specify a fields to be updated"
        })
      }
      const studentData = await db.select().from(student).where(eq(student.id, id));
      if (studentData.length <= 0) {
        return res.status(404).json({
          error: "No student associated with that ID"
        })
      }

      await db.update(student)
        .set(fields)
        .where(eq(student.id, student[0].id));

      res.status(200).json({ message: "Student updated successfully" })
    } catch (error: unknown) {
      res.status(500).json({
        error: "Failed to update student, something went wrong"
      })
    }
  }

  async deleteStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const studentData = await db.select().from(student).where(eq(student.id, id));
      if (studentData.length <= 0) {
        return res.status(404).json({
          error: "No student associated with that ID"
        })
      }

      await db.delete(student)
        .where(eq(student.id, student[0].id));

      res.status(200).json({ message: "Student deleted successfully" })
    } catch (error: unknown) {
      res.status(500).json({
        error: "Failed to delete student, something went wrong"
      })
    }
  }
}

export default new StudentController();
