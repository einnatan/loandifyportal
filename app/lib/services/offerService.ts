/**
 * Service for handling loan offer API interactions
 */

// Type for user loan application data
export interface LoanApplicationData {
  fullName: string;
  email: string;
  phone: string;
  income: number;
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  creditScore?: number;
  additionalInfo?: string;
}

// Types for loan offers
export interface IndividualOffer {
  id: number;
  lender: string;
  logo: string;
  interestRate: number;
  effectiveInterestRate: number;
  monthlyInstallment: number;
  tenureMonths: number;
  maxLoanAmount: number;
  approved: boolean;
  processingFee: string;
  specialFeature: string;
}

export interface BundleOffer {
  id: number;
  name: string;
  lenders: string[];
  totalLoanAmount: number;
  averageInterestRate: number;
  effectiveInterestRate: number;
  monthlyInstallment: number;
  tenureMonths: number;
  processingFee: string;
  specialFeature: string;
}

export interface OfferResponse {
  individual: IndividualOffer[];
  bundles: BundleOffer[];
}

/**
 * Fetches loan offers from the API based on user application data
 */
export async function fetchLoanOffers(applicationData: LoanApplicationData): Promise<OfferResponse> {
  try {
    const response = await fetch('/api/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching loan offers:', error);
    throw error;
  }
}

/**
 * Schedule an appointment with a lender
 */
export async function scheduleAppointment(
  offerId: number, 
  isBundle: boolean, 
  date: Date, 
  time: string,
  userData: { name: string; email: string; phone: string }
) {
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offerId,
        isBundle,
        appointmentDate: date,
        appointmentTime: time,
        userData
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    throw error;
  }
} 