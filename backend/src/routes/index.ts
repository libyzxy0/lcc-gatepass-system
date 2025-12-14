import { Router, Application } from "express";
import adminRoutes from "./admin.routes";
import studentRoutes from "./student.routes";
import visitorRoutes from "./visitor.routes";
import espRoutes from "./esp.routes";
import { API_VERSION } from "@/utils/version";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);
router.use("/visitor", visitorRoutes);
router.use("/esp-api", espRoutes);

export const initializeRoutes = (app: Application) => {
  app.use(API_VERSION, router);
};
