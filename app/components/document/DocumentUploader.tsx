'use client';

import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { uploadDocument } from '../../../lib/services/documentService';
import { DocumentType, DocumentCategory } from '../../../lib/types/document';
import { formatFileSize } from '../../../lib/utils/documentUtils';

interface DocumentUploaderProps {
  userId: string;
  onUploadComplete?: () => void;
  documentType?: DocumentType;
  documentCategory?: DocumentCategory;
  className?: string;
}

export function DocumentUploader({
  userId,
  onUploadComplete,
  documentType,
  documentCategory,
  className = ''
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name.split('.')[0]);
      }
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name.split('.')[0]);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !documentName.trim()) return;
    
    try {
      setIsUploading(true);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const result = await uploadDocument(userId, {
        file: selectedFile,
        name: documentName.trim(),
        type: documentType || 'other',
        category: documentCategory || 'other',
        tags: [] // Add tags support if needed
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        setDocumentName('');
        setUploadProgress(0);
        
        if (onUploadComplete) {
          onUploadComplete();
        }
      }, 500);
      
    } catch (error) {
      console.error('Error uploading document:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className={`${className}`}>
      <div 
        className={`border-2 border-dashed rounded-md p-6 mb-4 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div>
            <div className="text-sm p-3 bg-gray-50 rounded-md mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-400 mr-2" 
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
                <div className="truncate">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSelectedFile(null);
                  setDocumentName('');
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <p className="text-lg font-medium mb-1">Drop your file here</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Select File
            </Button>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect} 
            />
          </>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="documentName" className="block text-sm font-medium text-gray-700 mb-1">
          Document Name
        </label>
        <input
          type="text"
          id="documentName"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Enter document name"
          disabled={isUploading}
        />
      </div>
      
      {documentType === undefined && (
        <div className="mb-4">
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
            Document Type
          </label>
          <select
            id="documentType"
            className="w-full p-2 border rounded-md"
            value={documentType || 'other'}
            disabled={isUploading}
          >
            <option value="identity">Identity</option>
            <option value="income">Income</option>
            <option value="address">Address</option>
            <option value="bank">Bank Statement</option>
            <option value="tax">Tax Document</option>
            <option value="contract">Contract</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}
      
      {documentCategory === undefined && (
        <div className="mb-4">
          <label htmlFor="documentCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Document Category
          </label>
          <select
            id="documentCategory"
            className="w-full p-2 border rounded-md"
            value={documentCategory || 'other'}
            disabled={isUploading}
          >
            <option value="loan_application">Loan Application</option>
            <option value="verification">Verification</option>
            <option value="ongoing_loan">Ongoing Loan</option>
            <option value="completed_loan">Completed Loan</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}
      
      {isUploading && (
        <div className="mt-4">
          <div className="flex items-center justify-center">
            <Spinner className="mr-2" />
            <span>Uploading... {uploadProgress}%</span>
          </div>
        </div>
      )}
      
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || !documentName.trim() || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <div className="flex items-center justify-center">
            <Spinner className="mr-2" />
            <span>Uploading...</span>
          </div>
        ) : (
          'Upload Document'
        )}
      </Button>
    </div>
  );
} 