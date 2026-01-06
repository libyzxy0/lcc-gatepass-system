import db from '@/db/drizzle'
import { logs } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from '@/errors'

type LogType = 'student' | 'visitor' | 'staff' | 'guadian';

class LogsService {
    static async function(type: LogType) {
        try {
            const [newLogs] = await db.insert(logs).set({

            })
        } catch (error) {
            throw error;
        }
    }
}