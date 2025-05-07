import { format } from 'date-fns';
import { DocumentType } from '../types/document';

/**
 * Format bytes to a human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format a date string to a readable format
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

/**
 * Get an icon name based on document type
 */
export function getDocumentTypeIcon(type: DocumentType): string {
  switch (type) {
    case 'identity':
      return 'user-circle';
    case 'income':
      return 'currency-dollar';
    case 'address':
      return 'home';
    case 'bank':
      return 'credit-card';
    case 'tax':
      return 'document-text';
    case 'contract':
      return 'document';
    case 'other':
    default:
      return 'document';
  }
}

/**
 * Get the mime type extensions (for display purposes)
 */
export function getFileExtension(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'text/plain': 'TXT',
    'application/zip': 'ZIP'
  };
  
  return mimeMap[mimeType] || 'FILE';
}

/**
 * Generate a temporary share link for a document
 */
export function generateShareLink(documentId: string): { link: string, expiresAt: Date } {
  // In a real app, this would create a secure, temporary link with proper expiration
  const expirationHours = 24;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expirationHours);
  
  return {
    link: `https://loandify.com/shared-documents/${documentId}?token=${generateRandomToken()}`,
    expiresAt
  };
}

/**
 * Generate a random token for document sharing
 */
function generateRandomToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Check if a file is an image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if a file is a PDF
 */
export function isPdfFile(mimeType: string): boolean {
  return mimeType === 'application/pdf';
} 