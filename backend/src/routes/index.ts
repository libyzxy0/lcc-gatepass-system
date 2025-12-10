import { Router, Application, Request, Response } from "express";
import { admin_auth } from '@/middlewares/admin-auth'
import { API_VERSION } from "@/utils/version";
import studentController from "@/controllers/student.controller";
import adminController from "@/controllers/admin.controller";

const router = Router();

router.route("/").get((req: Request, res: Response) => {
  res.json({ message: "Hello, World!!" });
});

/* Handle routes for admin controller */
router.route("/admin/new").post(admin_auth, adminController.newAdmin);
router.route("/admin/login").post(adminController.login);
router.route("/admin/refresh").post(adminController.refresh);
router.route("/admin/logout").post(admin_auth, adminController.logout);
router.route("/admin/session").get(admin_auth, adminController.getSession);

router.route("/student/create-student").post(admin_auth, studentController.createStudent);
router.route("/student/get-students").get(admin_auth, studentController.getStudents);
router.route("/student/get-student").post(admin_auth, studentController.getStudent);
router.route("/student/update-student").post(admin_auth, studentController.updateStudent);
router.route("/student/delete-student/:id").delete(admin_auth, studentController.deleteStudent);

/* Initialize router */
export const initializeRoutes = (app: Application) =>
  app.use(API_VERSION, router);