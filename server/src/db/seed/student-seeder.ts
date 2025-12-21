import db from "@/db/drizzle";
import { student } from "@/db/schema";

const studentsData = [
  {
    student_id: 'STU20250327',
    firstname: "Jan Liby",
    lastname: "Dela Costa",
    middle_initial: null,
    section: "ICT-12A",
    grade_level: "SHS-12",
    parent_phone_number: "09684245164",
    parent_email: "emiedelacosta2@test.com",
    rfid_code: "67993725",
    photo_url: null
  },
  {
    student_id: 'STU20250347',
    firstname: "Krisha Sophia",
    lastname: "De Peralta",
    middle_initial: null,
    section: "ICT-12A",
    grade_level: "SHS-12",
    parent_phone_number: "09999999999",
    parent_email: "krisha@lccgatepass.xyz",
    rfid_code: "A7303325",
    photo_url: null
  },
  {
    student_id: 'STU20241201',
    firstname: "Aiesha Jaden",
    lastname: "Dacallos",
    middle_initial: "J",
    section: "ICT-12A",
    grade_level: "SHS-12",
    parent_phone_number: "09999999999",
    parent_email: "aieshajaden.dacallos@lccgatepass.xyz",
    rfid_code: "07643A25",
    photo_url: null
  },
  {
    student_id: 'STU20241202',
    firstname: "Kelvin John",
    lastname: "Capate",
    middle_initial: null,
    section: "ICT-12A",
    grade_level: "SHS-12",
    parent_phone_number: "09999999999",
    parent_email: "kelvinjohn.capate@lccgatepass.xyz",
    rfid_code: "7BD13AEE",
    photo_url: null
  },
  {
    student_id: 'STU20241203',
    firstname: "Nor",
    lastname: "Pancho",
    middle_initial: null,
    section: "ICT-12A",
    grade_level: "SHS-12",
    parent_phone_number: "09999999999",
    parent_email: "nor.pancho@lccgatepass.xyz",
    rfid_code: "A93F22C4",
    photo_url: null
  },
  {
    student_id: 'STU20241204',
    firstname: "Euclid",
    lastname: "Gundio",
    middle_initial: "D",
    section: "ICT-12A",
    grade_level: "SHS-12",
    parent_phone_number: "09999999999",
    parent_email: "euclid.gundio@lccgatepass.xyz",
    rfid_code: "5C8EB7FA",
    photo_url: null
  },
  {
    student_id: 'STU20241205',
    firstname: "Prince",
    lastname: "Andrei",
    middle_initial: null,
    section: "ICT-12A",
    grade_level: "SHS-12",
    parent_phone_number: "09999999999",
    parent_email: "prince.andrei@lccgatepass.xyz",
    rfid_code: "8ED4A1C3",
    photo_url: null
  },
  {
    student_id: 'STU20241206',
    firstname: "Rose Marie",
    lastname: "Indic",
    middle_initial: null,
    section: "ICT-12A",
    grade_level: "SHS-12",
    parent_phone_number: "09999999999",
    parent_email: "rosemarie.indic@lccgatepass.xyz",
    rfid_code: "2F7B9D66",
    photo_url: null
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