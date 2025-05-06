'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { AIRecommendationService, RecommendationCriteria } from '@/lib/services/aiRecommendationService';
import { LoanOffer } from '@/lib/types/loan';
import { UserProfile } from '@/lib/types/user';
import { Checkbox } from './ui/checkbox';
import { Spinner } from './ui/spinner';

interface AIRecommendationsProps {
  userProfile: UserProfile;
  availableOffers: LoanOffer[];
}

export function AIRecommendations({ userProfile, availableOffers }: AIRecommendationsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanPurpose, setLoanPurpose] = useState('debt-consolidation');
  const [recommendations, setRecommendations] = useState<Array<LoanOffer & { score: number; matchReason: string[] }>>([]);
  const [userPreferences, setUserPreferences] = useState({
    prioritizeLowInterest: true,
    prioritizeLongTerm: false,
    prioritizeLowMonthlyPayment: true,
    preferredBanks: userProfile.preferences?.preferredBanks || []
  });

  // Generate recommendations when component mounts or inputs change
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const criteria: RecommendationCriteria = AIRecommendationService.extractCriteriaFromProfile(
        userProfile,
        loanAmount,
        loanPurpose,
        userPreferences
      );
      
      const recommendationResults = AIRecommendationService.getRecommendations(
        criteria,
        availableOffers
      );
      
      // Combine recommendations with original offers to get full offer details
      const detailedRecommendations = recommendationResults.map(rec => {
        const offer = availableOffers.find(o => o.id === rec.offerId);
        if (!offer) return null;
        
        return {
          ...offer,
          score: rec.score,
          matchReason: rec.matchReason
        };
      }).filter(Boolean) as Array<LoanOffer & { score: number; matchReason: string[] }>;
      
      setRecommendations(detailedRecommendations);
      setIsLoading(false);
    }, 1500);
  }, [loanAmount, loanPurpose, userPreferences, userProfile, availableOffers]);

  const handlePreferenceChange = (key: keyof typeof userPreferences, value: any) => {
    setUserPreferences({
      ...userPreferences,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalize Your Recommendations</CardTitle>
          <CardDescription>
            Tell us what you're looking for and we'll find the best matches for you
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="loan-amount">Loan Amount: ${loanAmount.toLocaleString()}</Label>
            </div>
            <Slider
              id="loan-amount"
              min={5000}
              max={200000}
              step={1000}
              value={[loanAmount]}
              onValueChange={(value) => setLoanAmount(value[0])}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Loan Purpose</Label>
              <select 
                className="w-full p-2 border rounded"
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
              >
                <option value="debt-consolidation">Debt Consolidation</option>
                <option value="home-renovation">Home Renovation</option>
                <option value="education">Education</option>
                <option value="medical">Medical Expenses</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="low-interest"
                    checked={userPreferences.prioritizeLowInterest}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange('prioritizeLowInterest', checked)
                    }
                  />
                  <label htmlFor="low-interest" className="text-sm">Prioritize low interest rates</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="long-term"
                    checked={userPreferences.prioritizeLongTerm}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange('prioritizeLongTerm', checked)
                    }
                  />
                  <label htmlFor="long-term" className="text-sm">Prioritize longer loan terms</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="low-monthly"
                    checked={userPreferences.prioritizeLowMonthlyPayment}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange('prioritizeLowMonthlyPayment', checked)
                    }
                  />
                  <label htmlFor="low-monthly" className="text-sm">Prioritize low monthly payments</label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Personalized Recommendations</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Spinner className="w-8 h-8 text-primary" />
            <span className="ml-2">Finding the perfect matches for you...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((offer) => (
              <Card key={offer.id} className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{offer.name}</CardTitle>
                      <CardDescription>{offer.bankName}</CardDescription>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <Badge 
                        variant={offer.score >= 80 ? "default" : offer.score >= 60 ? "secondary" : "outline"}
                        className="mb-1"
                      >
                        {offer.score >= 80 ? "Excellent Match" : 
                         offer.score >= 60 ? "Good Match" : "Fair Match"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{offer.score}% match</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">${offer.amount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate:</span>
                      <span className="font-medium">{offer.interestRate.toFixed(2)}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Payment:</span>
                      <span className="font-medium">${offer.monthlyPayment.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Term:</span>
                      <span className="font-medium">{offer.term} months</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Why this is recommended:</h4>
                    <ul className="text-xs space-y-1">
                      {offer.matchReason.map((reason, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button className="w-full">Select This Offer</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 