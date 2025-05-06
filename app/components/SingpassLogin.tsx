'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { generateLoginUrl } from '../../lib/services/singpassService';
import Image from 'next/image';

interface SingpassLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const SingpassLogin: React.FC<SingpassLoginProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSingpassLogin = async () => {
    try {
      setIsLoading(true);
      
      // Generate the Singpass login URL
      const loginUrl = generateLoginUrl();
      
      // Redirect to Singpass login
      window.location.href = loginUrl;
      
      // onSuccess will be called when the user is redirected back to our app
      // with a successful login (handled in the callback route)
    } catch (error) {
      console.error('Error initiating Singpass login:', error);
      setIsLoading(false);
      
      if (onError) {
        onError('Failed to initiate Singpass login');
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={handleSingpassLogin}
        disabled={isLoading}
        className="flex items-center gap-2 bg-[#EA5B21] hover:bg-[#D65120] text-white px-6 py-2"
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full" />
        ) : (
          <Image 
            src="/images/singpass-logo.svg" 
            alt="Singpass" 
            width={20} 
            height={20}
            onError={(e) => {
              // If the image fails to load, show a fallback
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.alt = 'SP';
            }}
          />
        )}
        {isLoading ? 'Connecting...' : 'Login with Singpass'}
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        Powered by MyInfo - Secure, Convenient, Trusted
      </p>
    </div>
  );
}; 