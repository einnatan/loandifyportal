import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentCategory, DocumentStatus, DocumentType } from "../types/document";

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  size: number;
  mimeType: string;
  url: string;
  status: DocumentStatus;
  uploadedAt: string;
  isVerified: boolean;
  verifiedAt?: string;
  tags: string[];
  metadata: Record<string, any>;
}

// Mock document storage
const documents: Document[] = [
  {
    id: 'doc-1',
    userId: 'user-123',
    name: 'Proof of Identity',
    type: 'identity',
    category: 'verification',
    size: 1024 * 1024 * 2.5, // 2.5 MB
    mimeType: 'application/pdf',
    url: 'https://example.com/documents/identity-proof.pdf',
    status: 'verified',
    uploadedAt: '2023-07-15T10:30:00Z',
    isVerified: true,
    verifiedAt: '2023-07-16T14:20:00Z',
    tags: ['passport', 'verification', 'identity'],
    metadata: {
      expiryDate: '2028-05-20',
      issueCountry: 'Singapore',
      documentNumber: 'A12345678'
    }
  },
  {
    id: 'doc-2',
    userId: 'user-123',
    name: 'Income Statement',
    type: 'income',
    category: 'loan_application',
    size: 1024 * 1024 * 1.8, // 1.8 MB
    mimeType: 'application/pdf',
    url: 'https://example.com/documents/income-statement.pdf',
    status: 'verified',
    uploadedAt: '2023-07-12T09:15:00Z',
    isVerified: true,
    verifiedAt: '2023-07-13T11:40:00Z',
    tags: ['income', 'statement', 'salary'],
    metadata: {
      period: 'Jan 2023 - Jun 2023',
      employer: 'ABC Corporation',
      totalIncome: '$45,000'
    }
  },
  {
    id: 'doc-3',
    userId: 'user-123',
    name: 'Bank Statement',
    type: 'bank',
    category: 'verification',
    size: 1024 * 1024 * 3.2, // 3.2 MB
    mimeType: 'application/pdf',
    url: 'https://example.com/documents/bank-statement.pdf',
    status: 'pending',
    uploadedAt: '2023-07-18T14:50:00Z',
    isVerified: false,
    tags: ['bank', 'statement', 'finance'],
    metadata: {
      bankName: 'DBS Bank',
      accountNumber: 'xxxx-xxxx-4567',
      period: 'Apr 2023 - Jun 2023'
    }
  },
  {
    id: 'doc-4',
    userId: 'user-123',
    name: 'Loan Agreement',
    type: 'contract',
    category: 'ongoing_loan',
    size: 1024 * 1024 * 1.5, // 1.5 MB
    mimeType: 'application/pdf',
    url: 'https://example.com/documents/loan-agreement.pdf',
    status: 'verified',
    uploadedAt: '2023-06-25T16:20:00Z',
    isVerified: true,
    verifiedAt: '2023-06-26T10:10:00Z',
    tags: ['contract', 'loan', 'agreement'],
    metadata: {
      loanId: 'LOAN-2023-001',
      loanAmount: '$25,000',
      interestRate: '3.5%',
      term: '5 years'
    }
  },
  {
    id: 'doc-5',
    userId: 'user-123',
    name: 'Proof of Address',
    type: 'address',
    category: 'verification',
    size: 1024 * 1024 * 0.8, // 0.8 MB
    mimeType: 'image/jpeg',
    url: 'https://example.com/documents/address-proof.jpg',
    status: 'rejected',
    uploadedAt: '2023-07-10T11:25:00Z',
    isVerified: false,
    tags: ['address', 'utility', 'bill'],
    metadata: {
      addressType: 'Residential',
      issueDate: '2023-06-15',
      rejectionReason: 'Document is older than 3 months'
    }
  }
];

/**
 * Get all documents for a user
 */
export async function getUserDocuments(userId: string): Promise<Document[]> {
  // Simulate API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(documents.filter(doc => doc.userId === userId));
    }, 500);
  });
}

/**
 * Get a document by ID
 */
export async function getDocumentById(documentId: string): Promise<Document | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const doc = documents.find(d => d.id === documentId) || null;
      resolve(doc);
    }, 300);
  });
}

/**
 * Get documents by type
 */
export async function getDocumentsByType(userId: string, type: DocumentType): Promise<Document[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(documents.filter(doc => doc.userId === userId && doc.type === type));
    }, 300);
  });
}

/**
 * Get documents by category
 */
export async function getDocumentsByCategory(userId: string, category: DocumentCategory): Promise<Document[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(documents.filter(doc => doc.userId === userId && doc.category === category));
    }, 300);
  });
}

interface UploadDocumentOptions {
  file: File;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  tags?: string[];
}

/**
 * Upload a new document
 */
export async function uploadDocument(userId: string, options: UploadDocumentOptions): Promise<Document> {
  const { file, name, type, category, tags = [] } = options;
  
  // Simulate API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDocument: Document = {
        id: `doc-${uuidv4()}`,
        userId,
        name,
        type,
        category,
        size: file.size,
        mimeType: file.type,
        url: URL.createObjectURL(file), // In a real app, this would be a server URL
        status: 'pending',
        uploadedAt: new Date().toISOString(),
        isVerified: false,
        tags,
        metadata: {}
      };
      
      documents.push(newDocument);
      resolve(newDocument);
    }, 1500);
  });
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = documents.findIndex(d => d.id === documentId);
      if (index !== -1) {
        documents.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
}

