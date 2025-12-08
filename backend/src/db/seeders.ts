import db from "@/db/drizzle";
import { admin } from "@/db/schema";

const createDefaultAdmin = async () => {
  try {
    const data = await db.insert(admin).values({
        firstname: "Aiesha Jaden",
        lastname: "Dacallos",
        role: "staff",
        email: "aiesha",
        phone_number: "09999999999",
        password: "aiesha123",
        is_super_admin: false,
        photo_url: null
      });
      console.log("Success:", data);
  } catch (error) {
    console.error(error);
  }
}

createDefaultAdmin();