import db from '@/db/drizzle'
import { logs } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from '@/errors'

type Logs = {
  type: 'student' | 'visitor' | 'staff' | 'guardian';
  name: string;
  time_in: string;
  entity_id: string;
  device_id: string;
  entry_type: 'qr' | 'rfid';
};

class LogsService {
  static async create({
    type,
    name,
    time_in,
    entity_id,
    device_id,
    entry_type
  }: Logs) {
    try {

      const [newLogs] = await db.insert(logs).values({
        type,
        name,
        time_in,
        entity_id,
        device_id,
        entry_type
      }).returning({ id: logs.id });

      return newLogs;
    } catch (error) {
      throw error;
    }
  }
  static async get(logId: string) {
    try {
      const [log] = await db.select().from(logs).where(eq(logs.id, logId));
      if(!log) throw new NotFoundError('Cannot find log in database');
      return log;
    } catch (error) {
      throw error;
    }
  }
  static async getAll() {
    try {
      const allLogs = await db.select().from(logs).orderBy(desc(logs.created_at));
      
      if(allLogs.length === 0) throw new NotFoundError('No logs in database yet');
      
      return allLogs;
    } catch (error) {
      throw error;
    }
  }
  static async delete(logId: string) {
    try {
      const log = await this.get(logId);
      
      const [deleted] = await db.delete(logs).where(eq(logs.id, log.id)).returning({ id: logs.id });
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}

export default LogsService;