/**
 * Update document metadata
 */
export async function updateDocumentMetadata(
  documentId: string, 
  metadata: Record<string, any>
): Promise<Document | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        doc.metadata = { ...doc.metadata, ...metadata };
        resolve(doc);
      } else {
        resolve(null);
      }
    }, 300);
  });
}

/**
 * Share a document - generates a temporary share link
 */
export async function shareDocument(documentId: string): Promise<{ shareUrl: string; expiresAt: string } | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        // In a real app, this would create a secure, temporary link with proper expiration
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24); // 24 hour expiry
        
        resolve({
          shareUrl: `https://loandify.com/shared/${documentId}?token=${Math.random().toString(36).substring(2, 15)}`,
          expiresAt: expiryDate.toISOString()
        });
      } else {
        resolve(null);
      }
    }, 500);
  });
}

/**
 * Service for managing documents securely
 */
export class DocumentService {
  private static API_URL = '/api/documents';
  
  /**
   * Upload a document to the server
   * @param file The file to upload
   * @param userId The ID of the user uploading the document
   * @param metadata Additional metadata about the document
   * @returns The uploaded document information
   */
  public static async uploadDocument(
    file: File,
    userId: string,
    metadata: {
      type: DocumentType;
      category: DocumentCategory;
      description?: string;
      tags?: string[];
    }
  ): Promise<Document> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('metadata', JSON.stringify(metadata));
      
      const response = await fetch(`${this.API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
  
  /**
   * Get all documents for a user
   * @param userId The ID of the user
   * @param options Query options
   * @returns Array of documents
   */
  public static async getUserDocuments(
    userId: string,
    options?: {
      category?: DocumentCategory;
      type?: DocumentType;
      status?: DocumentStatus;
      limit?: number;
      offset?: number;
      sortBy?: 'uploadDate' | 'name' | 'size';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<Document[]> {
    try {
      const queryParams = new URLSearchParams({ userId });
      
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const response = await fetch(`${this.API_URL}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user documents:', error);
      throw error;
    }
  }
  
  /**
   * Get a document by its ID
   * @param documentId The ID of the document
   * @returns The document or null if not found
   */
  public static async getDocumentById(documentId: string): Promise<Document | null> {
    try {
      const response = await fetch(`${this.API_URL}/${documentId}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching document ${documentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a document by its ID
   * @param documentId The ID of the document to delete
   * @param userId The ID of the user making the request (for authorization)
   * @returns A success indicator
   */
  public static async deleteDocument(documentId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete document: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting document ${documentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update document metadata
   * @param documentId The ID of the document to update
   * @param userId The ID of the user making the request (for authorization)
   * @param updates The updates to apply
   * @returns The updated document
   */
  public static async updateDocument(
    documentId: string,
    userId: string,
    updates: {
      name?: string;
      description?: string;
      category?: DocumentCategory;
      type?: DocumentType;
      tags?: string[];
    }
  ): Promise<Document> {
    try {
      const response = await fetch(`${this.API_URL}/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...updates,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update document: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating document ${documentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Share a document with another user
   * @param documentId The ID of the document to share
   * @param ownerId The ID of the document owner
   * @param targetUserId The ID of the user to share with
   * @param permissions The permissions to grant (default: read-only)
   * @returns A success indicator
   */
  public static async shareDocument(
    documentId: string,
    ownerId: string,
    targetUserId: string,
    permissions: 'read' | 'edit' | 'admin' = 'read'
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/${documentId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId,
          targetUserId,
          permissions,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to share document: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error sharing document ${documentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Generate a secure, time-limited URL for downloading a document
   * @param documentId The ID of the document
   * @param userId The ID of the user making the request (for authorization)
   * @param expiryMinutes How long the URL should be valid for, in minutes (default: 15)
   * @returns A secure download URL
   */
  public static async getSecureDownloadUrl(
    documentId: string,
    userId: string,
    expiryMinutes: number = 15
  ): Promise<string> {
    try {
      const response = await fetch(`${this.API_URL}/${documentId}/download-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          expiryMinutes,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate download URL: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.downloadUrl;
    } catch (error) {
      console.error(`Error generating download URL for document ${documentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Search for documents by text content (OCR)
   * @param userId The ID of the user making the request
   * @param searchText The text to search for
   * @param options Additional search options
   * @returns Array of matching documents
   */
  public static async searchDocumentContent(
    userId: string,
    searchText: string,
    options?: {
      category?: DocumentCategory;
      type?: DocumentType;
      limit?: number;
      offset?: number;
    }
  ): Promise<Document[]> {
    try {
      const queryParams = new URLSearchParams({
        userId,
        searchText,
      });
      
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const response = await fetch(`${this.API_URL}/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to search documents: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching document content:', error);
      throw error;
    }
  }
} 