import db from "@/db/drizzle";
import { seed } from "drizzle-seed";
import { staff } from "@/db/schema";

async function main() {
  await seed(db, { staff });
  console.log("Successfully seeded staffs!");
}

main();
