import { Router, Application } from "express";
import adminRoutes from "./admin.routes";
import studentRoutes from "./student.routes";
import visitorRoutes from "./visitor.routes";
import espRoutes from "./esp.routes";
import otpRoutes from "./otp.routes";
import uploadRoutes from "./upload.routes";
import qrApiRoutes from "./qrapi.routes";
import { API_VERSION } from "@/utils/version";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);
router.use("/visitor", visitorRoutes);
router.use("/esp-api", espRoutes);
router.use("/otp", otpRoutes);
router.use("/upload", uploadRoutes);
router.use("/qr", qrApiRoutes);

export const initializeRoutes = (app: Application) => {
  app.use(API_VERSION, router);
};
