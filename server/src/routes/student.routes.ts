import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import StudentController from "@/controllers/student.controller";

const router = Router();

router.post("/create", admin_auth, StudentController.create);
router.get("/all", admin_auth, StudentController.getAll);
router.get("/get/:id", admin_auth, StudentController.get);
router.post("/update", admin_auth, StudentController.update);
router.delete("/delete/:id", admin_auth, StudentController.delete);

export default router;