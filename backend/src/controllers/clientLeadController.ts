import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ICreateLead } from "../interfaces/ICreateLead";
import leadService from "../services/clientLeadService";

export const getClientLeads = async (req: Request, res: Response) => {
  try {
    const leads = await leadService.getClientLeads();
    if (!leads || leads.length === 0) {
      return res.status(404).send("No leads found");
    }
    res.status(200).send(leads);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
export const getClientLeadById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const lead = await leadService.getClientLeadById(id);
    res.status(200).send(lead);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
export const searchClientLeadByEmail = async (req: Request, res: Response) => {
  const email =
    typeof req.query.email === "string" ? req.query.email : undefined;
  const name = typeof req.query.name === "string" ? req.query.name : undefined;
  try {
    const lead = await leadService.searchClientLead(email, name);
    res.status(200).send(lead);
  } catch (error) {
    console.error("Error searching client lead:", error);
    res.status(500).send("Internal Server Error");
  }
};
export const createClientLead = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log("Validation errors:", errors.array());
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const clientLead: ICreateLead = req.body;
    const newLead = await leadService.createClientLead(clientLead);
    res.status(201).send(newLead);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
export const updateClientLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const clientLead: ICreateLead = req.body;
    const updatedLead = await leadService.updateClientLead(id, clientLead);
    res.send(updatedLead);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
export const deleteClientLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("ID is required");
  }
  try {
    await leadService.deleteClientLead(id);
    res.send(`Deleting lead with ID: ${id}`);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getLeadAsCsv = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("ID is required");
  }
  try {
    const csvData = await leadService.getLeadAsCsv();
    res.header("Content-Type", "text/csv");
    res.attachment("leads.csv");
    return res.send(csvData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
