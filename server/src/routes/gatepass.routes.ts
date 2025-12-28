import { Router } from "express";
import { visitor_auth } from "@/middlewares/visitor-auth";
import { admin_auth } from "@/middlewares/admin-auth";
import GatepassController from "@/controllers/gatepass.controller";

const router = Router();

router.get("/", visitor_auth, GatepassController.gatepass);
router.post("/request-gatepass", visitor_auth, GatepassController.requestGatepass);
router.delete("/delete-gatepass/:id", visitor_auth, GatepassController.deleteGatepass);

export default router;