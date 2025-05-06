import { UserProfile } from '../types/user';
import { LoanOffer } from '../types/loans';

// Mock user financial data for analysis
export interface UserFinancialData {
  income: number;
  expenses: number;
  existingDebt: number;
  creditScore: number;
  employmentStatus: 'full-time' | 'part-time' | 'self-employed' | 'unemployed';
  employmentDuration: number; // in months
  savingsAmount: number;
  loanPurpose: string;
  previousLoanHistory: {
    onTimePayments: number;
    missedPayments: number;
    totalLoans: number;
  };
}

// AI recommendation factors and weights
const RECOMMENDATION_FACTORS = {
  AFFORDABILITY: 0.3,
  INTEREST_RATE: 0.25,
  CREDIT_MATCH: 0.2,
  TERM_OPTIMIZATION: 0.15,
  PURPOSE_MATCH: 0.1,
};

// Calculate user's debt-to-income ratio
function calculateDTI(income: number, expenses: number, existingDebt: number, newLoanMonthlyPayment: number): number {
  const monthlyIncome = income / 12;
  const monthlyExpenses = expenses / 12;
  const monthlyDebtPayments = existingDebt / 12;
  
  return (monthlyExpenses + monthlyDebtPayments + newLoanMonthlyPayment) / monthlyIncome;
}

// Calculate affordability score based on DTI ratio
function calculateAffordabilityScore(dti: number): number {
  // Lower DTI is better
  if (dti < 0.2) return 1.0;
  if (dti < 0.3) return 0.9;
  if (dti < 0.4) return 0.7;
  if (dti < 0.5) return 0.4;
  if (dti < 0.6) return 0.2;
  return 0.0;
}

// Calculate interest rate score - lower is better
function calculateInterestRateScore(interestRate: number): number {
  // Scale from highest to lowest expected interest rate
  const maxRate = 20;
  const minRate = 2; 
  return Math.max(0, Math.min(1, (maxRate - interestRate) / (maxRate - minRate)));
}

// Calculate credit match score
function calculateCreditMatchScore(userCreditScore: number, recommendedMinScore: number): number {
  const buffer = 50; // Provide some buffer for near-matches
  
  if (userCreditScore >= recommendedMinScore + buffer) return 1.0;
  if (userCreditScore >= recommendedMinScore) return 0.9;
  if (userCreditScore >= recommendedMinScore - buffer) return 0.6;
  if (userCreditScore >= recommendedMinScore - (buffer * 2)) return 0.3;
  return 0.1;
}

// Calculate term optimization score
function calculateTermScore(
  loanTerm: number, 
  userFinancialData: UserFinancialData
): number {
  // Short term is better for those with stable finances
  // Long term is better for those with tight budgets
  const financialStability = (
    userFinancialData.income / 
    (userFinancialData.expenses + userFinancialData.existingDebt)
  );
  
  // If financially stable, prefer shorter terms
  if (financialStability > 3) {
    return 1 - (loanTerm / 60); // 5 year max term
  }
  // If moderately stable, medium terms
  else if (financialStability > 1.5) {
    return loanTerm <= 36 ? 0.8 : (60 - loanTerm) / 24;
  }
  // If tight finances, longer terms for lower payments
  else {
    return loanTerm >= 48 ? 0.9 : loanTerm / 60;
  }
}

// Calculate purpose match score
function calculatePurposeMatchScore(userPurpose: string, loanType: string): number {
  const purposeMapping: {[key: string]: string[]} = {
    'home renovation': ['home improvement', 'renovation', 'home', 'property'],
    'education': ['education', 'student', 'tuition', 'school'],
    'debt consolidation': ['debt consolidation', 'consolidation', 'refinance'],
    'medical': ['medical', 'healthcare', 'hospital', 'treatment'],
    'wedding': ['wedding', 'marriage', 'celebration'],
    'vacation': ['vacation', 'travel', 'holiday'],
    'car': ['car', 'vehicle', 'auto', 'automobile']
  };
  
  const normalizedUserPurpose = userPurpose.toLowerCase();
  const normalizedLoanType = loanType.toLowerCase();
  
  // Direct match
  if (normalizedUserPurpose === normalizedLoanType) return 1.0;
  
  // Check if purpose maps to loan type
  for (const [purpose, keywords] of Object.entries(purposeMapping)) {
    if (normalizedUserPurpose.includes(purpose)) {
      if (keywords.some(keyword => normalizedLoanType.includes(keyword))) {
        return 0.9;
      }
    }
  }
  
  // No match, but general personal loan still applicable
  if (normalizedLoanType.includes('personal')) return 0.7;
  
  return 0.5; // Default match score
}

