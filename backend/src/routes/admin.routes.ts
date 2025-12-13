import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";
import adminController from "@/controllers/admin.controller";

const router = Router();

router.post("/new", admin_auth, adminController.newAdmin);
router.post("/login", adminController.login);
router.post("/refresh", adminController.refresh);
router.post("/logout", admin_auth, adminController.logout);
router.get("/session", admin_auth, adminController.getSession);

export default router;