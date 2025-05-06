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
import { AlertCircle, Calendar, Check, Clock, ArrowRight, ArrowLeft } from 'lucide-react'
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

export default function ScheduleAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const offerParam = searchParams.get('offer')
  
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
  const [scheduledAppointments, setScheduledAppointments] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  
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
    }
  }, [offerParam])
  
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
    if (!selectedLender || !selectedDay || !selectedTimeSlot) {
      return
    }
    
    const userProfile = getUserProfile()
    setIsSubmitting(true)
    
    try {
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
                Your appointment has been successfully scheduled.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Add appointment details here */}
              {selectedLender && selectedDay && selectedTimeSlot && (
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
                </div>
              )}
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
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
          Book a meeting with a loan officer to discuss your loan application
        </p>
      </div>
      
      {/* Display offer details if available - MORE VISUALLY PROMINENT */}
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
      
      {/* Step 1: Select Date and Time (combined) */}
      {step === 1 && (
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