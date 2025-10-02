import mongoose, { Schema, Document } from "mongoose";
export interface IClientLead extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  birthDate: Date;
  message: string;
  createdAt: Date;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
}

const ClientLeadSchema = new Schema<IClientLead>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, trim: true, max: 100 },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, trim: true, max: 15 },
    jobTitle: { type: String, required: true, trim: true, max: 100 },
    birthDate: { type: Date, required: true },
    message: { type: String, required: true, trim: true, max: 500 },
    utmSource: { type: String, trim: true, max: 100 },
    utmMedium: { type: String, trim: true, max: 100 },
    utmCampaign: { type: String, trim: true, max: 100 },
    utmTerm: { type: String, trim: true, max: 100 },
    utmContent: { type: String, trim: true, max: 100 },
    gclid: { type: String, trim: true, max: 100 },
    fbclid: { type: String, trim: true, max: 100 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export const ClientLeadModel = mongoose.model<IClientLead>(
  "ClientLead",
  ClientLeadSchema
);
