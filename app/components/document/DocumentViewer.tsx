'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Document } from '../../../lib/types/document';
import { 
  formatFileSize, 
  formatDate, 
  generateShareLink, 
  isImageFile, 
  isPdfFile 
} from '../../../lib/utils/documentUtils';

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  const [shareLink, setShareLink] = useState<{ link: string; expiresAt: Date } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  if (!document) return null;

  const handleGenerateShareLink = () => {
    const link = generateShareLink(document.id);
    setShareLink(link);
    setLinkCopied(false);
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink.link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const renderDocumentContent = () => {
    if (isImageFile(document.mimeType)) {
      return (
        <div className="flex justify-center p-4 bg-gray-100 rounded-md">
          <img 
            src={document.fileUrl} 
            alt={document.name} 
            className="max-h-96 max-w-full object-contain"
          />
        </div>
      );
    } else if (isPdfFile(document.mimeType)) {
      return (
        <div className="w-full h-96 p-4 bg-gray-100 rounded-md">
          <iframe 
            src={`${document.fileUrl}#toolbar=0&navpanes=0`} 
            className="w-full h-full"
            title={document.name}
          />
        </div>
      );
    } else {
      return (
        <div className="p-8 text-center bg-gray-100 rounded-md">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 mx-auto text-gray-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">Preview Not Available</h3>
          <p className="text-gray-500 mb-4">This document type cannot be previewed directly.</p>
          <Button onClick={() => window.open(document.fileUrl, '_blank')}>
            Download Document
          </Button>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{document.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {renderDocumentContent()}
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Document Type</h3>
              <p className="text-sm text-gray-900 capitalize">{document.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
              <p className="text-sm text-gray-900 capitalize">{document.category.replace('_', ' ')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Upload Date</h3>
              <p className="text-sm text-gray-900">{formatDate(document.uploadDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Size</h3>
              <p className="text-sm text-gray-900">{formatFileSize(document.size)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
              <p className="text-sm text-gray-900 capitalize">{document.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Verification</h3>
              <p className="text-sm text-gray-900">
                {document.verificationInfo?.verifiedDate ? (
                  <span className="text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Document
                  </span>
                ) : 'Not Verified'}
              </p>
            </div>
          </div>
          
          {document.tags && document.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {document.metadata && Object.keys(document.metadata).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                {Object.entries(document.metadata).map(([key, value]) => (
                  <div key={key} className="flex mb-1 last:mb-0">
                    <span className="text-xs text-gray-500 w-1/3 capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-xs text-gray-900 w-2/3">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Share Document</h3>
            {!shareLink ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateShareLink}
              >
                Generate Temporary Link
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={shareLink.link}
                    className="flex-1 p-2 text-sm border rounded-l-md bg-gray-50"
                  />
                  <Button 
                    size="sm" 
                    className="rounded-l-none"
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  This link will expire on {formatDate(shareLink.expiresAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 