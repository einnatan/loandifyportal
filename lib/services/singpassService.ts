import { NextRequest } from 'next/server';

export interface SingPassProfile {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  nric?: string;
  address?: string;
  dateOfBirth?: string;
}

/**
 * Handle the callback from SingPass authentication
 */
export async function handleSingpassCallback(request: NextRequest) {
  try {
    // Mock successful authentication
    const code = request.nextUrl.searchParams.get('code');
    
    if (!code) {
      throw new Error('No authorization code provided');
    }
    
    // Mock user data
    const mockUserProfile: SingPassProfile = {
      id: 'SP' + Math.random().toString(36).substring(2, 10),
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '+6591234567',
      nric: 'S1234567D',
      address: '123 Test Street, Singapore 123456',
      dateOfBirth: '1990-01-01',
    };
    
    return {
      success: true,
      profile: mockUserProfile,
    };
  } catch (error) {
    console.error('SingPass callback error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate SingPass login URL
 */
export function generateSingpassLoginUrl() {
  const baseUrl = process.env.SINGPASS_AUTH_URL || 'https://stg-id.singpass.gov.sg/auth';
  const clientId = process.env.SINGPASS_CLIENT_ID || 'DEMO-APP';
  const redirectUri = encodeURIComponent(
    process.env.SINGPASS_REDIRECT_URL || 'http://localhost:3000/api/singpass/callback'
  );
  const state = Math.random().toString(36).substring(2);
  
  return `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=openid&response_type=code`;
} 