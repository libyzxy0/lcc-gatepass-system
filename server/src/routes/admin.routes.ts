import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";
import AdminController from "@/controllers/admin.controller";

const router = Router();

router.get("/all", admin_auth, AdminController.getAll);
router.post("/create", admin_auth, AdminController.newAdmin);
router.post("/login", AdminController.login);
router.post("/refresh", AdminController.refresh);
router.post("/logout", admin_auth, AdminController.logout);
router.get("/session", admin_auth, AdminController.getSession);
router.get("/delete/:id", admin_auth, AdminController.delete);

router.get("/overview/counts", admin_auth, AdminController.getOverviewCounts);

export default router;