import { StudentsLogTable } from '@/components/students/students-log-table'
import type { ColumnDef } from "@tanstack/react-table"

export type StudentLogType = {
  id: string;
  student_id: string;
  name: string;
  section: string;
  grade_level: string;
  time_in: string;
  time_out: string;
}

export const columns: ColumnDef<StudentLogType>[] = [
  {
    accessorKey: "student_id",
    header: "Student ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "grade_level",
    header: "Grade Level",
  },
  {
    accessorKey: "time_in",
    header: "Time In",
  },
  {
    accessorKey: "time_out",
    header: "Time Out",
  },
]

const data: StudentLogType[] = [
  {
    id: "STU20250327",
    student_id: "STU20250327",
    name: "Jan Liby Dela Costa",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:46 AM",
    time_out: "4:12 PM",
  },
  {
    id: "STU20250326",
    student_id: "STU20250326",
    name: "Aiesha Jaden J. Dacallos",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:48 AM",
    time_out: "4:01 PM",
  },
  {
    id: "STU20250324",
    student_id: "STU20250324",
    name: "Krisha Sophia De Peralta",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:43 AM",
    time_out: "3:55 PM",
  },
  {
    id: "STU20250305",
    student_id: "STU20250305",
    name: "Rhonyl Caballes",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:51 AM",
    time_out: "4:23 PM",
  },
  {
    id: "STU20250226",
    student_id: "STU20250226",
    name: "Kelvin John Capate",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:40 AM",
    time_out: "4:18 PM",
  },
  {
    id: "STU20250157",
    student_id: "STU20250157",
    name: "Prince Andrei Banting",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:44 AM",
    time_out: "4:09 PM",
  },
  {
    id: "STU20250384",
    student_id: "STU20250384",
    name: "Rose Marie Indic",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:49 AM",
    time_out: "4:27 PM",
  },
  {
    id: "STU20250567",
    student_id: "STU20250567",
    name: "Euclid Gundio",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:47 AM",
    time_out: "4:33 PM",
  },
  {
    id: "STU20250537",
    student_id: "STU20250537",
    name: "Melvin Clive",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "6:47 AM",
    time_out: "3:48 PM",
  },
  {
    id: "STU20250538",
    student_id: "STU20250538",
    name: "Prince Hassnan Gabumpa",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "6:45 AM",
    time_out: "3:52 PM",
  },

  {
    id: "STU20250147",
    student_id: "STU20250147",
    name: "Joanna Ajose Estacio",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "6:45 AM",
    time_out: "3:59 PM",
  },
  {
    id: "STU20250146",
    student_id: "STU20250146",
    name: "Kim Ahvril De Guzman",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "6:45 AM",
    time_out: "4:15 PM",
  },
  {
    id: "STU20250145",
    student_id: "STU20250145",
    name: "Hanna Butt",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "6:45 AM",
    time_out: "4:04 PM",
  },
  {
    id: "STU20250501",
    student_id: "STU20250501",
    name: "Kean James Lastimada",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:12 AM",
    time_out: "4:22 PM",
  },
  {
    id: "STU20250502",
    student_id: "STU20250502",
    name: "Ken Zeimon Verdejo",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:25 AM",
    time_out: "4:17 PM",
  },
  {
    id: "STU20250503",
    student_id: "STU20250503",
    name: "Laina May",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:30 AM",
    time_out: "4:05 PM",
  },
  {
    id: "STU20250505",
    student_id: "STU20250505",
    name: "Rashed Verdeflor PK",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:01 AM",
    time_out: "3:58 PM",
  },
  {
    id: "STU20250506",
    student_id: "STU20250506",
    name: "Renz Tipanero",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "6:55 AM",
    time_out: "4:29 PM",
  },
  {
    id: "STU20250507",
    student_id: "STU20250507",
    name: "Sarah Kifah",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:20 AM",
    time_out: "4:08 PM",
  },
  {
    id: "STU20250508",
    student_id: "STU20250508",
    name: "Adriel Jacy",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:18 AM",
    time_out: "4:11 PM",
  },
  {
    id: "STU20250509",
    student_id: "STU20250509",
    name: "Charlone Ancheta",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:05 AM",
    time_out: "4:26 PM",
  },
  {
    id: "STU20250510",
    student_id: "STU20250510",
    name: "Cobie Ignacio",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:33 AM",
    time_out: "3:50 PM",
  },
  {
    id: "STU20250511",
    student_id: "STU20250511",
    name: "Emil John Rey",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "6:59 AM",
    time_out: "4:24 PM",
  },
  {
    id: "STU20250512",
    student_id: "STU20250512",
    name: "Frenzy Mallari",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:14 AM",
    time_out: "3:57 PM",
  },
  {
    id: "STU20250513",
    student_id: "STU20250513",
    name: "Isaac Barroa",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:08 AM",
    time_out: "4:20 PM",
  },
  {
    id: "STU20250514",
    student_id: "STU20250514",
    name: "Jayson Dela Peña",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "6:52 AM",
    time_out: "4:02 PM",
  }
];


export default function StudentsLog() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-semibold text-2xl">Students Log</h1>
      </header>
      <StudentsLogTable columns={columns} data={data} />
    </div>
  )
}