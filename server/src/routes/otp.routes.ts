import { Router } from "express";
import controller from "@/controllers/otp.controller";

import rateLimit from "express-rate-limit";
import { Request } from "express";

export const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1, 
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.body.phone_number || req.ip;
  },

  handler: (req, res) => {
    res.status(429).json({
      error: "OTP already sent. Please wait 5 minutes before requesting again."
    });
  }
});

const router = Router();

router.post("/vst/new", otpRateLimit, controller.generateVisitorOTP);
router.post("/vst/chk", controller.verifyVisitorOTP);

export default router;