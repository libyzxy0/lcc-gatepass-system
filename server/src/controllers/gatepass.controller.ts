import { Request, Response } from 'express'
import db from '@/db/drizzle'
import { visitor, gatepass } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import GatepassService from '@/services/gatepass.service'
import { R } from 'vitest/dist/reporters-w_64AS5f'

interface TokenDecodedType {
  id: string;
  iat: number;
  exp: number;
}

interface VisitorRequest extends Request {
  visitor?: TokenDecodedType;
}
interface AdminRequest extends Request {
  admin?: TokenDecodedType;
}

class GatepassController {
  static async requestGatepass(req: VisitorRequest, res: Response) {
    try {
      const { purpose, description, schedule_date, vehicle } = req.body;

     await GatepassService.createGatepass({ visitor_id: req.visitor.id, purpose, description, schedule_date, vehicle });

      return res.status(200).json({
        message: 'Gatepass request has been sent to Administrators!'
      })

    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async gatepass(req: VisitorRequest, res: Response) {
    try {
      const allGatepass = await GatepassService.getAllGatepass(req.visitor.id)

      return res.status(200).json(allGatepass);
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }
  
  static async getGatepass(req: Request, res: Response) {
    try {
      const gpass = await GatepassService.getGatepass(req.params.id);

      return res.status(200).json(gpass);
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }

  static async deleteGatepass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await GatepassService.deleteGatepass(id);
      
      res.status(200).json({ message: "QRCode Pass has been deleted succesfully!" })
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message
      })
    }
  }
  
  static async getAllGatepassData(req: Request, res: Response) {
    try {
    const allGatepass = await GatepassService.getAllGatepassData();
    res.status(200).json(allGatepass);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
  
  static async approveGatepass(req: AdminRequest, res: Response) {
    const gatepassId = req.body.id;
    try {
      if(!req.admin) return res.status(401).json({ error: 'Unauthorized access' })
      const result = await GatepassService.approve(gatepassId);
      return res.json({message: 'Gatepass status successfully set to approve'});
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
  static async rejectGatepass(req: AdminRequest, res: Response) {
    const gatepassId = req.body.id;
    try {
      if(!req.admin) return res.status(401).json({ error: 'Unauthorized access' })
      const result = await GatepassService.reject(gatepassId);
      return res.json({message: 'Gatepass status successfully set to rejected'});
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default GatepassController;