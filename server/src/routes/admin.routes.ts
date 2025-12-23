import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";
import AdminController from "@/controllers/admin.controller";

const router = Router();

router.post("/new", admin_auth, AdminController.newAdmin);
router.post("/login", AdminController.login);
router.post("/refresh", AdminController.refresh);
router.post("/logout", admin_auth, AdminController.logout);
router.get("/session", admin_auth, AdminController.getSession);

export default router;