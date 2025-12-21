import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import espController from "@/controllers/esp.controller";

const router = Router();

router.post("/rfid", espController.rfid);
router.post("/qr", espController.qr);
router.get("/config", espController.config);

export default router;