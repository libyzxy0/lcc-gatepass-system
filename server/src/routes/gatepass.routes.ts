import { Router } from "express";
import { visitor_auth } from "@/middlewares/visitor-auth";
import { admin_auth } from "@/middlewares/admin-auth";
import GatepassController from "@/controllers/gatepass.controller";

const router = Router();

router.get("/", visitor_auth, GatepassController.gatepass);
router.post("/request-gatepass", visitor_auth, GatepassController.requestGatepass);
router.post("/approve", visitor_auth, GatepassController.approveGatepass);
router.post("/reject", visitor_auth, GatepassController.rejectGatepass);
router.delete("/delete-gatepass/:id", visitor_auth, GatepassController.deleteGatepass);

/* Admin Data */
router.get('/all', admin_auth, GatepassController.getAllGatepassData);

export default router;