import React from 'react';
import Image from 'next/image';
import { LoanOffer } from '../../lib/services/bankApiService';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface LoanOfferCardProps {
  offer: LoanOffer;
  onSelect: (offer: LoanOffer) => void;
  isSelected?: boolean;
}

export const LoanOfferCard: React.FC<LoanOfferCardProps> = ({ 
  offer, 
  onSelect,
  isSelected = false
}) => {
  const {
    bankName,
    bankLogo,
    interestRate,
    monthlyPayment,
    totalAmount,
    term,
    processingFee,
    features,
    conditions,
    approvalTime
  } = offer;
  
  return (
    <Card className={`w-full transition-all ${isSelected ? 'border-primary border-2' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {bankLogo && (
              <div className="relative w-10 h-10">
                <Image 
                  src={bankLogo} 
                  alt={`${bankName} logo`} 
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <CardTitle className="text-lg">{bankName}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {approvalTime} approval
          </Badge>
        </div>
        <CardDescription>Personal Loan</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Interest Rate</span>
            <span className="text-2xl font-bold">{interestRate}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Monthly Payment</span>
            <span className="text-2xl font-bold">${monthlyPayment}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Payable</span>
            <span className="text-lg font-medium">${totalAmount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Processing Fee</span>
            <span className="text-lg font-medium">{processingFee}%</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Features</h4>
          <ul className="text-sm space-y-1 list-disc pl-4">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Conditions</h4>
          <ul className="text-sm space-y-1 list-disc pl-4">
            {conditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSelect(offer)} 
          className="w-full"
          variant={isSelected ? "secondary" : "default"}
        >
          {isSelected ? 'Selected' : 'Select This Offer'}
        </Button>
      </CardFooter>
    </Card>
  );
}; 