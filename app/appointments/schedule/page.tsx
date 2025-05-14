'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  getLenders, 
  getAvailableDays, 
  scheduleAppointment,
  Lender,
  AppointmentDay,
  TimeSlot 
} from '../../../lib/services/appointmentService'
import { getUserProfile } from '../../../lib/services/userProfileService'
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { AlertCircle, Calendar, Check, Clock, ArrowRight, ArrowLeft, ArrowDown } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert'

// Import from the offer-related code
interface LoanOfferDetail {
  id: string;
  lenderId: string;
  lenderName: string;
  lenderLogo: string;
  amount: number;
  interestRate: number;
  monthlyPayment: number;
  term: number;
  processingFee: number;
  totalInterest: number;
  features: string[];
  isPromoted: boolean;
}

// Bundle offer interface
interface BundleOffer {
  id: string;
  lenders: {
    id: string;
    lenderName: string;
    lenderLogo: string;
    amount: number;
    interestRate: number;
  }[];
  totalAmount: number;
  averageInterestRate: number;
  monthlyPayment: number;
  term: number;
  processingFee: number;
  totalInterest: number;
  features: string[];
}

// Mock data fetching functions - in a real app these would call an API
const getOfferById = (offerId: string): LoanOfferDetail | null => {
  // This is a simplified version. In a real app, you would fetch this from an API
  const individualOffers: LoanOfferDetail[] = [
    {
      id: 'offer1',
      lenderId: 'lender-001',
      lenderName: 'First Bank',
      lenderLogo: '/bank-logo-1.svg',
      amount: 15000,
      interestRate: 4.5,
      monthlyPayment: 445,
      term: 36,
      processingFee: 150,
      totalInterest: 1020,
      features: ['No early repayment fee', 'Instant approval', 'Fixed interest rate'],
      isPromoted: true
    },
    {
      id: 'offer2',
      lenderId: 'lender-002',
      lenderName: 'OCBC Bank',
      lenderLogo: '/bank-logo-2.svg',
      amount: 20000,
      interestRate: 4.8,
      monthlyPayment: 600,
      term: 60,
      processingFee: 100,
      totalInterest: 1580,
      features: ['No processing fee for existing customers', 'Fixed interest rate'],
      isPromoted: false
    },
    {
      id: 'offer3',
      lenderId: 'lender-003',
      lenderName: 'Unity Credit',
      lenderLogo: '/bank-logo-3.svg',
      amount: 15000,
      interestRate: 4.6,
      monthlyPayment: 447,
      term: 48,
      processingFee: 125,
      totalInterest: 1040,
      features: ['Mobile app tracking', 'Fixed interest rate', 'Flexible repayment options'],
      isPromoted: false
    },
    {
      id: 'offer4',
      lenderId: 'lender-004',
      lenderName: 'Global Loans',
      lenderLogo: '/bank-logo-4.svg',
      amount: 25000,
      interestRate: 4.3,
      monthlyPayment: 740,
      term: 24,
      processingFee: 175,
      totalInterest: 1580,
      features: ['Cash rebate after 12 months', 'No early repayment fee'],
      isPromoted: true
    },
    {
      id: 'offer5',
      lenderId: 'lender-005',
      lenderName: 'Apex Capital',
      lenderLogo: '/bank-logo-5.svg',
      amount: 18000,
      interestRate: 4.7,
      monthlyPayment: 520,
      term: 42,
      processingFee: 100,
      totalInterest: 1060,
      features: ['Loyalty rewards', 'Interest-free period available'],
      isPromoted: false
    },
  ];
  
  return individualOffers.find(offer => offer.id === offerId) || null;
};

