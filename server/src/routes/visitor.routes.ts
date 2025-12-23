import { Router } from "express";
import { visitor_auth } from "@/middlewares/visitor-auth";
import VisitorController from "@/controllers/visitor.controller";

const router = Router();

router.get("/me", visitor_auth, VisitorController.getSession);
router.post("/register", VisitorController.register);
router.post("/login", VisitorController.login);
router.post("/me/update", visitor_auth, VisitorController.updateAccount);
router.post("/me/check", VisitorController.checkPhoneNumber);

export default router;