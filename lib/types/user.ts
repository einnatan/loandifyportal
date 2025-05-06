export interface UserAddress {
  id: string;
  type: 'home' | 'office' | 'mailing' | 'other';
  street: string;
  unit?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export interface UserContact {
  email: string;
  phone: string;
  alternatePhone?: string;
  preferredContact: 'email' | 'phone' | 'sms';
}

export interface UserEmployment {
  status: 'full-time' | 'part-time' | 'self-employed' | 'unemployed' | 'retired' | 'student';
  employer?: string;
  position?: string;
  startDate?: string;
  monthlyIncome?: number;
}

export interface UserFinancial {
  monthlyIncome: number;
  annualIncome: number;
  otherIncome?: number;
  expenses: {
    housing: number;
    utilities: number;
    transportation: number;
    food: number;
    entertainment: number;
    healthcare: number;
    other: number;
  };
  assets: {
    cash: number;
    investments: number;
    property: number;
    other: number;
  };
  liabilities: {
    creditCard: number;
    studentLoans: number;
    autoLoans: number;
    mortgage: number;
    otherLoans: number;
  };
  creditScore?: number;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    shareDataWithPartners: boolean;
    allowAnonymousAnalytics: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationality: string;
  nric: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired' | 'student';
  occupation: string;
  employer: string;
  employmentDuration: number; // in months
  income: {
    monthly: number;
    annual: number;
  };
  addresses: {
    type: 'home' | 'work' | 'mailing';
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isPrimary: boolean;
  }[];
  creditScore: number;
  loans?: {
    id: string;
    type: string;
    amount: number;
    remainingBalance: number;
    monthlyPayment: number;
    interestRate: number;
    term: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'paid' | 'defaulted';
  }[];
  preferences?: {
    communications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    marketing: boolean;
    preferredLanguage: string;
    preferredBanks?: string[];
    prioritizeLowInterest?: boolean;
    prioritizeLongTerm?: boolean;
    prioritizeLowMonthlyPayment?: boolean;
  };
  kycVerified: boolean;
  createdAt: string;
  updatedAt: string;
} 