// Mock data fetching function for bundle offers
const getBundleById = (bundleId: string): BundleOffer | null => {
  // This is a simplified version. In a real app, you would fetch this from an API
  const bundleOffers: BundleOffer[] = [
    {
      id: 'bundle1',
      lenders: [
        {
          id: 'lender-001',
          lenderName: 'First Bank',
          lenderLogo: '/bank-logo-1.svg',
          amount: 15000,
          interestRate: 4.5
        },
        {
          id: 'lender-004',
          lenderName: 'Global Loans',
          lenderLogo: '/bank-logo-4.svg',
          amount: 10000,
          interestRate: 4.3
        }
      ],
      totalAmount: 25000,
      averageInterestRate: 4.4,
      monthlyPayment: 736,
      term: 36,
      processingFee: 250,
      totalInterest: 1550,
      features: ['Single monthly payment', 'Combined application', 'Lower average interest rate']
    },
    {
      id: 'bundle2',
      lenders: [
        {
          id: 'lender-002',
          lenderName: 'Metro Finance',
          lenderLogo: '/bank-logo-2.svg',
          amount: 20000,
          interestRate: 4.8
        },
        {
          id: 'lender-005',
          lenderName: 'Apex Capital',
          lenderLogo: '/bank-logo-5.svg',
          amount: 15000,
          interestRate: 4.7
        }
      ],
      totalAmount: 35000,
      averageInterestRate: 4.75,
      monthlyPayment: 1050,
      term: 48,
      processingFee: 300,
      totalInterest: 2400,
      features: ['Higher combined loan amount', 'Simplified documentation', 'Single credit check']
    }
  ];
  
  return bundleOffers.find(bundle => bundle.id === bundleId) || null;
};

