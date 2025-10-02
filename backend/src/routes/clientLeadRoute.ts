import express, { Request, Response } from "express";
import { ValidateCreateLead } from "../tools/apiInputValidator";
import { authenticateToken } from "../middlewares/authToken";
const leadController = require("../controllers/clientLeadController");
const router = express.Router();

router.get("/api/leads", authenticateToken, leadController.getClientLeads);

router.get(
  "/api/leads/:id",
  authenticateToken,
  leadController.getClientLeadById
);

router.get(
  "/api/leads/search",
  authenticateToken,
  leadController.searchClientLeadByEmail
);

router.post(
  "/api/leads",
  ValidateCreateLead(),
  leadController.createClientLead
);

router.put(
  "/api/leads/:id",
  authenticateToken,
  ValidateCreateLead(),
  leadController.updateClientLead
);

router.delete(
  "/api/leads/:id",
  authenticateToken,
  leadController.deleteClientLead
);

export { router as clientLeadRoute };
