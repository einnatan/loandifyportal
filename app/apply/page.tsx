'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SingpassLogin } from '../components/SingpassLogin'
import { validateField, validateLoanApplication, debounceValidation } from '../../lib/validation'
import { DocumentUploader } from '../components/DocumentUploader'
import { ProcessedDocument, DocumentType } from '../../lib/services/ocrService'
import { parseSingpassToken, retrieveMyInfoData, mapMyInfoToFormData } from '../../lib/utils/singpassHelpers'
import { Label } from '../components/ui/label'
import { ChevronLeft, ChevronRight, CheckCircle2, FileText, Upload, Edit3, Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '../components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '../../lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'

// Mock formatted MyInfo data - this would come from Singpass in a real app
const defaultUserData = {
  fullName: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  address: {
    block: "",
    street: "",
    unit: "",
    postal: "",
    country: ""
  },
  housingType: "",
  hdbType: "",
  occupation: "",
  employmentStatus: "",
  income: {
    monthly: 0,
    annual: 0
  },
  cpf: {
    oa: 0,
    sa: 0,
    ma: 0,
    total: 0
  }
};

// Mock sample data for when Singpass is not used
const sampleUserData = {
  fullName: "Lauren Tan",
  gender: "Female",
  dob: "1990-05-10",
  email: "lauren.tan@example.com",
  phone: "+65 9123 4567",
  address: {
    block: "123",
    street: "Orchard Road",
    unit: "#12-34",
    postal: "238883",
    country: "Singapore"
  },
  housingType: "HDB",
  hdbType: "4-Room",
  occupation: "Software Engineer",
  employmentStatus: "Employed",
  income: {
    monthly: 5500,
    annual: 66000
  },
  cpf: {
    oa: 25000,
    sa: 10000,
    ma: 8000,
    total: 43000
  }
};

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<ProcessedDocument[]>([])
  const [usingSingpass, setUsingSingpass] = useState(false)
  const [userData, setUserData] = useState(defaultUserData)
  const [loadingSingpass, setLoadingSingpass] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isValidatingField, setIsValidatingField] = useState<Record<string, boolean>>({})
  const [isFormFilled, setIsFormFilled] = useState(false)
  const [singpassError, setSingpassError] = useState<string | null>(null)
  const [singpassData, setSingpassData] = useState<Record<string, any> | null>(null)
  const [loanAmount, setLoanAmount] = useState<number>(10000)
  const [loanTerm, setLoanTerm] = useState<number>(36)
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
  
  const searchParams = useSearchParams()
  
  // Get loan details from URL parameters (when coming from homepage)
  useEffect(() => {
    const amountParam = searchParams.get('amount');
    const termParam = searchParams.get('term');
    
    if (amountParam) {
      const parsedAmount = parseInt(amountParam, 10);
      if (!isNaN(parsedAmount)) {
        setLoanAmount(parsedAmount);
      }
    }
    
    if (termParam) {
      const parsedTerm = parseInt(termParam, 10);
      if (!isNaN(parsedTerm)) {
        setLoanTerm(parsedTerm);
      }
    }
  }, [searchParams]);
  
  // Debug effect to log when step changes
  useEffect(() => {
    console.log('Step state changed to:', step);
  }, [step]);
  
  // Check for Singpass callback
  useEffect(() => {
    const singpassStatus = searchParams.get('singpass');
    
    if (singpassStatus === 'success') {
      setLoadingSingpass(true);
      
      // Simulate fetching the user data after Singpass authentication
      setTimeout(() => {
        // In a real app, this data would come from session storage or a back-end API
        // where it was stored during the Singpass callback
        setUserData(sampleUserData);
        setUsingSingpass(true);
        setLoadingSingpass(false);
      }, 1500);
    } else if (singpassStatus === 'error') {
      // Handle Singpass error
      alert('Failed to fetch information from Singpass. Please try again or fill in manually.');
    }
  }, [searchParams]);
  
  useEffect(() => {
    // Check if there's a Singpass token in the URL
    const token = searchParams.get('singpass_token');
    if (token) {
      try {
        // Parse the token
        const parsedToken = parseSingpassToken(token);
        if (parsedToken) {
          // Retrieve the data using the token
          const userData = retrieveMyInfoData(parsedToken);
          
          // Map the MyInfo data to form data
          const formData = mapMyInfoToFormData(userData);
          
          // Set the data in state for form pre-filling
          setSingpassData(formData);
          setIsFormFilled(true);
        }
      } catch (error) {
        console.error('Error processing Singpass token:', error);
        setSingpassError('Failed to process Singpass data');
      }
    }
    
    // Check for error
    const error = searchParams.get('error');
    if (error === 'singpass_auth_failed') {
      setSingpassError('Singpass authentication failed');
    }
  }, [searchParams]);
  
  // Sync dateOfBirth with userData.dob
  useEffect(() => {
    if (dateOfBirth) {
      setUserData(prev => ({
        ...prev,
        dob: format(dateOfBirth, 'yyyy-MM-dd')
      }));
    }
  }, [dateOfBirth]);
  
  // Update dateOfBirth when userData.dob changes
  useEffect(() => {
    if (userData.dob && typeof userData.dob === 'string') {
      try {
        const date = new Date(userData.dob);
        if (!isNaN(date.getTime())) {
          setDateOfBirth(date);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
  }, [userData.dob]);
  
  const nextStep = () => {
    console.log('Next step button clicked. Current step:', step);
    
    // TEMPORARY: Skip validation to allow easy navigation through all steps
    if (step < 4) {
      const newStep = step + 1;
      console.log('Setting step to:', newStep);
      setStep(newStep);
      window.scrollTo(0, 0);
      console.log('Step should now be:', newStep);
    } else if (step === 4) {
      // Form completed
      console.log('Navigating to /offers');
      window.location.href = '/offers';
    }
    
    // Original validation code (commented out temporarily)
    /*
    if (step === 1) {
      // Validate personal information before proceeding
      const validationErrors = validateLoanApplication(userData);
      setErrors(validationErrors);
      
      // Mark all fields as touched
      const newTouched: Record<string, boolean> = {};
      Object.keys(validationErrors).forEach(key => {
        newTouched[key] = true;
      });
      setTouched({...touched, ...newTouched});
      
      if (Object.keys(validationErrors).length > 0) {
        // Scroll to the first error
        const firstErrorField = document.querySelector('[aria-invalid="true"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }
    
    if (step === 2) {
      // Validate uploaded documents
      if (uploadedDocs.length < 2) {
        alert('Please upload all required documents before proceeding.');
        return;
      }
    }
    
    if (step < 4) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else if (step === 4) {
      // Form completed
      window.location.href = '/offers'
    }
    */
  }
  
  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }
  
  const handleDocumentUpload = (document: ProcessedDocument) => {
    // Remove any existing document of the same type
    const filteredDocs = uploadedDocs.filter(doc => doc.documentType !== document.documentType);
    // Add the new document
    setUploadedDocs([...filteredDocs, document]);
  }
  
  const handleDocumentDataExtracted = (data: Record<string, any>) => {
    // Merge the extracted data with the existing user data
    if (Object.keys(data).length > 0) {
      setUserData(prevData => {
        const newUserData = { ...prevData } as typeof prevData & Record<string, any>;
        
        // Handle nested properties
        for (const key in data) {
          if (typeof data[key] === 'object' && data[key] !== null) {
            if (key in newUserData) {
              newUserData[key] = {
                ...(newUserData[key as keyof typeof newUserData] || {}),
                ...data[key]
              };
            } else {
              (newUserData as Record<string, any>)[key] = data[key];
            }
          } else {
            (newUserData as Record<string, any>)[key] = data[key];
          }
        }
        
        return newUserData;
      });
    }
  }
  
  const getRequiredDocumentCount = () => {
    // Count documents with required flag set to true
    return 2; // NRIC and Income are required
  }
  
  const hasRequiredDocuments = () => {
    // Check if all required document types are uploaded
    const uploadedTypes = uploadedDocs.map(doc => doc.documentType);
    return uploadedTypes.includes(DocumentType.IC) && 
           (uploadedTypes.includes(DocumentType.PROOF_OF_INCOME) || 
            uploadedTypes.includes(DocumentType.CPF_STATEMENT) || 
            uploadedTypes.includes(DocumentType.BANK_STATEMENT));
  }
  
  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      nextStep()
    }, 2000)
  }
  
  const getProgressValue = () => (step / 4) * 100
  
  // Fill form with sample data (non-Singpass flow)
  const fillFormWithSampleData = () => {
    setUserData(sampleUserData);
  };
  
  // Handle field change
  const handleFieldChange = (field: string, value: any) => {
    // Special case for date of birth
    if (field === 'dob') {
      setDateOfBirth(value);
      return;
    }
    
    // Update the user data
    if (field.includes('.')) {
      // Handle nested fields (like address.postal)
      const [parent, child] = field.split('.');
      setUserData(prev => {
        const updatedData = { ...prev };
        
        // Ensure the parent object exists
        if (!updatedData[parent as keyof typeof prev]) {
          (updatedData as any)[parent] = {};
        }
        
        // Update the nested field
        const parentObj = updatedData[parent as keyof typeof prev];
        if (typeof parentObj === 'object' && parentObj !== null) {
          (parentObj as any)[child] = value;
        }
        
        return updatedData;
      });
    } else {
      // Handle top-level fields
      setUserData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Indicate field is being validated
    setIsValidatingField(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Perform debounced validation
    debounceValidation(field, value, (validatedField, result) => {
      // Update validation state
      setIsValidatingField(prev => ({
        ...prev,
        [validatedField]: false
      }));
      
      // Update errors
      setErrors(prev => ({
        ...prev,
        [validatedField]: result.isValid ? '' : result.errorMessage
      }));
    });
  }
  
  const handleDocumentProcessed = (data: any) => {
    console.log('Document data:', data);
    // In a real application, this would update the form with the data
    setIsFormFilled(true);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gradient-primary text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Loan Application</h2>
              <span className="text-sm">Step {step} of 4</span>
            </div>
            <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-300 ease-in-out" 
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-4">
              <StepIndicator 
                number={1} 
                title="Personal Information" 
                isActive={step === 1} 
                isCompleted={step > 1} 
              />
              <StepIndicator 
                number={2} 
                title="Document Upload" 
                isActive={step === 2} 
                isCompleted={step > 2} 
              />
              <StepIndicator 
                number={3} 
                title="Review & Submit" 
                isActive={step === 3} 
                isCompleted={step > 3} 
              />
              <StepIndicator 
                number={4} 
                title="Submission Summary" 
                isActive={step === 4} 
                isCompleted={step > 4} 
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {step === 1 && <PersonalInformationStep loanAmount={loanAmount} loanTerm={loanTerm} dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth} />}
            {step === 2 && <DocumentUploadStep />}
            {step === 3 && <ReviewAndSubmitStep setStep={setStep} />}
            {step === 4 && <SubmissionSummaryStep />}
          </div>

          {/* Navigation Buttons */}
          <div className="p-6 bg-gradient-primary border-t border-white/20 flex justify-between">
            {step > 1 ? (
              <button
                onClick={previousStep}
                className="px-4 py-2 flex items-center gap-2 rounded bg-white text-[#2563eb] border border-white hover:bg-white/90"
              >
                <ChevronLeft size={16} /> Previous
              </button>
            ) : (
              <div>{/* Empty div to maintain the justify-between spacing */}</div>
            )}
            
            {step < 4 ? (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  console.log('Next button clicked directly');
                  nextStep();
                }}
                className="px-6 py-3 bg-white text-[#2563eb] rounded-lg text-lg font-medium flex items-center gap-2 hover:bg-white/90 shadow-md"
              >
                Next <ChevronRight size={20} />
              </button>
            ) : (
              <Link
                href="/offers"
                className="px-6 py-3 bg-white text-[#2563eb] rounded-lg text-lg font-medium flex items-center gap-2 hover:bg-white/90 shadow-md"
              >
                View Offers <ChevronRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepIndicator({ 
  number, 
  title, 
  isActive, 
  isCompleted 
}: { 
  number: number; 
  title: string; 
  isActive: boolean; 
  isCompleted: boolean 
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div 
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${
          isActive 
            ? 'bg-white text-[#2563eb]' 
            : isCompleted 
              ? 'bg-green-500 text-white' 
              : 'bg-[#2563eb]/30 text-white/80'
        }`}
      >
        {isCompleted ? <CheckCircle2 size={16} /> : number}
      </div>
      <span className={`text-xs ${isActive ? 'text-white font-medium' : 'text-white/80'}`}>
        {title}
      </span>
    </div>
  )
}

const PersonalInformationStep = ({ 
  loanAmount, 
  loanTerm,
  dateOfBirth,
  setDateOfBirth
}: { 
  loanAmount: number; 
  loanTerm: number;
  dateOfBirth: Date | undefined;
  setDateOfBirth: (date: Date | undefined) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Singpass Integration - Prominently displayed at the top */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Quick Application with Singpass</h4>
            <p className="text-sm text-gray-500 mt-1">
              Pre-fill your application form and skip document upload
            </p>
          </div>
          <button className="px-4 py-2 bg-gradient-primary text-white rounded-md font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2">
            <img src="/singpass-logo.svg" alt="Singpass" className="h-5 w-5" />
            Retrieve MyInfo
          </button>
        </div>
        <div className="text-xs text-gray-500">
          By using Singpass, you consent to the retrieval of your personal data to pre-fill this application.
        </div>
      </div>

      {/* Loan Details Section */}
      <div className="p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Loan Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                defaultValue={loanAmount.toLocaleString()}
                className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
                placeholder="Enter loan amount"
                data-lpignore="true"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Tenure
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  defaultValue={loanTerm}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
                  placeholder="Months"
                  data-lpignore="true"
                />
                <span className="ml-2 text-gray-500">months</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Purpose
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
                data-lpignore="true"
              >
                <option value="" className="text-gray-400">Select a purpose</option>
                <option value="debt_consolidation">Debt Consolidation</option>
                <option value="home_renovation">Home Renovation</option>
                <option value="wedding">Wedding Expenses</option>
                <option value="education">Education</option>
                <option value="medical">Medical Expenses</option>
                <option value="travel">Travel</option>
                <option value="car">Car Purchase</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
              placeholder="Your first name"
              data-lpignore="true"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
              placeholder="Your last name"
              data-lpignore="true"
            />
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-500 placeholder:text-gray-400 cursor-pointer"
                    placeholder="YYYY-MM-DD"
                    value={dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : ''}
                    readOnly
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="start">
                {(() => {
                  // Create state for currently displayed month/year
                  const [calendarDate, setCalendarDate] = React.useState<Date>(
                    dateOfBirth || new Date(new Date().getFullYear() - 30, 0, 1)
                  );
                  
                  // Update calendar view month/year without selecting a date
                  const updateCalendarView = (year: number, month: number) => {
                    const newDate = new Date(calendarDate);
                    newDate.setFullYear(year);
                    newDate.setMonth(month);
                    setCalendarDate(newDate);
                  };
                  
                  return (
                    <>
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <select 
                            value={calendarDate.getMonth()}
                            onChange={(e) => {
                              const month = parseInt(e.target.value);
                              updateCalendarView(calendarDate.getFullYear(), month);
                            }}
                            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                          >
                            <option value={0}>January</option>
                            <option value={1}>February</option>
                            <option value={2}>March</option>
                            <option value={3}>April</option>
                            <option value={4}>May</option>
                            <option value={5}>June</option>
                            <option value={6}>July</option>
                            <option value={7}>August</option>
                            <option value={8}>September</option>
                            <option value={9}>October</option>
                            <option value={10}>November</option>
                            <option value={11}>December</option>
                          </select>
                          <select 
                            value={calendarDate.getFullYear()}
                            onChange={(e) => {
                              const year = parseInt(e.target.value);
                              updateCalendarView(year, calendarDate.getMonth());
                            }}
                            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                          >
                            {Array.from({ length: 100 }, (_, i) => {
                              const year = new Date().getFullYear() - 18 - i;
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={setDateOfBirth}
                        defaultMonth={calendarDate}
                        month={calendarDate}
                        onMonthChange={setCalendarDate}
                        disabled={(date) => 
                          // Disable future dates and dates less than 18 years ago
                          date > new Date() || 
                          date > new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                        }
                        initialFocus
                        classNames={{
                          day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
                          day_today: "bg-gray-100 text-gray-900",
                        }}
                      />
                    </>
                  );
                })()}
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500 mt-1">You must be at least 18 years old to apply</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Residency Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select status</option>
              <option value="citizen">Singapore Citizen</option>
              <option value="pr">Singapore PR</option>
              <option value="foreigner_work_pass">Foreigner with Work Pass</option>
              <option value="foreigner_dependent_pass">Foreigner with Dependent Pass</option>
              <option value="foreigner_other">Foreigner - Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select nationality</option>
              <option value="sg">Singaporean</option>
              <option value="my">Malaysian</option>
              <option value="in">Indian</option>
              <option value="cn">Chinese</option>
              <option value="ph">Filipino</option>
              <option value="id">Indonesian</option>
              <option value="th">Thai</option>
              <option value="vn">Vietnamese</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NRIC/FIN No.
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
              placeholder="S1234567A"
              data-lpignore="true"
            />
            <p className="text-xs text-gray-500 mt-1">Format: S1234567A or G1234567A</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marital Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
              placeholder="your.email@example.com"
              data-lpignore="true"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
              placeholder="Your phone number"
              data-lpignore="true"
            />
          </div>
        </div>
      
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary mb-2 text-gray-400 placeholder:text-gray-400"
            placeholder="Street address"
            data-lpignore="true"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
              placeholder="City"
              data-lpignore="true"
            />
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
              placeholder="Postal code"
              data-lpignore="true"
            />
          </div>
        </div>
      </div>

      {/* Housing Details Section */}
      <div className="p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Housing Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Housing
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select housing type</option>
              <option value="hdb_1_2">HDB 1-2 Room</option>
              <option value="hdb_3">HDB 3 Room</option>
              <option value="hdb_4">HDB 4 Room</option>
              <option value="hdb_5">HDB 5 Room</option>
              <option value="hdb_executive">HDB Executive</option>
              <option value="condo">Condominium</option>
              <option value="landed">Landed Property</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Housing Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select status</option>
              <option value="owned_fully_paid">Owned - Fully Paid</option>
              <option value="owned_mortgaged">Owned - With Mortgage</option>
              <option value="rented">Rented</option>
              <option value="living_with_parents">Living with Parents</option>
              <option value="employer_provided">Employer Provided</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length of Stay
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select length</option>
              <option value="less_than_1">Less than 1 year</option>
              <option value="1_to_3">1 - 3 years</option>
              <option value="3_to_5">3 - 5 years</option>
              <option value="5_to_10">5 - 10 years</option>
              <option value="more_than_10">More than 10 years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Do you own a property?
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employment Details Section */}
      <div className="p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Employment Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select status</option>
              <option value="employed_full_time">Employed Full-Time</option>
              <option value="employed_part_time">Employed Part-Time</option>
              <option value="self_employed">Self-Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
              <option value="homemaker">Homemaker</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select job title</option>
              <option value="executive">Executive</option>
              <option value="manager">Manager</option>
              <option value="senior_manager">Senior Manager</option>
              <option value="director">Director</option>
              <option value="vp">Vice President</option>
              <option value="professional">Professional</option>
              <option value="admin">Administrative</option>
              <option value="technical">Technical</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Industry
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select industry</option>
              <option value="banking">Banking & Finance</option>
              <option value="technology">Information Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="government">Government</option>
              <option value="education">Education</option>
              <option value="hospitality">Hospitality & Tourism</option>
              <option value="construction">Construction</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length with Current Employer
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
              data-lpignore="true"
            >
              <option value="" className="text-gray-400">Select length</option>
              <option value="less_than_1">Less than 1 year</option>
              <option value="1_to_3">1 - 3 years</option>
              <option value="3_to_5">3 - 5 years</option>
              <option value="5_to_10">5 - 10 years</option>
              <option value="more_than_10">More than 10 years</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Length with Previous Employer
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
            data-lpignore="true"
          >
            <option value="" className="text-gray-400">Select length</option>
            <option value="none">None</option>
            <option value="less_than_1">Less than 1 year</option>
            <option value="1_to_3">1 - 3 years</option>
            <option value="3_to_5">3 - 5 years</option>
            <option value="5_to_10">5 - 10 years</option>
            <option value="more_than_10">More than 10 years</option>
          </select>
        </div>
      </div>

      {/* Income Details Section */}
      <div className="p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Income Details</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
              placeholder="Your monthly income"
              data-lpignore="true"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Income (if any)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
              placeholder="Any additional monthly income"
              data-lpignore="true"
            />
          </div>
        </div>
      </div>

      {/* Existing Financial Commitments Section */}
      <div className="p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Existing Financial Commitments</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Do you have any existing debts?
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
            id="existing-debts"
            data-lpignore="true"
            onChange={(e) => {
              const expandedFields = document.getElementById('debt-details');
              if (expandedFields) {
                expandedFields.style.display = e.target.value === 'yes' ? 'block' : 'none';
              }
            }}
          >
            <option value="" className="text-gray-400">Select answer</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div id="debt-details" style={{ display: 'none' }} className="mt-4 space-y-4 bg-gray-50 p-4 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing Loans Outstanding (Banks)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
                placeholder="Amount of outstanding bank loans"
                data-lpignore="true"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing Loans Outstanding (Moneylender)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-400 placeholder:text-gray-400"
                placeholder="Amount of outstanding moneylender loans"
                data-lpignore="true"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Are you currently an undischarged bankrupt or undergoing any form of debt restructuring?
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
            data-lpignore="true"
          >
            <option value="" className="text-gray-400">Select answer</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Are you talking to an agency or intermediary regarding bankruptcy or debt restructuring service?
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-400"
            data-lpignore="true"
          >
            <option value="" className="text-gray-400">Select answer</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}

function DocumentUploadStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-4">Document Upload</h3>
        <p className="text-gray-600 mb-8">
          Please upload the following documents to support your loan application.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h4 className="text-lg font-medium mb-2">Identification Document</h4>
          <p className="text-sm text-gray-500 mb-4">
            National ID, Passport, or Driver's License
          </p>
          <label className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Upload ID
            <input type="file" className="hidden" />
          </label>
        </div>
        
        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h4 className="text-lg font-medium mb-2">Proof of Income</h4>
          <p className="text-sm text-gray-500 mb-4">
            Latest 3 months of payslips or bank statements
          </p>
          <label className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Upload Income Proof
            <input type="file" className="hidden" multiple />
          </label>
        </div>
        
        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h4 className="text-lg font-medium mb-2">Additional Documents (Optional)</h4>
          <p className="text-sm text-gray-500 mb-4">
            Any other supporting documents for your application
          </p>
          <label className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Upload Other Documents
            <input type="file" className="hidden" multiple />
          </label>
        </div>
      </div>
    </motion.div>
  )
}

function ReviewAndSubmitStep({ setStep }: { setStep: (step: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
        <p className="text-gray-600 mb-8">
          Please review your information before submitting your application.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Loan Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-medium">Loan Details</h4>
            <button 
              onClick={() => {
                setStep(1);
                window.scrollTo(0, 0);
              }} 
              className="text-primary flex items-center text-sm hover:underline hover:bg-primary/10 p-1 rounded-md transition-colors"
            >
              <Edit3 size={14} className="mr-1" /> Edit
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Loan Amount</p>
              <p className="font-medium">$20,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loan Term</p>
              <p className="font-medium">36 months</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loan Purpose</p>
              <p className="font-medium">Home Renovation</p>
            </div>
          </div>
        </div>
        
        {/* Personal Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-medium">Personal Information</h4>
            <button 
              onClick={() => {
                setStep(1);
                window.scrollTo(0, 0);
              }} 
              className="text-primary flex items-center text-sm hover:underline hover:bg-primary/10 p-1 rounded-md transition-colors"
            >
              <Edit3 size={14} className="mr-1" /> Edit
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-medium">John</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-medium">Smith</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">01/01/1980</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Residency Status</p>
              <p className="font-medium">Singapore Citizen</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium">Singaporean</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">NRIC/FIN No.</p>
              <p className="font-medium">S1234567A</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Marital Status</p>
              <p className="font-medium">Single</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">john.smith@example.com</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">+65 9123 4567</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">123 Main St, Singapore 123456</p>
            </div>
          </div>
        </div>
        
        {/* Housing Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-medium">Housing Details</h4>
            <button 
              onClick={() => {
                setStep(1);
                window.scrollTo(0, 0);
              }} 
              className="text-primary flex items-center text-sm hover:underline hover:bg-primary/10 p-1 rounded-md transition-colors"
            >
              <Edit3 size={14} className="mr-1" /> Edit
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Type of Housing</p>
              <p className="font-medium">HDB 4 Room</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Residential Status</p>
              <p className="font-medium">Owner</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Length of Stay</p>
              <p className="font-medium">3 - 5 years</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Property Ownership</p>
              <p className="font-medium">Yes</p>
            </div>
          </div>
        </div>
        
        {/* Employment Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-medium">Employment Details</h4>
            <button 
              onClick={() => {
                setStep(1);
                window.scrollTo(0, 0);
              }} 
              className="text-primary flex items-center text-sm hover:underline hover:bg-primary/10 p-1 rounded-md transition-colors"
            >
              <Edit3 size={14} className="mr-1" /> Edit
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Employment Status</p>
              <p className="font-medium">Employed Full-Time</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="font-medium">Manager</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Industry</p>
              <p className="font-medium">Banking & Finance</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Length with Current Employer</p>
              <p className="font-medium">3 - 5 years</p>
            </div>
          </div>
        </div>
        
        {/* Income Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-medium">Income Details</h4>
            <button 
              onClick={() => {
                setStep(1);
                window.scrollTo(0, 0);
              }} 
              className="text-primary flex items-center text-sm hover:underline hover:bg-primary/10 p-1 rounded-md transition-colors"
            >
              <Edit3 size={14} className="mr-1" /> Edit
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Monthly Income</p>
              <p className="font-medium">$5,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Additional Income</p>
              <p className="font-medium">$1,000</p>
            </div>
          </div>
        </div>
        
        {/* Financial Commitments Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-medium">Financial Commitments</h4>
            <button 
              onClick={() => {
                setStep(1);
                window.scrollTo(0, 0);
              }} 
              className="text-primary flex items-center text-sm hover:underline hover:bg-primary/10 p-1 rounded-md transition-colors"
            >
              <Edit3 size={14} className="mr-1" /> Edit
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Existing Debts</p>
              <p className="font-medium">Yes</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bank Loans Outstanding</p>
              <p className="font-medium">$10,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Moneylender Loans Outstanding</p>
              <p className="font-medium">$0</p>
            </div>
          </div>
        </div>
        
        {/* Documents Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-medium">Documents</h4>
            <button 
              onClick={() => {
                setStep(2);
                window.scrollTo(0, 0);
              }} 
              className="text-primary flex items-center text-sm hover:underline hover:bg-primary/10 p-1 rounded-md transition-colors"
            >
              <Edit3 size={14} className="mr-1" /> Edit
            </button>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText size={16} className="text-gray-400 mr-2" />
                <span>ID_Document.jpg</span>
              </div>
              <span className="text-green-500 text-sm">Uploaded</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText size={16} className="text-gray-400 mr-2" />
                <span>Payslip_January.pdf</span>
              </div>
              <span className="text-green-500 text-sm">Uploaded</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText size={16} className="text-gray-400 mr-2" />
                <span>Payslip_February.pdf</span>
              </div>
              <span className="text-green-500 text-sm">Uploaded</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the Terms and Conditions
              </label>
              <p className="text-gray-500">
                By checking this box, you agree to our <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="marketing"
                name="marketing"
                type="checkbox"
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="marketing" className="font-medium text-gray-700">
                Receive marketing communications
              </label>
              <p className="text-gray-500">
                We'll send you updates about your application and offers from our partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SubmissionSummaryStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 text-center"
    >
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-green-700 mb-2">Application Submitted!</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Your loan application has been successfully submitted. We'll review your information and provide personalized offers soon.
        </p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-left mb-6 max-w-md mx-auto">
        <h4 className="font-semibold mb-4 text-center">Application Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Application ID:</span>
            <span className="font-medium">LN-2023-45678</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Submission Date:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="font-medium text-orange-500">Under Review</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Time:</span>
            <span className="font-medium">24-48 hours</span>
          </div>
        </div>
      </div>
      
      <div>
        <p className="text-gray-600 mb-6">
          What happens next? We'll review your application and provide personalized loan offers from our lending partners. You'll be notified by email when your offers are ready.
        </p>
      </div>
    </motion.div>
  )
} 