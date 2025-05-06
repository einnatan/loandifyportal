import { NextRequest, NextResponse } from 'next/server';
import { handleSingpassCallback } from '@/lib/services/singpassService';

export async function GET(request: NextRequest) {
  try {
    // Process the callback
    const result = await handleSingpassCallback(request);
    
    if (!result.success || !result.profile) {
      return NextResponse.redirect(new URL('/apply?error=singpass_auth_failed', request.url));
    }
    
    // Create a token for the frontend to access the user data
    const token = Buffer.from(JSON.stringify({ 
      id: result.profile.id,
      exp: Date.now() + 300000 // 5 minutes expiry
    })).toString('base64');
    
    return NextResponse.redirect(new URL(`/apply?singpass_token=${token}`, request.url));
  } catch (error) {
    console.error('SingPass callback error:', error);
    
    // Redirect to an error page
    return NextResponse.redirect(new URL('/apply?error=singpass_auth_failed', request.url));
  }
} 