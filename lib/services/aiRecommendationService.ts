import { UserProfile } from '../types/user';
import { LoanOffer } from '../types/loan';

// Types for AI recommendation functionality
export interface RecommendationCriteria {
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  monthlyIncome: number;
  creditScore: number;
  existingLoans: number;
  age: number;
  preferredTerm?: number;
  preferredInterestRate?: number;
  userPreferences?: {
    prioritizeLowInterest?: boolean;
    prioritizeLongTerm?: boolean;
    prioritizeLowMonthlyPayment?: boolean;
    preferredBanks?: string[];
  };
}

export interface LoanRecommendation {
  offerId: string;
  score: number;
  matchReason: string[];
  isPersonalized: boolean;
}

/**
 * AI-powered loan recommendation service
 * Uses a scoring algorithm that weighs various factors to find the best loan offers for a user
 */
export class AIRecommendationService {
  
  /**
   * Calculate a match score between the user criteria and a loan offer
   * Higher score indicates better match
   */
  private static calculateMatchScore(
    criteria: RecommendationCriteria,
    offer: LoanOffer
  ): number {
    let score = 0;
    
    // Base score: how well the requested amount matches the offer amount
    const amountDifference = Math.abs(criteria.loanAmount - offer.amount);
    const amountMatchPercentage = 1 - (amountDifference / criteria.loanAmount);
    score += amountMatchPercentage * 30; // Amount match is worth 30 points
    
    // Interest rate score (lower is better)
    // We compare to average interest rate of 5%
    const interestRateScore = Math.max(0, 20 - (offer.interestRate - 5) * 10);
    score += interestRateScore;
    
    // Term match score
    if (criteria.preferredTerm && offer.term) {
      const termDifference = Math.abs(criteria.preferredTerm - offer.term);
      const termMatchPercentage = 1 - (termDifference / criteria.preferredTerm);
      score += termMatchPercentage * 15; // Term match is worth 15 points
    }
    
    // Affordability score based on monthly income
    // Monthly payment should be less than 30% of monthly income for a good score
    const affordabilityRatio = offer.monthlyPayment / criteria.monthlyIncome;
    if (affordabilityRatio <= 0.3) {
      score += 15;
    } else if (affordabilityRatio <= 0.4) {
      score += 7;
    }
    
    // Credit score match
    if (criteria.creditScore >= offer.minimumCreditScore) {
      score += 10;
    }
    
    // Apply user preferences if available
    if (criteria.userPreferences) {
      // Prioritize low interest
      if (criteria.userPreferences.prioritizeLowInterest && offer.interestRate < 4) {
        score += 10;
      }
      
      // Prioritize long term
      if (criteria.userPreferences.prioritizeLongTerm && offer.term > 36) {
        score += 10;
      }
      
      // Prioritize low monthly payment
      if (criteria.userPreferences.prioritizeLowMonthlyPayment && 
          (offer.monthlyPayment / criteria.monthlyIncome) < 0.2) {
        score += 10;
      }
      
      // Preferred banks
      if (criteria.userPreferences.preferredBanks?.includes(offer.bankName)) {
        score += 10;
      }
    }
    
    return Math.min(100, score); // Cap score at 100
  }
  
  /**
   * Generate match reasons for why a loan offer was recommended
   */
  private static generateMatchReasons(
    criteria: RecommendationCriteria,
    offer: LoanOffer,
    score: number
  ): string[] {
    const reasons: string[] = [];
    
    // Amount match reason
    if (Math.abs(criteria.loanAmount - offer.amount) / criteria.loanAmount < 0.1) {
      reasons.push(`Matches your requested loan amount of $${criteria.loanAmount.toLocaleString()}`);
    }
    
    // Interest rate reason
    if (offer.interestRate < 5) {
      reasons.push(`Low interest rate of ${offer.interestRate.toFixed(2)}%`);
    }
    
    // Term match reason
    if (criteria.preferredTerm && Math.abs(criteria.preferredTerm - offer.term) / criteria.preferredTerm < 0.2) {
      reasons.push(`Loan term aligns with your preference of ${criteria.preferredTerm} months`);
    }
    
    // Affordability reason
    const affordabilityRatio = offer.monthlyPayment / criteria.monthlyIncome;
    if (affordabilityRatio <= 0.2) {
      reasons.push(`Monthly payment is well within your budget (less than 20% of income)`);
    } else if (affordabilityRatio <= 0.3) {
      reasons.push(`Monthly payment fits your budget (less than 30% of income)`);
    }
    
    // Bank preference reason
    if (criteria.userPreferences?.preferredBanks?.includes(offer.bankName)) {
      reasons.push(`From your preferred bank: ${offer.bankName}`);
    }
    
    // High score reason
    if (score > 80) {
      reasons.push('Excellent overall match for your profile');
    }
    
    return reasons;
  }
  
  /**
   * Get personalized loan recommendations based on user criteria
   */
  public static getRecommendations(
    criteria: RecommendationCriteria,
    availableOffers: LoanOffer[]
  ): LoanRecommendation[] {
    // Calculate scores for each offer
    const scoredOffers = availableOffers.map(offer => {
      const score = this.calculateMatchScore(criteria, offer);
      return {
        offerId: offer.id,
        score,
        matchReason: this.generateMatchReasons(criteria, offer, score),
        isPersonalized: true
      };
    });
    
    // Sort by score (highest first)
    return scoredOffers.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Extract recommendation criteria from user profile
   */
  public static extractCriteriaFromProfile(
    profile: UserProfile,
    loanAmount: number,
    loanPurpose: string,
    userPreferences?: RecommendationCriteria['userPreferences']
  ): RecommendationCriteria {
    return {
      loanAmount,
      loanPurpose,
      employmentStatus: profile.employmentStatus,
      monthlyIncome: profile.income.monthly,
      creditScore: profile.creditScore,
      existingLoans: profile.loans?.length || 0,
      age: this.calculateAge(profile.dateOfBirth),
      userPreferences
    };
  }
  
  /**
   * Calculate age from date of birth
   */
  private static calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
} 