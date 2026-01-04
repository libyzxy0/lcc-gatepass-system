import db from "@/db/drizzle";
import { visitor } from "@/db/schema";

const visitorsData = [
  {
    visitor_id: 'VST20250327',
    firstname: "Test",
    lastname: "User",
    middle_initial: null,
    email: "test@test.com",
    phone_number: "9976953621",
    pin: "0000",
    verified: true,
    activated: true,
    valid_id_type: "PhillSys",
    valid_id_photo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrm5mWSMiShbh2d9epfkIIz15nmhOhzoOwEeaBf-3umg&s=10',
    photo_url: 'https://github.com/libyzxy0.png'
  },
];


const visitorSeeder = async () => {
  try {
    const data = await db.insert(visitor).values(visitorsData);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

visitorSeeder();