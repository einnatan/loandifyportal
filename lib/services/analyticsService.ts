import { subMonths, format, eachMonthOfInterval, subDays, eachDayOfInterval } from 'date-fns';

export interface AnalyticsData {
  loanPerformance: {
    month: string;
    disbursed: number;
    repaid: number;
  }[];
  applicationStatus: {
    status: string;
    count: number;
  }[];
  lenderDistribution: {
    lender: string;
    percentage: number;
    amount: number;
  }[];
  recentActivity: {
    date: string;
    action: string;
    details: string;
  }[];
  dailyApplications: {
    date: string;
    count: number;
  }[];
  conversionRates: {
    stage: string;
    rate: number;
  }[];
}

/**
 * Generate mock analytics data for dashboard
 */
export function getAnalyticsData(): AnalyticsData {
  // Create date range for the last 6 months
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 6);
  
  // Generate monthly data points
  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: today
  }).map(date => format(date, 'MMM yyyy'));
  
  // Loan performance data - disbursed vs repaid
  const loanPerformance = months.map((month, index) => {
    // Simulate growing disbursements and repayments
    const disbursed = 120000 + (index * 15000) + Math.random() * 20000;
    const repaid = disbursed * (0.4 + (index * 0.05)) + Math.random() * 10000;
    
    return {
      month,
      disbursed: Math.round(disbursed),
      repaid: Math.round(repaid)
    };
  });
  
  // Application status breakdown
  const applicationStatus = [
    { status: 'Approved', count: 68 },
    { status: 'Processing', count: 23 },
    { status: 'Pending Documents', count: 15 },
    { status: 'Rejected', count: 8 },
    { status: 'Withdrawn', count: 4 }
  ];
  
  // Lender distribution
  const lenderDistribution = [
    { lender: 'DBS Bank', percentage: 32, amount: 1250000 },
    { lender: 'OCBC', percentage: 27, amount: 1050000 },
    { lender: 'Standard Chartered', percentage: 18, amount: 700000 },
    { lender: 'Citibank', percentage: 14, amount: 550000 },
    { lender: 'Others', percentage: 9, amount: 350000 }
  ];
  
  // Recent activity logs
  const activities = [
    'Loan application submitted',
    'Loan approved',
    'Documents verified',
    'Loan disbursed',
    'Payment received',
    'Late payment notification',
    'Loan fully repaid'
  ];
  
  const recentActivity = Array.from({ length: 10 }, (_, i) => {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    const action = activities[Math.floor(Math.random() * activities.length)];
    return {
      date,
      action,
      details: `${action} for customer ID ${10000 + Math.floor(Math.random() * 5000)}`
    };
  });
  
  // Daily application data for the last 30 days
  const thirtyDaysAgo = subDays(today, 30);
  const dailyApplications = eachDayOfInterval({
    start: thirtyDaysAgo,
    end: today
  }).map(date => ({
    date: format(date, 'yyyy-MM-dd'),
    count: Math.floor(Math.random() * 20) + 5
  }));
  
  // Conversion rates through the funnel
  const conversionRates = [
    { stage: 'Visit to Application', rate: 24 },
    { stage: 'Application to Documents', rate: 72 },
    { stage: 'Documents to Approval', rate: 68 },
    { stage: 'Approval to Disbursement', rate: 91 }
  ];
  
  return {
    loanPerformance,
    applicationStatus,
    lenderDistribution,
    recentActivity,
    dailyApplications,
    conversionRates
  };
}

/**
 * Get KPI metrics for the analytics dashboard
 */
export function getKpiMetrics() {
  return {
    totalLoansValue: 3900000,
    totalLoansCount: 218,
    averageLoanAmount: 17890,
    averageInterestRate: 3.68,
    conversionRate: 23.4,
    averageProcessingTime: 2.3 // days
  };
}

/**
 * Calculate growth percentage compared to previous period
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 100;
  return Number(((current - previous) / previous * 100).toFixed(1));
}

/**
 * Get predicted loan performance for the next 3 months
 */
export function getPredictedLoanPerformance() {
  const today = new Date();
  const nextThreeMonths = [1, 2, 3].map(i => format(subMonths(today, -i), 'MMM yyyy'));
  
  return nextThreeMonths.map((month, index) => {
    // Prediction algorithm - simple growth projection
    const disbursed = 210000 + (index * 18000) + Math.random() * 25000;
    const repaid = disbursed * (0.6 + (index * 0.02)) + Math.random() * 12000;
    
    return {
      month,
      disbursed: Math.round(disbursed),
      repaid: Math.round(repaid)
    };
  });
} 