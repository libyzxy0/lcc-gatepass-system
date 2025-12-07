import db from "@/db/drizzle";
import { admin } from "@/db/schema";

const createDefaultAdmin = async () => {
  try {
    const data = await db.insert(admin).values({
        firstname: "Krisha Sophia",
        lastname: "De Peralta",
        role: "admin",
        email: "krisha",
        phone_number: "09999999999",
        password: "krisha123",
        is_super_admin: true,
        photo_url: "https://graph.facebook.com/100009108078372/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
      });
      console.log("Success:", data);
  } catch (error) {
    console.error(error);
  }
}

createDefaultAdmin();