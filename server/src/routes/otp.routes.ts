import { Router, Request } from "express";
import OTPController from "@/controllers/otp.controller";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.body.phone_number || ipKeyGenerator(req.ip);
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "OTP already sent. Please wait 5 minutes before requesting again."
    });
  }
});

const router = Router();

router.post("/vst/new", otpRateLimit, OTPController.generateVisitorOTP);
router.post("/vst/chk", OTPController.verifyVisitorOTP);

export default router;
