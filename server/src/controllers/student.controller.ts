import { Request, Response } from "express";
import StudentService from '@/services/student.service'

class StudentController {
  static async create(req: Request, res: Response) {
    try {
      await StudentService.create(req.body);
      res.status(200).json({
        message: "Student added successfully"
      })
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const students = await StudentService.getAll();
      res.status(200).json(students);
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const studentData = await StudentService.get(id);
      res.status(200).json(studentData)
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id, fields } = req.body;
      
      await StudentService.update({ id, fields });
      
      res.status(200).json({ message: "Student updated successfully" })
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await StudentService.delete(id);
      
      res.status(200).json({ message: "Student deleted successfully" })
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }
}

export default StudentController; /* Code ends with 69 HAHA*/