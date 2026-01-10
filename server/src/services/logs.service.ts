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
  entity_id: string;
  device_id: string;
  entry_type: 'qr' | 'rfid';
};

class LogsService {
  static async create({
    type,
    name,
    entity_id,
    device_id,
    entry_type
  }: Logs) {
    try {
      const now = new Date();

      const [activeLog] = await db
        .select()
        .from(logs)
        .where(eq(logs.entity_id, entity_id))
        .orderBy(desc(logs.time_in))
        .limit(1);

      if (activeLog && !activeLog.time_out) {
        await db.update(logs)
          .set({ time_out: now.toISOString() })
          .where(eq(logs.id, activeLog.id));
        console.log('Time out');
      } else {
        await db.insert(logs).values({
          type,
          name,
          time_in: now.toISOString(),
          entity_id,
          device_id,
          entry_type
        });
        console.log('Time In');
      }

    } catch (error) {
      throw error;
    }
  }
  static async get(logId: string) {
    try {
      const [log] = await db.select().from(logs).where(eq(logs.id, logId));
      if (!log) throw new NotFoundError('Cannot find log in database');
      return log;
    } catch (error) {
      throw error;
    }
  }
  static async getAll() {
    try {
      const allLogs = await db.select().from(logs).orderBy(desc(logs.created_at));

      if (allLogs.length === 0) throw new NotFoundError('No logs in database yet');

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