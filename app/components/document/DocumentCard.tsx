'use client';

import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Document } from '../../../lib/types/document';
import { formatFileSize, formatDate, getDocumentTypeIcon } from '../../../lib/utils/documentUtils';

interface DocumentCardProps {
  document: Document;
  onView: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export function DocumentCard({ document, onView, onShare, onDelete }: DocumentCardProps) {
  const { name, type, status, uploadDate, size, verificationInfo, tags } = document;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg text-gray-900 mb-1 truncate" title={name}>
              {name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="capitalize">{type}</span>
              <span className="mx-2">•</span>
              <span>{formatFileSize(size)}</span>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 mb-3">
            {tags.map((tag: string, index: number) => (
              <span 
                key={index} 
                className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mb-4">
          Uploaded on {formatDate(uploadDate)}
          {verificationInfo?.verifiedDate && (
            <span className="ml-2 text-green-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
        
        <div className="flex justify-between space-x-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={onView}
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onShare}
          >
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
} 