// Calculate aggregate recommendation score
function calculateRecommendationScore(
  offer: LoanOffer,
  userFinancialData: UserFinancialData
): number {
  // Calculate monthly payment (simplified)
  const r = offer.interestRate / 100 / 12;
  const n = offer.termMonths;
  const monthlyPayment = (offer.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  
  // Calculate individual scores
  const dti = calculateDTI(
    userFinancialData.income, 
    userFinancialData.expenses, 
    userFinancialData.existingDebt,
    monthlyPayment
  );
  
  const affordabilityScore = calculateAffordabilityScore(dti);
  const interestRateScore = calculateInterestRateScore(offer.interestRate);
  const creditMatchScore = calculateCreditMatchScore(
    userFinancialData.creditScore, 
    offer.minimumCreditScore || 650
  );
  const termScore = calculateTermScore(offer.termMonths, userFinancialData);
  const purposeMatchScore = calculatePurposeMatchScore(
    userFinancialData.loanPurpose,
    offer.type || 'personal'
  );
  
  // Calculate weighted aggregate score
  return (
    affordabilityScore * RECOMMENDATION_FACTORS.AFFORDABILITY +
    interestRateScore * RECOMMENDATION_FACTORS.INTEREST_RATE +
    creditMatchScore * RECOMMENDATION_FACTORS.CREDIT_MATCH +
    termScore * RECOMMENDATION_FACTORS.TERM_OPTIMIZATION +
    purposeMatchScore * RECOMMENDATION_FACTORS.PURPOSE_MATCH
  );
}

// Get mock financial data for a user
export function getUserFinancialData(userId: string): UserFinancialData {
  // In a real app, this would come from a database or API
  return {
    income: 75000,
    expenses: 25000,
    existingDebt: 10000,
    creditScore: 720,
    employmentStatus: 'full-time',
    employmentDuration: 36,
    savingsAmount: 15000,
    loanPurpose: 'home renovation',
    previousLoanHistory: {
      onTimePayments: 24,
      missedPayments: 1,
      totalLoans: 2
    }
  };
}

// Generate AI-powered loan recommendations
export async function getAIRecommendations(
  userId: string,
  availableOffers: LoanOffer[]
): Promise<{
  recommendations: LoanOffer[];
  topPick: LoanOffer | null;
  reasonings: { [offerId: string]: string };
}> {
  // Get user data for analysis
  const userFinancialData = getUserFinancialData(userId);
  
  // Calculate scores for each offer
  const scoredOffers = availableOffers.map(offer => ({
    offer,
    score: calculateRecommendationScore(offer, userFinancialData)
  }));
  
  // Sort by score (descending)
  scoredOffers.sort((a, b) => b.score - a.score);
  
  // Generate personalized reasonings
  const reasonings: { [offerId: string]: string } = {};
  
  scoredOffers.forEach(({ offer, score }) => {
    const dti = calculateDTI(
      userFinancialData.income,
      userFinancialData.expenses,
      userFinancialData.existingDebt,
      offer.monthlyPayment
    );
    
    // Create reasoning based on top factors
    if (score > 0.8) {
      reasonings[offer.id] = `Excellent match: This offer aligns perfectly with your financial profile and loan purpose.`;
    } else if (score > 0.6) {
      reasonings[offer.id] = `Good match: This offer provides balanced terms that fit your income level and credit profile.`;
    } else if (score > 0.4) {
      reasonings[offer.id] = `Fair match: This offer may work for you, but there are better options available for your situation.`;
    } else {
      reasonings[offer.id] = `Poor match: This offer may strain your finances or has terms that don't align well with your needs.`;
    }
    
    // Add specifics about the factors
    if (calculateAffordabilityScore(dti) > 0.7) {
      reasonings[offer.id] += ` The monthly payment is comfortably within your budget.`;
    }
    
    if (calculateInterestRateScore(offer.interestRate) > 0.7) {
      reasonings[offer.id] += ` This offer has a favorable interest rate compared to alternatives.`;
    }
    
    if (userFinancialData.loanPurpose && calculatePurposeMatchScore(userFinancialData.loanPurpose, offer.type || 'personal') > 0.7) {
      reasonings[offer.id] += ` This loan type is specifically designed for ${userFinancialData.loanPurpose}.`;
    }
  });
  
  // Return recommended offers and reasonings
  return {
    recommendations: scoredOffers.map(item => item.offer),
    topPick: scoredOffers.length > 0 ? scoredOffers[0].offer : null,
    reasonings
  };
} 