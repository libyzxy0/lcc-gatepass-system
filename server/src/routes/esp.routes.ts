import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import ESPController from "@/controllers/esp.controller";

const router = Router();

router.post("/webhook", ESPController.handleEvent);

export default router;