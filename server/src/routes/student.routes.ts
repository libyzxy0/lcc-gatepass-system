import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import studentController from "@/controllers/student.controller";

const router = Router();

router.post("/create", admin_auth, studentController.create);
router.get("/all", admin_auth, studentController.getAll);
router.get("/get/:id", admin_auth, studentController.get);
router.post("/update", admin_auth, studentController.update);
router.delete("/delete/:id", admin_auth, studentController.delete);

export default router;