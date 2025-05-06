'use client';

import { AIRecommendations as OriginalAIRecommendations } from './AiRecommendations';
import { UserProfile } from '@/lib/types/user';
import { LoanOffer } from '@/lib/types/loan';

interface RecommendationsProps {
  userProfile: UserProfile;
  availableOffers: LoanOffer[];
}

export function AIRecommendations({ userProfile, availableOffers }: RecommendationsProps) {
  return (
    <OriginalAIRecommendations 
      userProfile={userProfile} 
      availableOffers={availableOffers} 
    />
  );
} 