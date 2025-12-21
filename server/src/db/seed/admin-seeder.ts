import db from "@/db/drizzle";
import { admin } from "@/db/schema";
import bcrypt from "bcryptjs";

const adminSeeder = async () => {
  try {
    const hashedPassword = await bcrypt.hash("dev.libyzyx0@321", 10);
    
    const data = await db.insert(admin).values({
        firstname: "Jan Liby",
        lastname: "Dela Costa",
        role: "developer",
        email: "janlibydelacosta@gmail.com",
        phone_number: "09976953622",
        password: hashedPassword,
        is_super_admin: true,
        photo_url: "https://github.com/libyzxy0.png"
      });
      console.log(data);
  } catch (error) {
    console.error(error);
  }
}

adminSeeder();