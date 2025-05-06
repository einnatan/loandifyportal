'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { ProcessedDocument, DocumentType, processDocument, extractFormData } from '../../lib/services/ocrService'
import { Spinner } from './ui/spinner'

interface DocumentUploaderProps {
  documentType: DocumentType
  label: string
  description: string
  onUploadComplete?: (document: ProcessedDocument) => void
  onDataExtracted?: (data: Record<string, any>) => void
  required?: boolean
}

export function DocumentUploader({
  documentType,
  label,
  description,
  onUploadComplete,
  onDataExtracted,
  required = false
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [document, setDocument] = useState<ProcessedDocument | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [showExtractedData, setShowExtractedData] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)
  
  const allowedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf'
  ]

  useEffect(() => {
    setIsMounted(true)
    
    // Add drag and drop event listeners
    const dropArea = dropAreaRef.current
    if (dropArea) {
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dropArea.classList.add('bg-blue-50', 'border-blue-300')
      }
      
      const handleDragLeave = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dropArea.classList.remove('bg-blue-50', 'border-blue-300')
      }
      
      const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dropArea.classList.remove('bg-blue-50', 'border-blue-300')
        
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
          handleFile(e.dataTransfer.files[0])
        }
      }
      
      dropArea.addEventListener('dragover', handleDragOver)
      dropArea.addEventListener('dragleave', handleDragLeave)
      dropArea.addEventListener('drop', handleDrop)
      
      return () => {
        dropArea.removeEventListener('dragover', handleDragOver)
        dropArea.removeEventListener('dragleave', handleDragLeave)
        dropArea.removeEventListener('drop', handleDrop)
      }
    }
  }, [])
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    handleFile(file)
  }
  
  const handleFile = async (file: File) => {
    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload a PDF or image file (JPG, JPEG, PNG).`)
      return
    }
    
    try {
      setError(null)
      setIsUploading(true)
      setProgress(0)
      
      // Simulate file upload with progress
      const totalSteps = 10
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(Math.floor((i / totalSteps) * 100))
      }
      
      setIsUploading(false)
      setIsProcessing(true)
      setProgress(0)
      
      // Process document with OCR
      const processedDoc = await processDocument(file, documentType)
      setDocument(processedDoc)
      setShowExtractedData(true)
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(processedDoc)
      }
      
      // Extract data if OCR was successful
      if (processedDoc.status === 'completed' && processedDoc.ocrResult && onDataExtracted) {
        const extractedData = extractFormData([processedDoc])
        onDataExtracted(extractedData)
      }
      
      setIsProcessing(false)
    } catch (err) {
      setIsUploading(false)
      setIsProcessing(false)
      setError('Failed to process document. Please try again.')
      console.error('Document processing error:', err)
    }
  }
  
  const getStatusText = () => {
    if (isUploading) return `Uploading... ${progress}%`
    if (isProcessing) return 'Processing with OCR...'
    if (document?.status === 'completed') return 'Processed successfully'
    if (document?.status === 'failed') return 'Processing failed'
    return 'Upload Document'
  }
  
  const getStatusColor = () => {
    if (document?.status === 'completed') return 'text-green-700 bg-green-100'
    if (document?.status === 'failed') return 'text-red-700 bg-red-100'
    if (isProcessing || isUploading) return 'text-blue-700 bg-blue-100'
    return ''
  }
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-700'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`
  }
  
  const toggleExtractedData = () => {
    setShowExtractedData(prev => !prev)
  }
  
  const renderFieldConfidence = (fields: Record<string, { value: string, confidence: number }>) => {
    return (
      <div className="mt-3 space-y-2">
        <h5 className="text-xs font-semibold text-gray-700">Extracted Fields:</h5>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(fields).map(([key, { value, confidence }]) => (
            <div key={key} className="text-xs">
              <span className="font-medium">{key}: </span>
              <span>{value}</span>
              <span className={`ml-1 text-[10px] ${getConfidenceColor(confidence)}`}>
                ({formatConfidence(confidence)})
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium flex items-center">
            {label} {required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          
          <div className={`px-3 py-1 rounded-full text-sm flex items-center ${getStatusColor()}`}>
            {document?.status === 'completed' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            
            {document?.status === 'failed' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            
            {(isUploading || isProcessing) && (
              <Spinner className="h-4 w-4 mr-1" />
            )}
            
            {getStatusText()}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        
        {error && (
          <div className="text-sm text-red-600 mb-3 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        {document?.status === 'completed' && document.ocrResult && (
          <div className="mb-4">
            <div 
              className="p-3 bg-gray-50 rounded-md text-sm border cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={toggleExtractedData}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Extracted Information</h4>
                <div className="flex items-center">
                  <span className={`text-xs mr-2 ${getConfidenceColor(document.ocrResult.confidence)}`}>
                    {formatConfidence(document.ocrResult.confidence)} confidence
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform ${showExtractedData ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {showExtractedData && document.ocrResult.fields && (
                renderFieldConfidence(document.ocrResult.fields)
              )}
            </div>
          </div>
        )}
        
        {/* File Input */}
        <div 
          ref={dropAreaRef}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            document?.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-300'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          
          {!document?.status && (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop your file here, or{' '}
                <button
                  type="button"
                  className="text-primary font-medium hover:underline focus:outline-none"
                  onClick={handleUploadClick}
                >
                  browse
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Accepted formats: PDF, JPG, PNG
              </p>
            </>
          )}
          
          {document?.status === 'completed' && (
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="mt-2 text-sm">
                <p className="font-medium text-green-700">{document.id || 'Document'}</p>
                <p className="text-gray-500">{document.documentType} - {new Date().toLocaleString()}</p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleUploadClick}
              >
                Replace Document
              </Button>
            </div>
          )}
          
          {document?.status === 'failed' && (
            <div className="flex flex-col items-center text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="mt-2 text-sm">Processing failed. Please try again.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleUploadClick}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 