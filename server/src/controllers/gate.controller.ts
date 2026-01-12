import { Request, Response } from "express";
import GateService from '@/services/gate.service'

class GateController {
  static async create(req: Request, res: Response) {
    try {
      await GateService.create(req.body);
      res.status(200).json({
        message: "Gate added successfully"
      })
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const gates = await GateService.getAll();
      res.status(200).json(gates);
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const gateData = await GateService.get(id);
      res.status(200).json(gateData)
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id, fields } = req.body;
      
      await GateService.update({ id, fields });
      
      res.status(200).json({ message: "Gate updated successfully" })
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await GateService.delete(id);
      
      res.status(200).json({ message: "Gate deleted successfully" })
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }
}

export default GateController; /* Code ends with 69 HAHA*/