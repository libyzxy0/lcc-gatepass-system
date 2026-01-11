import { Request, Response } from 'express'
import StaffService from '@/services/staff.service'

class StaffController {
  static async create(req: Request, res: Response) {
    try {
      await StaffService.create(req.body);
      res.json({ message: 'Staff successfully created!' })
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message 
      });
    }
  }
  static async getAll(req: Request, res: Response) {
    try {
      const staffs = await StaffService.getAll();
      res.json(staffs);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message 
      });
    }
  }
  static async get(req: Request, res: Response) {
    try {
      const staff = await StaffService.get(req.params.id);
      res.json(staff);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message 
      });
    }
  }
  static async update(req: Request, res: Response) {
    const { id, fields } = req.body;
    try {
      await StaffService.update({ id, fields });
      res.json({ message: 'Staff successfully updated!' })
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message 
      });
    }
  }
  static async delete(req: Request, res: Response) {
    try {
      await StaffService.delete(req.params.id);
      res.json({ message: 'Staff successfully deleted' })
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message 
      });
    }
  }
}

export default StaffController;