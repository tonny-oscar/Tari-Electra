export interface SubmeterDocument {
  name: string;
  url: string;
  type: string;
}

export interface SubmeterApplication {
  id?: string;
  userId?: string;
  propertyType: 'residential' | 'commercial' | 'industrial';
  utilityServices?: ('electricity' | 'water')[];
  applicationType: 'new' | 'existing';
  fullName: string;
  phoneNumber: string;
  idNumber?: string;
  email: string;
  physicalLocation: string;
  areaTown: string;
  mainMeterAccountNumber?: string;
  currentReading?: number;
  submeterAccountNumber?: string;
  submetersRegistered?: string;
  suppliesOtherAreas?: boolean;
  linkedMeterNumbers?: string;
  termsAccepted?: boolean;
  signature?: string;
  submissionDate: string | any;
  status: 'pending' | 'approved' | 'rejected';
  // Additional fields for document management and approval process
  documents?: SubmeterDocument[];
  approvalDocumentUrl?: string;
  approvalDate?: string;
  approvalNotes?: string;
  rejectionDate?: string;
  rejectionNotes?: string;
  updatedAt?: string;
}
