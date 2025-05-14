'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getLoanApplicationStatus } from '../../../lib/services/bankApiService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ApplicationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationId = searchParams.get('id');
  const [status, setStatus] = useState<{
    status: string;
    updatedAt: string;
    nextSteps: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) {
      setError('No application ID found');
      setIsLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const statusData = await getLoanApplicationStatus(applicationId);
        setStatus(statusData);
      } catch (err) {
        console.error('Error fetching application status:', err);
        setError('Failed to fetch application status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [applicationId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" role="status" aria-label="Loading"></div>
          </div>
        ) : error || !status ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-destructive mb-4">{error || 'Application not found'}</p>
                <Button onClick={() => router.push('/offers')}>Back to Offers</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-center">Your loan application has been successfully submitted.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-medium">{applicationId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{status.status.replace('_', ' ')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDate(status.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">Next Steps</h3>
                <ol className="space-y-2 list-decimal pl-5">
                  {status.nextSteps.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push('/offers')}>
                Back to Offers
              </Button>
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
} 