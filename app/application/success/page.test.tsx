import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ApplicationSuccessPage from './page';
import { getLoanApplicationStatus } from '../../../lib/services/bankApiService';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockImplementation((param) => {
      if (param === 'id') {
        return 'test-app-123';
      }
      return null;
    }),
  }),
}));

// Mock the bankApiService
jest.mock('../../../lib/services/bankApiService', () => ({
  getLoanApplicationStatus: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  CheckCircle2: () => <div data-testid="check-circle-icon" />,
}));

describe('ApplicationSuccessPage', () => {
  const mockStatusData = {
    status: 'PENDING_APPROVAL',
    updatedAt: new Date().toISOString(),
    nextSteps: [
      'Step 1: Prepare your documents',
      'Step 2: Wait for bank approval',
      'Step 3: Sign the loan agreement',
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    // Mock the API to not resolve yet
    (getLoanApplicationStatus as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<ApplicationSuccessPage />);
    
    // Check if loading indicator is visible
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show application status after loading', async () => {
    // Mock the API to return successful response
    (getLoanApplicationStatus as jest.Mock).mockResolvedValue(mockStatusData);

    render(<ApplicationSuccessPage />);
    
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check if status information is displayed
    expect(screen.getByText('Application Submitted Successfully!')).toBeInTheDocument();
    expect(screen.getByText('test-app-123')).toBeInTheDocument();
    expect(screen.getByText('PENDING APPROVAL')).toBeInTheDocument();
    
    // Check if next steps are displayed
    expect(screen.getByText('Next Steps')).toBeInTheDocument();
    mockStatusData.nextSteps.forEach(step => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
    
    // Check if buttons are displayed
    expect(screen.getByText('Back to Offers')).toBeInTheDocument();
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
  });

  it('should show error message when API call fails', async () => {
    // Mock the API to return an error
    (getLoanApplicationStatus as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<ApplicationSuccessPage />);
    
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check if error message is displayed
    expect(screen.getByText('Failed to fetch application status')).toBeInTheDocument();
    expect(screen.getByText('Back to Offers')).toBeInTheDocument();
  });

  it('should show error when no application ID is provided', async () => {
    // Mock useSearchParams to return null for 'id'
    jest.requireMock('next/navigation').useSearchParams = () => ({
      get: () => null,
    });
    
    render(<ApplicationSuccessPage />);
    
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check if error message is displayed
    expect(screen.getByText('No application ID found')).toBeInTheDocument();
  });
}); 