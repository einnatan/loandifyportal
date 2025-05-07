'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Spinner } from '../components/ui/spinner';
import { DocumentCard } from '../components/document/DocumentCard';
import { DocumentUploader } from '../components/document/DocumentUploader';
import { DocumentViewer } from '../components/document/DocumentViewer';
import { 
  getUserDocuments,
  deleteDocument
} from '../../lib/services/documentService';
import { Document, DocumentType, DocumentCategory } from '../../lib/types/document';
import { useI18n } from '../../lib/i18n/i18nContext';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

export default function DocumentsPage() {
  const { t } = useI18n();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');
  const [showUploader, setShowUploader] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [activeFilter, setActiveFilter] = useState<DocumentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Mock user ID - in a real app this would come from authentication
  const userId = 'user-123';
  
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getUserDocuments(userId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const handleDeleteDocument = async (doc: Document) => {
    if (window.confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      try {
        await deleteDocument(doc.id);
        setDocuments(documents.filter(d => d.id !== doc.id));
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };
  
  const filteredDocuments = documents.filter(doc => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (selectedType !== 'all' && doc.type !== selectedType) return false;
    return true;
  });
  
  const documentCategories: Array<{value: DocumentCategory | 'all', label: string}> = [
    { value: 'all', label: 'All Categories' },
    { value: 'loan_application', label: 'Loan Applications' },
    { value: 'verification', label: 'Verification' },
    { value: 'ongoing_loan', label: 'Ongoing Loans' },
    { value: 'completed_loan', label: 'Completed Loans' },
    { value: 'personal', label: 'Personal' },
    { value: 'other', label: 'Other' }
  ];
  
  const documentTypes: Array<{value: DocumentType | 'all', label: string}> = [
    { value: 'all', label: 'All Types' },
    { value: 'identity', label: 'Identity' },
    { value: 'income', label: 'Income' },
    { value: 'address', label: 'Address' },
    { value: 'bank', label: 'Bank' },
    { value: 'tax', label: 'Tax' },
    { value: 'contract', label: 'Contract' },
    { value: 'other', label: 'Other' }
  ];
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // In a real application, you would upload the file to your server
      // Mock upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a new document entry
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        userId: userId,
        name: files[0].name,
        type: 'other',
        category: 'personal',
        size: files[0].size,
        mimeType: files[0].type,
        uploadDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'processing',
        fileUrl: URL.createObjectURL(files[0]),
        description: 'Newly uploaded document',
        tags: [],
        metadata: {},
        isArchived: false
      };
      
      setDocuments([newDoc, ...documents]);
      
      // Update status after "processing"
      setTimeout(() => {
        setDocuments(prevDocs => 
          prevDocs.map(doc => 
            doc.id === newDoc.id 
              ? { ...doc, status: 'pending' } 
              : doc
          )
        );
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };
  
  const handleDocumentDelete = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };
  
  const handleDocumentView = (doc: Document) => {
    setSelectedDocument(doc);
    // In a real application, you would fetch the document content or open a viewer
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default">{t('common', 'documents.verified')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('common', 'documents.rejected')}</Badge>;
      case 'pending':
        return <Badge variant="secondary">{t('common', 'documents.pending')}</Badge>;
      case 'processing':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Spinner className="size-3" />
            {t('common', 'documents.processing')}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Document Management</h1>
          <p className="text-gray-600">
            Securely store and manage all your important documents
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => setShowUploader(!showUploader)}
          >
            {showUploader ? 'Hide Uploader' : 'Upload Document'}
          </Button>
        </div>
      </div>
      
      {showUploader && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
          <DocumentUploader 
            userId={userId}
            onUploadComplete={() => {
              loadDocuments();
              setShowUploader(false);
            }}
          />
        </Card>
      )}
      
      <div className="mb-6">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as DocumentCategory | 'all')}
                className="w-full p-2 border rounded-md"
              >
                {documentCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Type
              </label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value as DocumentType | 'all')}
                className="w-full p-2 border rounded-md"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </div>
      
      {loading ? (
        <div className="py-12 text-center">
          <Spinner className="mx-auto mb-4 size-8" />
          <p className="text-gray-500">Loading your documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">No documents found</h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory !== 'all' || selectedType !== 'all'
              ? 'Try changing your filters or upload a new document that matches your criteria.'
              : 'Upload your first document to get started.'}
          </p>
          {(selectedCategory !== 'all' || selectedType !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedType('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={() => setViewingDocument(doc)}
              onShare={() => setViewingDocument(doc)}
              onDelete={() => handleDeleteDocument(doc)}
            />
          ))}
        </div>
      )}
      
      <DocumentViewer
        document={viewingDocument}
        isOpen={viewingDocument !== null}
        onClose={() => setViewingDocument(null)}
      />
    </div>
  );
} 