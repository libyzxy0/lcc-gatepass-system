import db from "@/db/drizzle";
import { admin } from "@/db/schema";
import bcrypt from "bcryptjs";

const adminSeeder = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const data = await db.insert(admin).values({
        name: "Super Admin",
        role: "admin",
        email: "admin@lccgatepass.xyz",
        phone_number: "09937793944",
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