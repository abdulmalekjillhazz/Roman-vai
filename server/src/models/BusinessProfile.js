import mongoose from 'mongoose';

const businessProfileSchema = new mongoose.Schema({
  singletonKey: { type: String, required: true, unique: true, default: 'main' },
  legalName: { type: String, trim: true },
  displayName: { type: String, trim: true, default: 'Classical Decor ID' },
  introduction: { type: String, trim: true },
  history: { type: String, trim: true },
  missionValues: { type: String, trim: true },
  contactPhone: { type: String, trim: true },
  whatsappNumber: { type: String, trim: true },
  contactEmail: { type: String, trim: true },
  officeAddress: { type: String, trim: true },
  showroomAddress: { type: String, trim: true },
  googleMapsUrl: { type: String, trim: true },
  serviceAreas: [{ type: String }],
  operatingHours: { type: String, trim: true },
  logoUrl: { type: String },
  photoUrls: [{ type: String }],
  socials: {
    instagramUrl: String,
    facebookUrl: String,
    linkedinUrl: String
  },
  registrationDetails: { type: String, trim: true },
  certificateUrls: [{ type: String }],
  companyProfilePdfUrl: { type: String }
}, { timestamps: true });

export const BusinessProfile = mongoose.models.BusinessProfile || mongoose.model('BusinessProfile', businessProfileSchema);
