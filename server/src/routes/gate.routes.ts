import { Router } from "express";
import { admin_auth } from "@/middlewares/admin-auth";

import GateController from "@/controllers/gate.controller";

const router = Router();

router.post("/create", admin_auth, GateController.create);
router.get("/all", admin_auth, GateController.getAll);
router.get("/get/:id", admin_auth, GateController.get);
router.post("/update", admin_auth, GateController.update);
router.delete("/delete/:id", admin_auth, GateController.delete);

export default router;