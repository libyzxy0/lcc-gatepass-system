import db from '@/db/drizzle'
import { gate } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import {
  BadRequestError,
  NotFoundError
} from '@/errors'

type CreateGateType = {
  gate_id: string;
  name: string;
  secret: string;
  type: 'entry' | 'exit' | 'entry-exit';
}

class GateService {
  static async create({
    gate_id,
    name,
    secret,
    type
  }: CreateGateType) {
    try {

      const [newGate] = await db.insert(gate).values({
        gate_id,
        name,
        secret,
        type
      }).returning({ id: gate.id });

      if (!newGate) throw new BadRequestError('Failed to create gate!');

      return newGate;
    } catch (error) {
      throw error;
    }
  }
  static async getAll() {
    try {
      const gates = await db.select().from(gate);

      if (gates.length === 0) throw new NotFoundError('No gates added to the database yet');

      return gates;
    } catch (error) {
      throw error;
    }
  }
  static async get(id: string) {
    try {
      const [gateData] = await db.select().from(gate).where(eq(gate.id, id))
      if (!gateData) throw new NotFoundError('Cant find gate to the database');
      return gateData;
    } catch (error) {
      throw error;
    }
  }
  
  static async updateStatus(status: 'online' | 'offline', gate_id: string, secret: string) {
    try {

      const [updated] = await db.update(gate)
        .set({
          status
        })
        .where(and(
          eq(gate.gate_id, gate_id),
          eq(gate.secret, secret),
        ))
        .returning({ id: gate.id });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async update({ id, fields: { 
    gate_id,
    name,
    secret,
    type } }: { id: string; fields: CreateGateType }) {
    try {
      const gte = await this.get(id);
      if (!gte) throw new NotFoundError('Failed to update, gate did not exist');

      const [updated] = await db.update(gate)
        .set({
          gate_id,
    name,
    secret,
    type
        })
        .where(eq(gate.id, gte.id))
        .returning({ id: gate.id });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const gte = await this.get(id);
      if (!gte) throw new NotFoundError('Failed to delete, gate did not exist');
      const [deleted] = await db.delete(gate).where(eq(gate.id, gte.id)).returning({ id: gate.id });

      return deleted;
    } catch (error) {
      throw error;
    }
  }
}

export default GateService;