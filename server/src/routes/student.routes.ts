import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import studentController from "@/controllers/student.controller";

const router = Router();

router.post("/create", admin_auth, studentController.createStudent);
router.get("/all", admin_auth, studentController.getStudents);
router.post("/get", admin_auth, studentController.getStudent);
router.post("/update", admin_auth, studentController.updateStudent);
router.delete("/delete/:id", admin_auth, studentController.deleteStudent);



export default router;