import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import studentController from "@/controllers/student.controller";

const router = Router();

router.post("/create-student", admin_auth, studentController.createStudent);
router.get("/get-students", admin_auth, studentController.getStudents);
router.post("/get-student", admin_auth, studentController.getStudent);
router.post("/update-student", admin_auth, studentController.updateStudent);
router.delete("/delete-student/:id", admin_auth, studentController.deleteStudent);



export default router;