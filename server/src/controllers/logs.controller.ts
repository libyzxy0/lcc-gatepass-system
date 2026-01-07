import { Request, Response } from "express";
import LogService from '@/services/logs.service'

class LogController {
  static async getAllLogs(req: Request, res: Response) {
    try {
      const allLogs = await LogService.getAll();
      res.json(allLogs);
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  }
  static async getLog(req: Request, res: Response) {
    const id = req.params.id;
    try {
      if(!id) return res.status(400).json({ error: 'Please enter a log id' });
      const log = await LogService.get(id);
      res.json(log);
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  }
  static async deleteLog(req: Request, res: Response) {
    const id = req.params.id;
    try {
      if(!id) return res.status(400).json({ error: 'Please enter a log id' });
      const log = await LogService.delete(id);
      res.json({ message: 'Log successfully deleted' });
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  }
}

export default LogController;