import db from "@/db/drizzle";
import { admin } from "@/db/schema";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

const createDefaultAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("greensalt123", SALT_ROUNDS);
    
    const data = await db.insert(admin).values({
        firstname: "Jan Liby",
        lastname: "Dela Costa",
        role: "admin",
        email: "janlibydelacosta@gmail.com",
        phone_number: "09976953621",
        password: hashedPassword,
        is_super_admin: true,
        photo_url: 'https://avatars.githubusercontent.com/u/107909653?v=4'
      });
      console.log("Success:", data);
  } catch (error) {
    console.error(error);
  }
}

createDefaultAdmin();