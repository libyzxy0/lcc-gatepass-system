import db from "@/db/drizzle";
import { admin } from "@/db/schema";

const createDefaultAdmin = async () => {
  try {
    const data = await db.insert(admin).values({
        firstname: "Jan Liby",
        lastname: "Dela Costa",
        role: "admin",
        email: "janlibydelacosta@gmail.com",
        phone_number: "09976953622",
        password: "pogi123",
        is_super_admin: true
      });
      console.log("Success:", data);
  } catch (error) {
    console.error(error);
  }
}

createDefaultAdmin();