import { NEON_DATABASE_URL} from '@/secrets'
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const sql = neon(NEON_DATABASE_URL);

const db = drizzle(sql, { schema });

export default db;
