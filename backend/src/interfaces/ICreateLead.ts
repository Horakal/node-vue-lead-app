export interface ICreateLead {
  name: string;
  email: string;
  document: string;
  jobTitle: string;
  birthDate: Date;
  message: string;
  createdAt: Date;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}
