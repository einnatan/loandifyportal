import { generateLoanOffers, applyForLoan, getLoanApplicationStatus, LoanApplicationData } from './bankApiService';

// Mock axios
jest.mock('axios');

describe('Bank API Service', () => {
  const mockApplicationData: LoanApplicationData = {
    personalInfo: {
      fullName: 'John Doe',
      nric: 'S9812345A',
      dateOfBirth: '1990-01-01',
      email: 'john@example.com',
      phoneNumber: '91234567'
    },
    financialInfo: {
      income: 5000,
      employment: 'Full-time',
      existingLoans: 0
    },
    loanRequest: {
      amount: 20000,
      purpose: 'Personal',
      term: 36
    }
  };

  describe('generateLoanOffers', () => {
    it('should generate loan offers from multiple banks', async () => {
      const offers = await generateLoanOffers(mockApplicationData);
      
      // Check that we get offers from all banks
      expect(offers.length).toBeGreaterThan(0);
      
      // Check that each offer has the required properties
      offers.forEach(offer => {
        expect(offer).toHaveProperty('id');
        expect(offer).toHaveProperty('bankName');
        expect(offer).toHaveProperty('bankLogo');
        expect(offer).toHaveProperty('interestRate');
        expect(offer).toHaveProperty('monthlyPayment');
        expect(offer).toHaveProperty('totalAmount');
        expect(offer).toHaveProperty('term');
        expect(offer).toHaveProperty('processingFee');
        expect(offer).toHaveProperty('features');
        expect(offer).toHaveProperty('conditions');
        expect(offer).toHaveProperty('approvalTime');
        
        // Verify offer calculations
        expect(typeof offer.interestRate).toBe('number');
        expect(typeof offer.monthlyPayment).toBe('number');
        expect(typeof offer.totalAmount).toBe('number');
        
        // Basic validation of calculation
        expect(offer.totalAmount).toBeGreaterThan(mockApplicationData.loanRequest.amount);
      });
    });
  });

  describe('applyForLoan', () => {
    it('should successfully apply for a loan', async () => {
      const result = await applyForLoan('test-offer-id', mockApplicationData);
      
      // Check that the application response has the required properties
      expect(result).toHaveProperty('applicationId');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('nextSteps');
      
      // Check that the ID format is as expected
      expect(result.applicationId).toContain('APP-');
      expect(result.applicationId).toContain('test-offer-id');
      
      // Check that the status is pending
      expect(result.status).toBe('PENDING_APPROVAL');
      
      // Check that there are next steps
      expect(result.nextSteps.length).toBeGreaterThan(0);
    });
  });

  describe('getLoanApplicationStatus', () => {
    it('should get the status of a loan application', async () => {
      const result = await getLoanApplicationStatus('test-application-id');
      
      // Check that the status response has the required properties
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('updatedAt');
      expect(result).toHaveProperty('nextSteps');
      
      // Check that there's a valid status
      expect(result.status).toBe('PENDING_APPROVAL');
      
      // Check that there's a valid date
      expect(Date.parse(result.updatedAt)).not.toBeNaN();
      
      // Check that there are next steps
      expect(result.nextSteps.length).toBeGreaterThan(0);
    });
  });
}); 