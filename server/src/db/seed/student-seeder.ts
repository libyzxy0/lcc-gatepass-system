import db from "@/db/drizzle";
import { student } from "@/db/schema";

const studentsData = [
  {
    student_id: 'STU20250327',
    firstname: "Jan Liby",
    lastname: "Dela Costa",
    middle_initial: null,
    section: "TVL-ICT-12A All Things Tech",
    grade_level: "SHS-12",
    parent_phone_number: "09684245164",
    parent_name: "Emie Dela Costa",
    rfid_code: "67993725",
    address: 'Pilar Village, Sto. Cristo, San Jose del Monte, Bulacan',
    photo_url: null,
    enrollment_secret: 'TEST'
  }
];


const seeder = async () => {
  try {
    const data = await db.insert(student).values(studentsData);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

seeder();