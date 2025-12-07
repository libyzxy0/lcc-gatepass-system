import { Router, Application, Request, Response } from "express";
import { authMiddleware } from '@/middlewares/auth'
import { API_VERSION } from "@/utils/version";
import qrController from "@/controllers/qrcode.controller";
import adminController from "@/controllers/admin.controller";

const router = Router();

router.route("/").get((req: Request, res: Response) => {
  res.json({ message: "Hello, World!!" });
});

/* Handle routes for admin controller */
router.route("/admin/new").post(authMiddleware, adminController.newAdmin);
router.route("/admin/login").post(adminController.login);
router.route("/admin/refresh").post(adminController.refresh);
router.route("/admin/logout").post(authMiddleware, adminController.logout);
router.route("/admin/session").get(authMiddleware, adminController.getSession);

router.route("/qrcode/verify").post(qrController.verifyQR);
router.route("/qrcode/verify").get(qrController.verifyQR);


/* Initialize router */
export const initializeRoutes = (app: Application) =>
  app.use(API_VERSION, router);