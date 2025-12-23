import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import espController from "@/controllers/esp.controller";

const router = Router();

router.post("/webhook", espController.handleEvent);

export default router;