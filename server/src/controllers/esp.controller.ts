import { Request, Response } from "express";
import db from '@/db/drizzle'
import { student } from '@/db/schema'
import { eq } from 'drizzle-orm'
import axios from 'axios'

class ESPController {
  async handleEvent(req: Request, res: Response) {
    try {
      const event = req.body;
      console.log(event.topic);
      console.log(JSON.parse(event.payload));
      res.json({ message: 'Event Received!' })
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while listening to event!'
      })
    }
  }
}

export default new ESPController();