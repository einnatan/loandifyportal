import { NextRequest, NextResponse } from 'next/server';

// Simulated bank API integration
// In a real application, these would be actual API calls to the bank systems
async function fetchDBSOffers(userData: any) {
  // Simulating API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    lender: "DBS Bank",
    logo: "DBS",
    interestRate: 3.88 + (Math.random() * 0.5 - 0.25),
    effectiveInterestRate: 7.9 + (Math.random() * 0.8 - 0.4),
    monthlyInstallment: 458 + Math.floor(Math.random() * 40 - 20),
    tenureMonths: 36,
    maxLoanAmount: 30000 + Math.floor(Math.random() * 5000 - 2500),
    approved: Math.random() > 0.1, // 90% approval rate
    processingFee: "2%",
    specialFeature: "Instant disbursement"
  };
}

async function fetchOCBCOffers(userData: any) {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    lender: "OCBC",
    logo: "OCBC",
    interestRate: 4.28 + (Math.random() * 0.6 - 0.3),
    effectiveInterestRate: 8.5 + (Math.random() * 0.8 - 0.4),
    monthlyInstallment: 465 + Math.floor(Math.random() * 40 - 20),
    tenureMonths: 36,
    maxLoanAmount: 28000 + Math.floor(Math.random() * 4000 - 2000),
    approved: Math.random() > 0.15, // 85% approval rate
    processingFee: "2.5%",
    specialFeature: "Flexible repayment"
  };
}

async function fetchSCOffers(userData: any) {
  await new Promise(resolve => setTimeout(resolve, 350));
  
  return {
    lender: "Standard Chartered",
    logo: "SC",
    interestRate: 3.48 + (Math.random() * 0.4 - 0.2),
    effectiveInterestRate: 6.8 + (Math.random() * 0.6 - 0.3),
    monthlyInstallment: 443 + Math.floor(Math.random() * 30 - 15),
    tenureMonths: 36,
    maxLoanAmount: 35000 + Math.floor(Math.random() * 5000 - 2500),
    approved: Math.random() > 0.12, // 88% approval rate
    processingFee: "1.8%",
    specialFeature: "Low interest rate"
  };
}

async function fetchUOBOffers(userData: any) {
  await new Promise(resolve => setTimeout(resolve, 380));
  
  return {
    lender: "UOB",
    logo: "UOB",
    interestRate: 4.68 + (Math.random() * 0.6 - 0.3),
    effectiveInterestRate: 8.8 + (Math.random() * 0.8 - 0.4),
    monthlyInstallment: 475 + Math.floor(Math.random() * 50 - 25),
    tenureMonths: 36,
    maxLoanAmount: 25000 + Math.floor(Math.random() * 3000 - 1500),
    approved: Math.random() > 0.18, // 82% approval rate
    processingFee: "2.8%",
    specialFeature: "Cash rebates"
  };
}

// Function to generate bundle offers based on individual offers
function generateBundleOffers(individualOffers: any[]) {
  const approvedOffers = individualOffers.filter(offer => offer.approved);
  
  if (approvedOffers.length < 2) {
    return []; // Not enough approved offers to create bundles
  }
  
  const bundles = [];
  
  // Create "Max Value Bundle" if there are at least 3 approved offers
  if (approvedOffers.length >= 3) {
    const topThree = [...approvedOffers].sort((a, b) => b.maxLoanAmount - a.maxLoanAmount).slice(0, 3);
    
    bundles.push({
      id: 101,
      name: "Max Value Bundle",
      lenders: topThree.map(offer => offer.lender),
      totalLoanAmount: Math.floor(topThree.reduce((sum, offer) => sum + offer.maxLoanAmount, 0) * 0.85), // 85% of total to be conservative
      averageInterestRate: parseFloat((topThree.reduce((sum, offer) => sum + offer.interestRate, 0) / topThree.length).toFixed(2)),
      effectiveInterestRate: parseFloat((topThree.reduce((sum, offer) => sum + offer.effectiveInterestRate, 0) / topThree.length).toFixed(1)),
      monthlyInstallment: Math.floor(topThree.reduce((sum, offer) => sum + offer.monthlyInstallment, 0) * 0.9), // Slightly lower due to bundling
      tenureMonths: 36,
      processingFee: "2.2%",
      specialFeature: "Higher loan amount, consolidated payments"
    });
  }
  
  // Create "Low Rate Bundle" with the two offers with lowest interest rates
  const lowRateOffers = [...approvedOffers].sort((a, b) => a.interestRate - b.interestRate).slice(0, 2);
  
  bundles.push({
    id: 102,
    name: "Low Rate Bundle",
    lenders: lowRateOffers.map(offer => offer.lender),
    totalLoanAmount: Math.floor(lowRateOffers.reduce((sum, offer) => sum + offer.maxLoanAmount, 0) * 0.9),
    averageInterestRate: parseFloat((lowRateOffers.reduce((sum, offer) => sum + offer.interestRate, 0) / lowRateOffers.length - 0.1).toFixed(2)),
    effectiveInterestRate: parseFloat((lowRateOffers.reduce((sum, offer) => sum + offer.effectiveInterestRate, 0) / lowRateOffers.length - 0.2).toFixed(1)),
    monthlyInstallment: Math.floor(lowRateOffers.reduce((sum, offer) => sum + offer.monthlyInstallment, 0) * 0.85),
    tenureMonths: 36,
    processingFee: "2%",
    specialFeature: "Lowest overall interest rate"
  });
  
  return bundles;
}

export async function POST(request: NextRequest) {
  try {
    // Get user data from request body
    const userData = await request.json();
    
    // In production, we would validate the user data here
    
    // Make parallel requests to all bank APIs
    const [dbsOffer, ocbcOffer, scOffer, uobOffer] = await Promise.all([
      fetchDBSOffers(userData),
      fetchOCBCOffers(userData),
      fetchSCOffers(userData),
      fetchUOBOffers(userData)
    ]);
    
    // Assign unique IDs
    const individualOffers = [
      { id: 1, ...dbsOffer },
      { id: 2, ...ocbcOffer },
      { id: 3, ...scOffer },
      { id: 4, ...uobOffer }
    ];
    
    // Generate bundle offers
    const bundleOffers = generateBundleOffers(individualOffers);
    
    // Return all offers
    return NextResponse.json({
      individual: individualOffers,
      bundles: bundleOffers
    });
  } catch (error) {
    console.error('Error fetching loan offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loan offers' },
      { status: 500 }
    );
  }
} 