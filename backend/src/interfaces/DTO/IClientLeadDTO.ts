export interface IClientLeadDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  birthDate: string;
  message: string;
  createdAt: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
}
