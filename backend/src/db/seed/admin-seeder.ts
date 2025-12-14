import db from "@/db/drizzle";
import { admin } from "@/db/schema";
import bcrypt from "bcryptjs";

const adminSeeder = async () => {
  try {
    const hashedPassword = await bcrypt.hash("dev.marvin@321", 10);
    
    const data = await db.insert(admin).values({
        firstname: "Marvin",
        lastname: "Saik",
        role: "developer",
        email: "marvinsaik@lccgatepass.xyz",
        phone_number: "09999999999",
        password: hashedPassword,
        is_super_admin: true,
        photo_url: "https://avatars.githubusercontent.com/u/113106676?v=4"
      });
      console.log(data);
  } catch (error) {
    console.error(error);
  }
}

adminSeeder();