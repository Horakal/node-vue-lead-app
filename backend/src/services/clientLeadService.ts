import { ClientLeadModel } from "../models/clientsLeadModel";
import { IClientLead } from "../models/clientsLeadModel";
import { ICreateLead } from "../interfaces/ICreateLead";
import { IClientLeadDTO } from "../interfaces/DTO/IClientLeadDTO";
import { FilterQuery } from "mongoose";
class ClientLeadService {
  private toLeadDto(lead: IClientLead): IClientLeadDTO {
    return {
      id: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      jobTitle: lead.jobTitle,
      birthDate: lead.birthDate.toLocaleDateString("pt-BR"),
      message: lead.message,
      utmSource: lead.utmSource,
      utmMedium: lead.utmMedium,
      utmCampaign: lead.utmCampaign,
      utmTerm: lead.utmTerm,
      utmContent: lead.utmContent,
      gclid: lead.gclid,
      fbclid: lead.fbclid,
      createdAt: lead.createdAt.toISOString(), // Ex.: 2025-10-01T12:00:00Z
    };
  }

  async getClientLeads(): Promise<IClientLeadDTO[]> {
    const leads = await ClientLeadModel.find().lean();

    return leads.map(this.toLeadDto);
  }
  async getClientLeadById(id: string): Promise<IClientLeadDTO> {
    const lead = await ClientLeadModel.findById(id).lean();
    if (!lead) {
      throw new Error("Lead not found");
    }
    return this.toLeadDto(lead);
  }
  async searchClientLead(
    email?: string,
    name?: string
  ): Promise<IClientLeadDTO> {
    if (!email && !name) {
      throw new Error("Email or Name must be provided");
    }
    const filter: FilterQuery<IClientLead> = {};
    if (email) filter.email = email;
    if (name) filter.name = name;

    const lead = await ClientLeadModel.findOne(filter).lean();
    if (!lead) {
      throw new Error("Lead not found");
    }

    return this.toLeadDto(lead);
  }
  async createClientLead(data: ICreateLead) {
    const newClientLead = new ClientLeadModel(data);
    return await newClientLead.save();
  }
  async updateClientLead(
    id: string,
    data: ICreateLead
  ): Promise<IClientLead | null> {
    return await ClientLeadModel.findByIdAndUpdate(id, data, { new: true });
  }
  async deleteClientLead(id: string) {
    return await ClientLeadModel.findByIdAndDelete(id);
  }
  async getLeadAsCsv() {
    const leads = await ClientLeadModel.find().lean();
    const csv = leads.map((lead) => ({
      id: lead._id,
      email: lead.email,
      name: lead.name,
    }));
    return csv;
  }
}

export default new ClientLeadService();
