import { Router } from "express";
import { visitor_auth } from "@/middlewares/visitor-auth";
import { admin_auth } from "@/middlewares/admin-auth";
import VisitorController from "@/controllers/visitor.controller";

const router = Router();

router.get("/all", admin_auth, VisitorController.getAll);
router.get("/me", visitor_auth, VisitorController.getSession);
router.post("/register", VisitorController.register);
router.post("/login", VisitorController.login);
router.post("/me/update", visitor_auth, VisitorController.updateAccount);
router.post("/me/check", VisitorController.checkPhoneNumber);
router.get("/get/:id", admin_auth, VisitorController.get);
router.delete("/delete/:id", admin_auth, VisitorController.delete);

export default router;