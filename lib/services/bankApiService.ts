import axios from 'axios';

export interface LoanOffer {
  id: string;
  bankName: string;
  bankLogo: string;
  interestRate: number;
  monthlyPayment: number;
  totalAmount: number;
  term: number;
  processingFee: number;
  features: string[];
  conditions: string[];
  approvalTime: string;
}

export interface LoanApplicationData {
  personalInfo: {
    fullName: string;
    nric: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
  };
  financialInfo: {
    income: number;
    employment: string;
    existingLoans: number;
  };
  loanRequest: {
    amount: number;
    purpose: string;
    term: number;
  };
}

// API endpoints for different banks
const BANK_APIS = {
  DBS: process.env.NEXT_PUBLIC_DBS_API_URL || 'https://api.example.com/dbs',
  OCBC: process.env.NEXT_PUBLIC_OCBC_API_URL || 'https://api.example.com/ocbc',
  UOB: process.env.NEXT_PUBLIC_UOB_API_URL || 'https://api.example.com/uob',
};

/**
 * Generate loan offers from multiple banks
 */
export async function generateLoanOffers(applicationData: LoanApplicationData): Promise<LoanOffer[]> {
  try {
    // In a real implementation, this would send the application data to multiple bank APIs
    // For now, we'll simulate the response with mock data based on the application
    
    // Simulate API calls to different banks
    const offers = await Promise.all(
      Object.entries(BANK_APIS).map(async ([bankName, apiUrl]) => {
        try {
          // In production, this would be a real API call
          // const response = await axios.post(`${apiUrl}/loan-offers`, applicationData);
          // return response.data;
          
          // For now, return simulated data
          return simulateBankResponse(bankName, applicationData);
        } catch (error) {
          console.error(`Error getting offers from ${bankName}:`, error);
          return null;
        }
      })
    );
    
    // Filter out any failed requests
    return offers.filter(Boolean) as LoanOffer[];
  } catch (error) {
    console.error('Error generating loan offers:', error);
    throw new Error('Failed to generate loan offers');
  }
}

/**
 * Apply for a selected loan offer
 */
export async function applyForLoan(offerId: string, applicationData: LoanApplicationData): Promise<{
  applicationId: string;
  status: string;
  nextSteps: string[];
}> {
  try {
    // In a real implementation, this would submit the application to the specific bank
    // For now, we'll simulate the response
    
    // Simulate application submission
    // const selectedBank = offerId.split('-')[0];
    // const apiUrl = BANK_APIS[selectedBank as keyof typeof BANK_APIS];
    // const response = await axios.post(`${apiUrl}/apply`, { offerId, ...applicationData });
    // return response.data;
    
    return {
      applicationId: `APP-${Date.now()}-${offerId}`,
      status: 'PENDING_APPROVAL',
      nextSteps: [
        'Your application is being processed',
        'You will receive an update within 24 hours',
        'Prepare your supporting documents for verification'
      ]
    };
  } catch (error) {
    console.error('Error applying for loan:', error);
    throw new Error('Failed to submit loan application');
  }
}

/**
 * Get application status updates
 */
export async function getLoanApplicationStatus(applicationId: string): Promise<{
  status: string;
  updatedAt: string;
  nextSteps: string[];
}> {
  try {
    // In a real implementation, this would check the application status with the bank
    // For now, we'll simulate the response
    
    return {
      status: 'PENDING_APPROVAL',
      updatedAt: new Date().toISOString(),
      nextSteps: [
        'Your application is being processed',
        'You will receive an update within 24 hours',
        'Prepare your supporting documents for verification'
      ]
    };
  } catch (error) {
    console.error('Error getting application status:', error);
    throw new Error('Failed to get application status');
  }
}

// Helper function to simulate bank API responses
function simulateBankResponse(bankName: string, data: LoanApplicationData): LoanOffer {
  // Calculate a realistic interest rate based on the application data
  // This would normally be determined by the bank's risk assessment
  const baseRate = 3.5; // Base interest rate
  const incomeRateAdjustment = data.financialInfo.income > 5000 ? -0.5 : 0; // Better rates for higher income
  const loanAmountAdjustment = data.loanRequest.amount > 50000 ? 0.2 : 0; // Higher rates for larger loans
  const termAdjustment = data.loanRequest.term > 36 ? 0.3 : 0; // Higher rates for longer terms
  
  const interestRate = (baseRate + incomeRateAdjustment + loanAmountAdjustment + termAdjustment).toFixed(2);
  
  // Calculate monthly payment based on loan amount, term, and interest rate
  const principal = data.loanRequest.amount;
  const monthlyRate = parseFloat(interestRate) / 100 / 12;
  const months = data.loanRequest.term;
  const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  
  const bankDetails = {
    'DBS': {
      logo: '/images/bank-logos/dbs.png',
      processingFee: 1.5,
      features: ['Instant approval', 'Mobile app tracking', 'No early repayment fee'],
      approvalTime: '24 hours'
    },
    'OCBC': {
      logo: '/images/bank-logos/ocbc.png',
      processingFee: 2.0,
      features: ['Cash rebates', 'Flexible repayment options', 'Insurance bundle'],
      approvalTime: '48 hours'
    },
    'UOB': {
      logo: '/images/bank-logos/uob.png',
      processingFee: 1.0,
      features: ['Lower interest for UOB customers', 'Fee waiver for first-time applicants', 'Special merchant discounts'],
      approvalTime: '72 hours'
    }
  };
  
  const bank = bankDetails[bankName as keyof typeof bankDetails];
  
  return {
    id: `${bankName}-${Date.now()}`,
    bankName: bankName,
    bankLogo: bank.logo,
    interestRate: parseFloat(interestRate),
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalAmount: Math.round(monthlyPayment * months * 100) / 100,
    term: months,
    processingFee: bank.processingFee,
    features: bank.features,
    conditions: [
      `Minimum income: $${data.financialInfo.income > 4000 ? '3,000' : '4,000'} per month`,
      'Singapore citizen or PR',
      'Between 21 and 65 years old'
    ],
    approvalTime: bank.approvalTime
  };
} 