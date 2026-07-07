export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Contractor {
  id: string;
  name: string;
  websiteDomain: string;
  websiteAge: string;
  physicalLocation: string;
  hasPhysicalAddress: boolean;
  trustScore: number;
  rating: number;
  reviewCount: number;
  scamReportCheck: string;
  courtDocketsCheck: string;
  stateLicense: string;
  phone?: string;
  city?: string;
  manufacturerCredentials: string[];
  specialties: string[];
  bio: string;
  logoColor: string;
  reviews: Review[];
}

export interface DamagePin {
  id: string;
  facetName: string;
  x: number; // percentage from left
  y: number; // percentage from top
  damageType: 'Hail Bruising' | 'Wind-Fractured Shingles' | 'Cosmetic Blistering' | 'Exposed Underlayment';
  notes: string;
  photoUrl?: string;
  photoUrls?: string[];
  photoNotes?: string[];
  severity: 'low' | 'medium' | 'high';
  videoUrl?: string;
  videoNarration?: string;
  videoUrls?: string[];
  videoNarrations?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'homeowner' | 'contractor' | 'system';
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'image' | 'pdf' | 'doc';
  flagged?: boolean;
}

export interface EscrowMilestone {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
  amount: number;
  isDeductible: boolean;
  requiredProofDescription: string;
  proofPhotoUrl?: string;
}

export interface ProjectDispute {
  id: string;
  category: 'workmanship' | 'pricing' | 'communication' | 'contract_terms' | 'other';
  status: 'structured_self_resolution' | 'mediation' | 'arbitration' | 'resolved';
  description: string;
  requestedOutcome: string;
  createdAt: string;
  homeownerPosition: string;
  contractorPosition?: string;
  mediationNotes?: string[];
}
