import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";
import { visitor_auth } from "@/middlewares/visitor-auth";
import controller from "@/controllers/visitor.controller";

const router = Router();

router.get("/get-visitors", admin_auth, controller.getVisitors);
router.post("/get-visitor", admin_auth, controller.getVisitor);
router.delete("/delete-visitor/:id", admin_auth, controller.deleteVisitor);

router.post("/new", controller.registerVisitor);
router.post("/check-number", controller.checkPhoneNumber);
router.get("/get-session", visitor_auth, controller.getSession);
router.post("/login", controller.login);
router.post("/update-visitor", visitor_auth, controller.updateVisitor);

export default router;