import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import LogController from "@/controllers/logs.controller";

const router = Router();

router.get("/all", admin_auth, LogController.getAllLogs);
router.get("/get/:id", admin_auth, LogController.getLog);
router.delete("/delete/:id", admin_auth, LogController.deleteLog);

export default router;