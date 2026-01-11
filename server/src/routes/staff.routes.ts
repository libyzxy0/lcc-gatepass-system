import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import StaffController from "@/controllers/staff.controller";

const router = Router();

router.post("/create", admin_auth, StaffController.create);
router.get("/all", admin_auth, StaffController.getAll);
router.get("/get/:id", admin_auth, StaffController.get);
router.post("/update", admin_auth, StaffController.update);
router.delete("/delete/:id", admin_auth, StaffController.delete);

export default router;