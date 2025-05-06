export type DocumentType = 'identity' | 'income' | 'address' | 'bank' | 'tax' | 'contract' | 'other';
export type DocumentCategory = 'loan_application' | 'verification' | 'ongoing_loan' | 'completed_loan' | 'personal' | 'other';
export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'processing';

export interface Document {
  id: string;
  userId: string;
  name: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  lastModified: string;
  type: DocumentType;
  category: DocumentCategory;
  status: DocumentStatus;
  fileUrl?: string; // Stored securely, requires authorization to access
  thumbnailUrl?: string;
  description?: string;
  tags?: string[];
  metadata: Record<string, any>;
  securityLevel?: 'public' | 'private' | 'confidential';
  sharedWith?: Array<{
    userId: string;
    permissions: 'read' | 'edit' | 'admin';
    sharedDate: string;
  }>;
  verificationInfo?: {
    verifiedBy?: string;
    verifiedDate?: string;
    verificationNotes?: string;
  };
  expiryDate?: string;
  isArchived: boolean;
  archivedDate?: string;
} 