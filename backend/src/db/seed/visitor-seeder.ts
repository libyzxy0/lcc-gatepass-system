import db from "@/db/drizzle";
import { visitor } from "@/db/schema";

const visitorsData = [
  {
    visitor_id: 'VST20250374',
    firstname: "Prince Hassnan",
    lastname: "Gabumpa",
    middle_initial: null,
    email: "hassnan@gmail.com",
    phone_number: "9999999999",
    pin: "1234",
    verified: true,
    valid_id_type: "PhillSys",
    valid_id_photo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrm5mWSMiShbh2d9epfkIIz15nmhOhzoOwEeaBf-3umg&s=10',
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010'
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