export default function ScheduleAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const offerParam = searchParams.get('offer')
  const bundleParam = searchParams.get('bundle')
  
  const [step, setStep] = useState(1)
  const [lenders, setLenders] = useState<Lender[]>([])
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null)
  const [availableDays, setAvailableDays] = useState<AppointmentDay[]>([])
  const [selectedDay, setSelectedDay] = useState<AppointmentDay | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'video' | 'phone'>('in-person')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // States for handling offers and bundles
  const [offer, setOffer] = useState<LoanOfferDetail | null>(null)
  const [bundle, setBundle] = useState<BundleOffer | null>(null)
  const [scheduledAppointments, setScheduledAppointments] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedLenders, setSelectedLenders] = useState<{[lenderId: string]: Lender}>({})
  const [lenderDays, setLenderDays] = useState<{[lenderId: string]: AppointmentDay[]}>({})
  const [lenderSelectedDays, setLenderSelectedDays] = useState<{[lenderId: string]: AppointmentDay | null}>({})
  const [lenderSelectedTimeSlots, setLenderSelectedTimeSlots] = useState<{[lenderId: string]: TimeSlot | null}>({})
  
  // Fetch offer details on mount
  useEffect(() => {
    // Get all lenders first
    const lendersList = getLenders()
    setLenders(lendersList)
    
    if (offerParam) {
      const offerDetails = getOfferById(offerParam)
      if (offerDetails) {
        setOffer(offerDetails)
        
        // For individual offers, automatically select the lender
        if (offerDetails.lenderId) {
          const matchingLender = lendersList.find(l => l.id === offerDetails.lenderId)
          if (matchingLender) {
            setSelectedLender(matchingLender)
          }
        }
      }
    } else if (bundleParam) {
      const bundleDetails = getBundleById(bundleParam)
      if (bundleDetails) {
        setBundle(bundleDetails)
        
        // For bundle offers, we need to track multiple lenders
        const lenderMap: {[lenderId: string]: Lender} = {}
        
        // Find matching lenders for each lender in the bundle
        bundleDetails.lenders.forEach(bundleLender => {
          const matchingLender = lendersList.find(l => l.id === bundleLender.id)
          if (matchingLender) {
            lenderMap[matchingLender.id] = matchingLender
          }
        })
        
        setSelectedLenders(lenderMap)
        
        // Initialize lender days and selected values
        const lenderDaysMap: {[lenderId: string]: AppointmentDay[]} = {}
        const selectedDaysMap: {[lenderId: string]: AppointmentDay | null} = {}
        const selectedTimeSlotsMap: {[lenderId: string]: TimeSlot | null} = {}
        
        // Pre-load availability data for each lender
        Object.keys(lenderMap).forEach(lenderId => {
          // Get availability days for this lender
          const lenderAvailabilityDays = getAvailableDays(lenderId)
          lenderDaysMap[lenderId] = lenderAvailabilityDays
          selectedDaysMap[lenderId] = null
          selectedTimeSlotsMap[lenderId] = null
        })
        
        // Set all lender-related data simultaneously to avoid render issues
        setLenderDays(lenderDaysMap)
        setLenderSelectedDays(selectedDaysMap)
        setLenderSelectedTimeSlots(selectedTimeSlotsMap)
      }
    }
  }, [offerParam, bundleParam])
  
  // Fetch available days when lender is selected
  useEffect(() => {
    if (selectedLender) {
      const days = getAvailableDays(selectedLender.id);
      setAvailableDays(days);
    }
  }, [selectedLender])
  
  const handleLenderSelect = (lender: Lender) => {
    setSelectedLender(lender)
  }
  
  const handleDaySelect = (day: AppointmentDay) => {
    setSelectedDay(day)
  }
  
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot)
  }
  
  const handleAppointmentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'in-person' | 'video' | 'phone'
    setAppointmentType(value)
  }
  
  const handleScheduleAppointment = async () => {
    const userProfile = getUserProfile()
    setIsSubmitting(true)
    
    try {
      // For individual offers
      if (offer && selectedLender && selectedDay && selectedTimeSlot) {
        // Create appointment
        const appointmentResult = scheduleAppointment({
          customerId: userProfile.id,
          lenderId: selectedLender.id,
          date: selectedDay.date,
          startTime: selectedTimeSlot.startTime,
          endTime: selectedTimeSlot.endTime,
          type: appointmentType,
          notes: notes || `Appointment for loan offer`
        })
        
        if (appointmentResult) {
          setScheduledAppointments([...scheduledAppointments, appointmentResult.id])
          setShowConfirmation(true)
        }
      } 
      // For bundle offers
      else if (bundle) {
        const lenderIds = Object.keys(selectedLenders)
        const appointmentIds: string[] = []
        let allAppointmentsScheduled = true
        
        // Schedule an appointment for each lender in the bundle
        for (const lenderId of lenderIds) {
          const lenderSelectedDay = lenderSelectedDays[lenderId]
          const lenderSelectedTimeSlot = lenderSelectedTimeSlots[lenderId]
          
          if (lenderSelectedDay && lenderSelectedTimeSlot) {
            try {
              const appointmentResult = scheduleAppointment({
                customerId: userProfile.id,
                lenderId: lenderId,
                date: lenderSelectedDay.date,
                startTime: lenderSelectedTimeSlot.startTime,
                endTime: lenderSelectedTimeSlot.endTime,
                type: appointmentType,
                notes: notes || `Appointment for bundled loan offer: ${bundle.id}`
              })
              
              if (appointmentResult) {
                appointmentIds.push(appointmentResult.id)
              } else {
                allAppointmentsScheduled = false
              }
            } catch (error) {
              console.error(`Error scheduling appointment for lender ${lenderId}:`, error)
              allAppointmentsScheduled = false
            }
          } else {
            allAppointmentsScheduled = false
          }
        }
        
        if (allAppointmentsScheduled && appointmentIds.length === lenderIds.length) {
          setScheduledAppointments([...scheduledAppointments, ...appointmentIds])
          setShowConfirmation(true)
        } else {
          // Some appointments failed to schedule
          setIsSubmitting(false)
        }
      } else {
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      setIsSubmitting(false)
    }
  }
  
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  
  const goToDetails = () => {
    if (selectedDay && selectedTimeSlot) {
      setStep(2)
    }
  }
  
  const goToAppointments = () => {
    router.push('/appointments')
  }
  
  const getAppointmentSchedulingTitle = () => {
    if (offer) {
      return 'Schedule Appointment for Your Loan'
    } else if (bundle) {
      return 'Schedule Appointments for Your Bundled Loan'
    } else {
      return 'Schedule an Appointment'
    }
  }
  
  // Show confirmation page after successful scheduling
  if (showConfirmation) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Appointment Scheduled!</CardTitle>
              <CardDescription>
                {bundle ? "Your bundled loan appointments have been successfully scheduled." : "Your appointment has been successfully scheduled."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Individual offer appointment details */}
              {!bundle && selectedLender && selectedDay && selectedTimeSlot && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-medium mb-3 text-blue-700">Appointment Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-28 text-sm font-medium text-gray-600">Lender:</div>
                      <div className="flex-1 font-medium">{selectedLender.name}</div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-28 text-sm font-medium text-gray-600">Address:</div>
                      <div className="flex-1">{selectedLender.address}</div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-28 text-sm font-medium text-gray-600">Date:</div>
                      <div className="flex-1">{selectedDay.dayName}, {selectedDay.dateLabel}</div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-28 text-sm font-medium text-gray-600">Time:</div>
                      <div className="flex-1">{selectedTimeSlot.startTime}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Bundle offer appointment details */}
              {bundle && (
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <h3 className="font-medium text-blue-700">Bundled Loan Appointments</h3>
                    <div className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {Object.keys(selectedLenders).length} Lenders
                    </div>
                  </div>
                  
                  {Object.entries(selectedLenders).map(([lenderId, lender], index) => {
                    const lenderDay = lenderSelectedDays[lenderId];
                    const lenderTimeSlot = lenderSelectedTimeSlots[lenderId];
                    
                    if (lenderDay && lenderTimeSlot) {
                      return (
                        <div key={lenderId} className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                          <div className="flex items-center pb-2 mb-2 border-b border-blue-100">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1 shadow-sm border border-blue-100 mr-2">
                              <div className="text-blue-800 text-xs font-bold">{index + 1}</div>
                            </div>
                            <div className="font-medium text-blue-800">{lender.name}</div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <div className="w-28 text-sm font-medium text-gray-600">Address:</div>
                              <div className="flex-1">{lender.address}</div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="w-28 text-sm font-medium text-gray-600">Date:</div>
                              <div className="flex-1">{lenderDay.dayName}, {lenderDay.dateLabel}</div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="w-28 text-sm font-medium text-gray-600">Time:</div>
                              <div className="flex-1">{lenderTimeSlot.startTime}</div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h4 className="font-medium mb-2 text-blue-700">Important Information:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>You will receive a WhatsApp message with the appointment details.</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Kindly bring your original documents to the appointment.</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Please ensure that you have a valid Singpass login.</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Thank you.</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/dashboard')}
                >
                  Back to Dashboard
                </Button>
                
                <Button 
                  className="flex-1 bg-blue-600"
                  onClick={() => router.push('/appointments')}
                >
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{getAppointmentSchedulingTitle()}</h1>
        <p className="text-gray-600">
          {bundle 
            ? "Book meetings with loan officers from each lender in your bundle" 
            : "Book a meeting with a loan officer to discuss your loan application"}
        </p>
      </div>
      
      {/* Display individual offer details if available */}
      {offer && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-t-lg p-4 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-white">
              Your Selected Loan Offer
            </h2>
          </div>
          
          <Card className="border-4 border-t-0 border-blue-200 rounded-t-none rounded-b-lg shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b-2 border-blue-100 pb-4">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center p-2 shadow-md border-2 border-blue-100 mx-auto sm:mx-0">
                    <img 
                      src={offer.lenderLogo || `/bank-logos/${offer.lenderName.toLowerCase().replace(/\s+/g, '-')}.svg`} 
                      alt={offer.lenderName}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => (e.currentTarget.src = '/bank-logo-default.svg')}
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="font-bold text-2xl text-gray-900">{offer.lenderName}</h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="text-gray-700 text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-100 font-medium">Individual Loan Offer</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Loan Amount</p>
                    <p className="font-bold text-2xl text-gray-900">${offer.amount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Interest rate</p>
                    <p className="font-bold text-2xl text-gray-900">{offer.interestRate}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Term</p>
                    <p className="font-bold text-2xl text-gray-900">{offer.term} months</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Monthly payment</p>
                    <p className="font-bold text-2xl text-gray-900">${offer.monthlyPayment}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Processing fee</p>
                    <p className="font-bold text-2xl text-gray-900">${offer.processingFee}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Total interest</p>
                    <p className="font-bold text-2xl text-gray-900">${offer.totalInterest.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Display bundle offer details if available */}
      {bundle && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-t-lg p-4 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-white">
              Your Selected Bundled Loan Offer
            </h2>
          </div>
          
          <Card className="border-4 border-t-0 border-blue-200 rounded-t-none rounded-b-lg shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b-2 border-blue-100 pb-4">
                  <div className="flex gap-2 mx-auto sm:mx-0">
                    {bundle.lenders.map((lender, index) => (
                      <div key={index} className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2 shadow-md border-2 border-blue-100">
                        <img 
                          src={lender.lenderLogo || `/bank-logos/${lender.lenderName.toLowerCase().replace(/\s+/g, '-')}.svg`} 
                          alt={lender.lenderName}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => (e.currentTarget.src = '/bank-logo-default.svg')}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="font-bold text-2xl text-gray-900">{bundle.lenders.map(l => l.lenderName).join(' + ')}</h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="text-gray-700 text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-100 font-medium">Bundled Loan Offer</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Total Loan Amount</p>
                    <p className="font-bold text-2xl text-gray-900">${bundle.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Avg. Interest rate</p>
                    <p className="font-bold text-2xl text-gray-900">{bundle.averageInterestRate}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Term</p>
                    <p className="font-bold text-2xl text-gray-900">{bundle.term} months</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Monthly payment</p>
                    <p className="font-bold text-2xl text-gray-900">${bundle.monthlyPayment}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Processing fee</p>
                    <p className="font-bold text-2xl text-gray-900">${bundle.processingFee}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-semibold">Total interest</p>
                    <p className="font-bold text-2xl text-gray-900">${bundle.totalInterest.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-bold text-lg text-blue-700 mb-3">Bundle Features</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {bundle.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Step 1: Select Date and Time for Bundle Offers */}
      {step === 1 && bundle && (
        <div>
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold">Schedule Appointments For Your Bundle</h2>
            <div className="ml-2 rounded bg-yellow-100 px-2 py-1 text-sm text-yellow-800">
              Select a date and time for both lenders
            </div>
          </div>

          {/* Fixed Bank 1 Section */}
          {bundle.lenders[0] && (
            <div className="mb-12">
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-t-lg p-4 relative overflow-hidden">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-white text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
                    1
                  </span>
                  First Appointment: {bundle.lenders[0].lenderName}
                </h2>
              </div>
              
              <div className="border-2 border-t-0 border-blue-300 rounded-b-lg p-6 bg-white shadow-md space-y-8">
                <div className="flex items-center border-b border-blue-100 pb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm border border-blue-200 mr-3">
                    <img 
                      src={bundle.lenders[0].lenderLogo || `/bank-logos/${bundle.lenders[0].lenderName.toLowerCase().replace(/\s+/g, '-')}.svg`}
                      alt={bundle.lenders[0].lenderName}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => (e.currentTarget.src = '/bank-logo-default.svg')}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-blue-800">{bundle.lenders[0].lenderName}</div>
                    <div className="text-sm text-blue-600">Loan amount: ${bundle.lenders[0].amount.toLocaleString()}</div>
                  </div>
                </div>

                {/* Date Selection Section */}
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2 flex items-center bg-blue-100 p-2 rounded-md">
                      <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                      <span className="text-blue-800">Select Date</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Choose a day for your appointment with {bundle.lenders[0].lenderName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {Object.keys(selectedLenders).length > 0 && 
                      Object.entries(selectedLenders)[0] && 
                      lenderDays[Object.entries(selectedLenders)[0][0]] && 
                      lenderDays[Object.entries(selectedLenders)[0][0]].map((day: AppointmentDay) => {
                        const lenderId = Object.entries(selectedLenders)[0][0];
                        return (
                          <Card
                            key={day.date}
                            className={`cursor-pointer transition-all hover:border-primary/80 ${
                              lenderSelectedDays[lenderId]?.date === day.date 
                                ? 'bg-blue-600 border-blue-600 shadow-md' 
                                : 'border border-gray-200 hover:shadow-sm'
                            }`}
                            onClick={() => {
                              const updatedDays = {
                                ...lenderSelectedDays,
                                [lenderId]: day
                              };
                              setLenderSelectedDays(updatedDays);
                            }}
                          >
                            <CardHeader className="p-3 flex flex-col items-center space-y-0">
                              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${
                                lenderSelectedDays[lenderId]?.date === day.date ? 'bg-white text-blue-600' : 'bg-gray-100'
                              }`}>
                                <span className="text-sm font-medium">{day.dateLabel.split(' ')[0]}</span>
                              </div>
                              <CardTitle className={`text-sm ${lenderSelectedDays[lenderId]?.date === day.date ? 'text-white' : ''}`}>
                                {day.dayName}
                              </CardTitle>
                              <CardDescription className={lenderSelectedDays[lenderId]?.date === day.date ? 'text-white/80' : ''}>
                                {day.dateLabel.split(' ')[1]}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        );
                    })}
                  </div>
                </div>
                
                {/* Time Selection Section */}
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2 flex items-center bg-blue-100 p-2 rounded-md">
                      <Clock className="mr-2 h-5 w-5 text-blue-600" />
                      <span className="text-blue-800">Select Time</span>
                      {Object.keys(selectedLenders).length > 0 && 
                       Object.entries(selectedLenders)[0] && 
                       lenderSelectedDays[Object.entries(selectedLenders)[0][0]] && (
                        <span className="ml-2 text-sm bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                          {lenderSelectedDays[Object.entries(selectedLenders)[0][0]]?.dayName}, {' '}
                          {lenderSelectedDays[Object.entries(selectedLenders)[0][0]]?.dateLabel}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Choose a time for your appointment with {bundle.lenders[0].lenderName}</p>
                  </div>
                  
                  {Object.keys(selectedLenders).length > 0 && 
                   Object.entries(selectedLenders)[0] && 
                   lenderSelectedDays[Object.entries(selectedLenders)[0][0]] ? (
                    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {lenderSelectedDays[Object.entries(selectedLenders)[0][0]]?.timeSlots.map((timeSlot) => {
                          const lenderId = Object.entries(selectedLenders)[0][0];
                          return (
                            <Button
                              key={timeSlot.id}
                              variant={lenderSelectedTimeSlots[lenderId]?.id === timeSlot.id ? 'default' : 'outline'}
                              disabled={!timeSlot.available}
                              onClick={() => {
                                if (timeSlot.available) {
                                  const updatedTimeSlots = {
                                    ...lenderSelectedTimeSlots,
                                    [lenderId]: timeSlot
                                  };
                                  setLenderSelectedTimeSlots(updatedTimeSlots);
                                }
                              }}
                              className={`h-auto py-2 ${!timeSlot.available ? 'opacity-40 line-through' : ''} 
                                          ${lenderSelectedTimeSlots[lenderId]?.id === timeSlot.id ? 'bg-blue-600 text-white ring-2 ring-blue-300' : ''}`}
                            >
                              {timeSlot.startTime}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <Calendar className="h-10 w-10 mx-auto text-blue-300 mb-3" />
                      <p className="text-gray-500 font-medium mb-1">Please select a date first</p>
                      <p className="text-sm text-gray-400">Choose a date to view available time slots</p>
                    </div>
                  )}
                </div>
                
                {/* Status indicator for this lender */}
                <div className="pt-4">
                  {Object.keys(selectedLenders).length > 0 && 
                   Object.entries(selectedLenders)[0] && 
                   lenderSelectedDays[Object.entries(selectedLenders)[0][0]] && 
                   lenderSelectedTimeSlots[Object.entries(selectedLenders)[0][0]] ? (
                    <div className="flex items-start bg-green-50 border border-green-100 rounded-md p-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-green-800">Appointment selected</div>
                        <div className="text-sm text-green-700">
                          {bundle.lenders[0].lenderName}: {lenderSelectedDays[Object.entries(selectedLenders)[0][0]]?.dayName}, {' '}
                          {lenderSelectedDays[Object.entries(selectedLenders)[0][0]]?.dateLabel} at {' '}
                          {lenderSelectedTimeSlots[Object.entries(selectedLenders)[0][0]]?.startTime}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start bg-amber-50 border border-amber-100 rounded-md p-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-amber-800">Please complete your selection</div>
                        <div className="text-sm text-amber-700">Select both date and time for your appointment with {bundle.lenders[0].lenderName}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">Then</span>
            </div>
          </div>

          {/* Fixed Bank 2 Section */}
          {bundle.lenders[1] && (
            <div className="mb-12">
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-t-lg p-4 relative overflow-hidden">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-white text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
                    2
                  </span>
                  Second Appointment: {bundle.lenders[1].lenderName}
                </h2>
              </div>
              
              <div className="border-2 border-t-0 border-blue-300 rounded-b-lg p-6 bg-white shadow-md space-y-8">
                <div className="flex items-center border-b border-blue-100 pb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm border border-blue-200 mr-3">
                    <img 
                      src={bundle.lenders[1].lenderLogo || `/bank-logos/${bundle.lenders[1].lenderName.toLowerCase().replace(/\s+/g, '-')}.svg`}
                      alt={bundle.lenders[1].lenderName}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => (e.currentTarget.src = '/bank-logo-default.svg')}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-blue-800">{bundle.lenders[1].lenderName}</div>
                    <div className="text-sm text-blue-600">Loan amount: ${bundle.lenders[1].amount.toLocaleString()}</div>
                  </div>
                </div>

                {/* Date Selection Section */}
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2 flex items-center bg-blue-100 p-2 rounded-md">
                      <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                      <span className="text-blue-800">Select Date</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Choose a day for your appointment with {bundle.lenders[1].lenderName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {Object.keys(selectedLenders).length > 1 && 
                      Object.entries(selectedLenders)[1] && 
                      lenderDays[Object.entries(selectedLenders)[1][0]] &&
                      lenderDays[Object.entries(selectedLenders)[1][0]].map((day: AppointmentDay) => {
                        const lenderId = Object.entries(selectedLenders)[1][0];
                        return (
                          <Card
                            key={day.date}
                            className={`cursor-pointer transition-all hover:border-primary/80 ${
                              lenderSelectedDays[lenderId]?.date === day.date 
                                ? 'bg-blue-600 border-blue-600 shadow-md' 
                                : 'border border-gray-200 hover:shadow-sm'
                            }`}
                            onClick={() => {
                              const updatedDays = {
                                ...lenderSelectedDays,
                                [lenderId]: day
                              };
                              setLenderSelectedDays(updatedDays);
                            }}
                          >
                            <CardHeader className="p-3 flex flex-col items-center space-y-0">
                              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${
                                lenderSelectedDays[lenderId]?.date === day.date ? 'bg-white text-blue-600' : 'bg-gray-100'
                              }`}>
                                <span className="text-sm font-medium">{day.dateLabel.split(' ')[0]}</span>
                              </div>
                              <CardTitle className={`text-sm ${lenderSelectedDays[lenderId]?.date === day.date ? 'text-white' : ''}`}>
                                {day.dayName}
                              </CardTitle>
                              <CardDescription className={lenderSelectedDays[lenderId]?.date === day.date ? 'text-white/80' : ''}>
                                {day.dateLabel.split(' ')[1]}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        );
                    })}
                  </div>
                </div>
                
                {/* Time Selection Section */}
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2 flex items-center bg-blue-100 p-2 rounded-md">
                      <Clock className="mr-2 h-5 w-5 text-blue-600" />
                      <span className="text-blue-800">Select Time</span>
                      {Object.keys(selectedLenders).length > 1 && 
                       Object.entries(selectedLenders)[1] && 
                       lenderSelectedDays[Object.entries(selectedLenders)[1][0]] && (
                        <span className="ml-2 text-sm bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                          {lenderSelectedDays[Object.entries(selectedLenders)[1][0]]?.dayName}, {' '}
                          {lenderSelectedDays[Object.entries(selectedLenders)[1][0]]?.dateLabel}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Choose a time for your appointment with {bundle.lenders[1].lenderName}</p>
                  </div>
                  
                  {Object.keys(selectedLenders).length > 1 && 
                   Object.entries(selectedLenders)[1] && 
                   lenderSelectedDays[Object.entries(selectedLenders)[1][0]] ? (
                    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {lenderSelectedDays[Object.entries(selectedLenders)[1][0]]?.timeSlots.map((timeSlot) => {
                          const lenderId = Object.entries(selectedLenders)[1][0];
                          return (
                            <Button
                              key={timeSlot.id}
                              variant={lenderSelectedTimeSlots[lenderId]?.id === timeSlot.id ? 'default' : 'outline'}
                              disabled={!timeSlot.available}
                              onClick={() => {
                                if (timeSlot.available) {
                                  const updatedTimeSlots = {
                                    ...lenderSelectedTimeSlots,
                                    [lenderId]: timeSlot
                                  };
                                  setLenderSelectedTimeSlots(updatedTimeSlots);
                                }
                              }}
                              className={`h-auto py-2 ${!timeSlot.available ? 'opacity-40 line-through' : ''} 
                                          ${lenderSelectedTimeSlots[lenderId]?.id === timeSlot.id ? 'bg-blue-600 text-white ring-2 ring-blue-300' : ''}`}
                            >
                              {timeSlot.startTime}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <Calendar className="h-10 w-10 mx-auto text-blue-300 mb-3" />
                      <p className="text-gray-500 font-medium mb-1">Please select a date first</p>
                      <p className="text-sm text-gray-400">Choose a date to view available time slots</p>
                    </div>
                  )}
                </div>
                
                {/* Status indicator for this lender */}
                <div className="pt-4">
                  {Object.keys(selectedLenders).length > 1 && 
                   Object.entries(selectedLenders)[1] && 
                   lenderSelectedDays[Object.entries(selectedLenders)[1][0]] && 
                   lenderSelectedTimeSlots[Object.entries(selectedLenders)[1][0]] ? (
                    <div className="flex items-start bg-green-50 border border-green-100 rounded-md p-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-green-800">Appointment selected</div>
                        <div className="text-sm text-green-700">
                          {bundle.lenders[1].lenderName}: {lenderSelectedDays[Object.entries(selectedLenders)[1][0]]?.dayName}, {' '}
                          {lenderSelectedDays[Object.entries(selectedLenders)[1][0]]?.dateLabel} at {' '}
                          {lenderSelectedTimeSlots[Object.entries(selectedLenders)[1][0]]?.startTime}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start bg-amber-50 border border-amber-100 rounded-md p-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-amber-800">Please complete your selection</div>
                        <div className="text-sm text-amber-700">Select both date and time for your appointment with {bundle.lenders[1].lenderName}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleScheduleAppointment} 
              disabled={!Object.entries(lenderSelectedDays).every(([_, day]) => day !== null) || 
                       !Object.entries(lenderSelectedTimeSlots).every(([_, slot]) => slot !== null) || 
                       isSubmitting}
              className="px-8 py-6 text-lg font-medium bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  Confirm All Appointments
                  <Check className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      
      {/* Individual offer date and time selection */}
      {step === 1 && !bundle && offer && (
        <div>
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold">Select Date & Time</h2>
          </div>
          
          {/* Date Selection Section - Now vertically stacked */}
          <div className="space-y-8">
            {/* Date Selection Section */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Select a Date
                </h3>
                <p className="text-sm text-gray-500 mb-4">Choose your preferred day for the appointment</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {availableDays.map((day: AppointmentDay) => (
                  <Card
                    key={day.date}
                    className={`cursor-pointer transition-all hover:border-primary/80 ${
                      selectedDay?.date === day.date 
                        ? 'bg-blue-600 border-blue-600 shadow-md' 
                        : 'border border-gray-200 hover:shadow-sm'
                    }`}
                    onClick={() => handleDaySelect(day)}
                  >
                    <CardHeader className="p-3 flex flex-col items-center space-y-0">
                      <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${
                        selectedDay?.date === day.date ? 'bg-white text-blue-600' : 'bg-gray-100'
                      }`}>
                        <span className="text-sm font-medium">{day.dateLabel.split(' ')[0]}</span>
                      </div>
                      <CardTitle className={`text-sm ${selectedDay?.date === day.date ? 'text-white' : ''}`}>
                        {day.dayName}
                      </CardTitle>
                      <CardDescription className={selectedDay?.date === day.date ? 'text-white/80' : ''}>
                        {day.dateLabel.split(' ')[1]}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Time Selection Section */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Select a Time {selectedDay && `for ${selectedDay.dayName}, ${selectedDay.dateLabel}`}
                </h3>
                <p className="text-sm text-gray-500 mb-4">Choose a convenient time slot for your meeting</p>
              </div>
              
              {selectedDay ? (
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {selectedDay.timeSlots.map((timeSlot) => (
                      <Button
                        key={timeSlot.id}
                        variant={selectedTimeSlot?.id === timeSlot.id ? 'default' : 'outline'}
                        disabled={!timeSlot.available}
                        onClick={() => timeSlot.available && handleTimeSlotSelect(timeSlot)}
                        className={`h-auto py-2 ${!timeSlot.available ? 'opacity-40 line-through' : ''} 
                                    ${selectedTimeSlot?.id === timeSlot.id ? 'bg-blue-600 text-white ring-2 ring-blue-300' : ''}`}
                      >
                        {timeSlot.startTime}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 font-medium mb-1">Please select a date first</p>
                  <p className="text-sm text-gray-400">Choose a date from above to view available time slots</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleScheduleAppointment} 
              disabled={!selectedDay || !selectedTimeSlot || isSubmitting}
              className="px-8 py-6 text-lg font-medium bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  Confirm Appointment
                  <Check className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 