import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";
import { visitor_auth } from "@/middlewares/visitor-auth";
import controller from "@/controllers/visitor.controller";

const router = Router();

/* Admin routes */
router.get("/get-visitors", admin_auth, controller.getVisitors);
router.post("/get-visitor", admin_auth, controller.getVisitor);
router.delete("/delete-visitor/:id", admin_auth, controller.deleteVisitor);

/* User visitor routes */
router.get("/me", visitor_auth, controller.getSession);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/me/update", visitor_auth, controller.updateAccount);
router.post("/me/check", controller.checkPhoneNumber);
router.post("/me/request-gatepass", visitor_auth, controller.requestGatepass);
router.get("/me/gatepass", visitor_auth, controller.gatepass);
router.delete("/me/delete-gatepass/:id", visitor_auth, controller.deleteGatepass);

export default router;