export enum DocumentType {
  IC = 'ic',
  PASSPORT = 'passport',
  PROOF_OF_ADDRESS = 'proof_of_address',
  PROOF_OF_INCOME = 'proof_of_income',
  CPF_STATEMENT = 'cpf_statement',
  BANK_STATEMENT = 'bank_statement',
  OTHER = 'other'
}

export interface OCRResult {
  confidence: number;
  fields: Record<string, { value: string; confidence: number }>;
  rawText: string;
}

export interface ProcessedDocument {
  id: string;
  originalFileName: string;
  fileType: string;
  documentType: DocumentType;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  dateUploaded: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  ocrResult?: OCRResult;
}

/**
 * Process a document using OCR
 */
export async function processDocument(file: File, documentType: DocumentType): Promise<ProcessedDocument> {
  // In a real implementation, this would upload the file to a server and process with OCR
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = `doc_${Math.random().toString(36).substring(2, 10)}`;
      
      // Mock OCR result based on document type
      let ocrResult: OCRResult | undefined;
      
      switch (documentType) {
        case DocumentType.IC:
          ocrResult = {
            confidence: 0.92,
            fields: {
              name: { value: 'TAN AH KUAN', confidence: 0.95 },
              nric: { value: 'S9812345A', confidence: 0.98 },
              dateOfBirth: { value: '01-01-1990', confidence: 0.93 },
              address: { value: '123 TAMPINES AVE 10 SINGAPORE 123456', confidence: 0.90 }
            },
            rawText: 'REPUBLIC OF SINGAPORE\nIDENTITY CARD\nS9812345A\nTAN AH KUAN\nDOB: 01-01-1990\n123 TAMPINES AVE 10 SINGAPORE 123456'
          };
          break;
          
        case DocumentType.PROOF_OF_INCOME:
          ocrResult = {
            confidence: 0.85,
            fields: {
              employerName: { value: 'ABC COMPANY PTE LTD', confidence: 0.92 },
              employeeName: { value: 'TAN AH KUAN', confidence: 0.94 },
              salary: { value: 'SGD 5000.00', confidence: 0.88 },
              period: { value: 'JANUARY 2023', confidence: 0.86 }
            },
            rawText: 'ABC COMPANY PTE LTD\nPAYSLIP\nEmployee: TAN AH KUAN\nPeriod: JANUARY 2023\nBasic Salary: SGD 5000.00\nAllowances: SGD 500.00\nDeductions: SGD 825.00\nNet Pay: SGD 4675.00'
          };
          break;
          
        case DocumentType.BANK_STATEMENT:
          ocrResult = {
            confidence: 0.88,
            fields: {
              bankName: { value: 'DBS BANK', confidence: 0.95 },
              accountNumber: { value: '123-456789-0', confidence: 0.93 },
              accountHolder: { value: 'TAN AH KUAN', confidence: 0.91 },
              balance: { value: 'SGD 15,432.67', confidence: 0.89 }
            },
            rawText: 'DBS BANK\nSTATEMENT OF ACCOUNT\nAccount Number: 123-456789-0\nAccount Holder: TAN AH KUAN\nPeriod: 01/01/2023 - 31/01/2023\nOpening Balance: SGD 14,500.00\nClosing Balance: SGD 15,432.67'
          };
          break;
          
        default:
          ocrResult = {
            confidence: 0.75,
            fields: {
              title: { value: 'DOCUMENT', confidence: 0.85 },
              date: { value: '01-01-2023', confidence: 0.80 }
            },
            rawText: 'DOCUMENT\nDate: 01-01-2023\nSome additional text content that was extracted from the document...'
          };
      }
      
      resolve({
        id,
        originalFileName: file.name,
        fileType: file.type,
        documentType,
        status: 'completed',
        dateUploaded: new Date().toISOString(),
        fileUrl: URL.createObjectURL(file),
        thumbnailUrl: URL.createObjectURL(file),
        ocrResult
      });
    }, 1500); // Simulate processing time
  });
}

/**
 * Extract form data from processed documents
 */
export function extractFormData(documents: ProcessedDocument[]): Record<string, any> {
  // In a real implementation, this would combine data from multiple documents
  // and format it appropriately for form fields
  
  const formData: Record<string, any> = {};
  
  documents.forEach(doc => {
    if (doc.status === 'completed' && doc.ocrResult) {
      const fields = doc.ocrResult.fields;
      
      // Extract data based on document type
      switch (doc.documentType) {
        case DocumentType.IC:
          if (fields.name) formData.name = fields.name.value;
          if (fields.nric) formData.nric = fields.nric.value;
          if (fields.dateOfBirth) formData.dateOfBirth = fields.dateOfBirth.value;
          if (fields.address) formData.address = fields.address.value;
          break;
          
        case DocumentType.PROOF_OF_INCOME:
          if (fields.salary) formData.monthlyIncome = fields.salary.value;
          if (fields.employerName) formData.employerName = fields.employerName.value;
          break;
          
        case DocumentType.BANK_STATEMENT:
          if (fields.accountNumber) formData.bankAccountNumber = fields.accountNumber.value;
          if (fields.bankName) formData.bankName = fields.bankName.value;
          if (fields.balance) formData.accountBalance = fields.balance.value;
          break;
      }
    }
  });
  
  return formData;
} 