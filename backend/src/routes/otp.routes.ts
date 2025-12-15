import { Router } from "express";
import controller from "@/controllers/otp.controller";

const router = Router();

router.post("/vst/new", controller.generateVisitorOTP);
router.post("/vst/chk", controller.verifyVisitorOTP);

export default router;