import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoanOfferCard } from './LoanOfferCard';
import { LoanOffer } from '../../lib/services/bankApiService';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('LoanOfferCard', () => {
  const mockOffer: LoanOffer = {
    id: 'test-id-1',
    bankName: 'Test Bank',
    bankLogo: '/path/to/logo.png',
    interestRate: 3.5,
    monthlyPayment: 350.75,
    totalAmount: 12626.55,
    term: 36,
    processingFee: 1.5,
    features: ['Feature 1', 'Feature 2'],
    conditions: ['Condition 1', 'Condition 2'],
    approvalTime: '24 hours'
  };

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders the loan offer card with correct information', () => {
    render(<LoanOfferCard offer={mockOffer} onSelect={mockOnSelect} />);

    // Check if basic information is displayed
    expect(screen.getByText('Test Bank')).toBeInTheDocument();
    expect(screen.getByText('Personal Loan')).toBeInTheDocument();
    expect(screen.getByText('3.5%')).toBeInTheDocument();
    expect(screen.getByText('$350.75')).toBeInTheDocument();
    expect(screen.getByText('$12626.55')).toBeInTheDocument();
    expect(screen.getByText('1.5%')).toBeInTheDocument();
    
    // Check if features and conditions are displayed
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Condition 1')).toBeInTheDocument();
    expect(screen.getByText('Condition 2')).toBeInTheDocument();
    
    // Check if the approval time badge is displayed
    expect(screen.getByText('24 hours approval')).toBeInTheDocument();
    
    // Check if the select button is displayed
    expect(screen.getByText('Select This Offer')).toBeInTheDocument();
  });

  it('calls onSelect when the button is clicked', () => {
    render(<LoanOfferCard offer={mockOffer} onSelect={mockOnSelect} />);
    
    const button = screen.getByText('Select This Offer');
    fireEvent.click(button);
    
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockOffer);
  });

  it('shows "Selected" when isSelected is true', () => {
    render(<LoanOfferCard offer={mockOffer} onSelect={mockOnSelect} isSelected={true} />);
    
    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.queryByText('Select This Offer')).not.toBeInTheDocument();
  });

  it('applies the correct border styling when selected', () => {
    const { container } = render(<LoanOfferCard offer={mockOffer} onSelect={mockOnSelect} isSelected={true} />);
    
    // The root element should have the border-primary and border-2 classes
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('border-primary');
    expect(cardElement).toHaveClass('border-2');
  });
}); 