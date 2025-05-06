export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    shareData: boolean;
    showActivity: boolean;
    anonymizeReviews: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    recentDevices: {
      id: string;
      name: string;
      lastActive: string;
      isCurrent: boolean;
    }[];
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    currencyFormat: string;
  };
}

export interface UserAddress {
  street: string;
  unitNumber: string;
  city: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export interface UserContact {
  type: 'email' | 'phone' | 'other';
  value: string;
  isPrimary: boolean;
  verified: boolean;
}

export interface UserProfile {
  id: string;
  nric: string;
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  occupation: string;
  income: {
    monthly: number;
    annual: number;
    additionalIncome: number;
    source: string;
  };
  addresses: UserAddress[];
  contacts: UserContact[];
  employmentDetails: {
    employer: string;
    jobTitle: string;
    employmentType: string;
    yearsEmployed: number;
    industryCategory: string;
  };
  financialProfile: {
    creditScore: number;
    totalAssets: number;
    totalLiabilities: number;
    monthlyExpenses: number;
    existingLoanCommitments: number;
  };
  preferences: UserPreferences;
  profileCompleteness: number;
  joinedDate: string;
  lastUpdated: string;
}

// Mock user data for development
const mockUserProfile: UserProfile = {
  id: 'USR10028',
  nric: 'S1234567D',
  fullName: 'Tan Wei Ming',
  preferredName: 'Wei Ming',
  dateOfBirth: '1985-08-15',
  gender: 'Male',
  nationality: 'Singaporean',
  maritalStatus: 'Married',
  occupation: 'Software Engineer',
  income: {
    monthly: 8500,
    annual: 102000,
    additionalIncome: 1200,
    source: 'Freelance Consulting'
  },
  addresses: [
    {
      street: '123 Orchard Road',
      unitNumber: '#12-34',
      city: 'Singapore',
      postalCode: '238859',
      country: 'Singapore',
      isPrimary: true
    },
    {
      street: '45 Marina Bay Avenue',
      unitNumber: '#08-12',
      city: 'Singapore',
      postalCode: '018935',
      country: 'Singapore',
      isPrimary: false
    }
  ],
  contacts: [
    {
      type: 'email',
      value: 'weimingt@example.com',
      isPrimary: true,
      verified: true
    },
    {
      type: 'phone',
      value: '+65 8765 4321',
      isPrimary: true,
      verified: true
    },
    {
      type: 'email',
      value: 'weiming.work@example.com',
      isPrimary: false,
      verified: true
    }
  ],
  employmentDetails: {
    employer: 'TechVision Pte Ltd',
    jobTitle: 'Senior Software Engineer',
    employmentType: 'Full-time',
    yearsEmployed: 5,
    industryCategory: 'Information Technology'
  },
  financialProfile: {
    creditScore: 785,
    totalAssets: 850000,
    totalLiabilities: 320000,
    monthlyExpenses: 3200,
    existingLoanCommitments: 1500
  },
  preferences: {
    notifications: {
      email: true,
      sms: true,
      push: false,
      marketing: false
    },
    privacy: {
      shareData: false,
      showActivity: true,
      anonymizeReviews: true
    },
    security: {
      twoFactorEnabled: true,
      loginNotifications: true,
      recentDevices: [
        {
          id: 'dev001',
          name: 'iPhone 13 Pro',
          lastActive: '2023-06-02T10:30:00Z',
          isCurrent: true
        },
        {
          id: 'dev002',
          name: 'MacBook Pro',
          lastActive: '2023-06-01T14:45:00Z',
          isCurrent: false
        },
        {
          id: 'dev003',
          name: 'Chrome on Windows',
          lastActive: '2023-05-28T09:10:00Z',
          isCurrent: false
        }
      ]
    },
    display: {
      theme: 'system',
      language: 'en',
      currencyFormat: 'SGD'
    }
  },
  profileCompleteness: 92,
  joinedDate: '2022-03-15',
  lastUpdated: '2023-05-20'
};

/**
 * Get the user profile
 */
export function getUserProfile(): UserProfile {
  return mockUserProfile;
}

/**
 * Update the user profile
 */
export function updateUserProfile(updatedProfile: Partial<UserProfile>): UserProfile {
  // Simulate API call to update profile
  // In a real implementation, this would call an API endpoint
  
  // For development, we just merge the updates with the mock data
  Object.assign(mockUserProfile, updatedProfile);
  
  // Update the last updated timestamp
  mockUserProfile.lastUpdated = new Date().toISOString();
  
  // Recalculate profile completeness
  mockUserProfile.profileCompleteness = calculateProfileCompleteness(mockUserProfile);
  
  return mockUserProfile;
}

/**
 * Calculate profile completeness percentage
 */
function calculateProfileCompleteness(profile: UserProfile): number {
  // Define fields that contribute to completeness and their weights
  const fields: { [key: string]: number } = {
    fullName: 5,
    preferredName: 2,
    dateOfBirth: 5,
    gender: 3,
    nationality: 3,
    maritalStatus: 3,
    occupation: 5,
    income: 10,
    addresses: 10,
    contacts: 10,
    employmentDetails: 15,
    financialProfile: 15
  };
  
  let completedWeight = 0;
  let totalWeight = 0;
  
  // Check each field for completion
  for (const [field, weight] of Object.entries(fields)) {
    totalWeight += weight;
    
    if (field === 'addresses') {
      // Check if at least one primary address exists
      if (profile.addresses.some(addr => addr.isPrimary)) {
        completedWeight += weight;
      }
    } else if (field === 'contacts') {
      // Check if at least one primary and verified contact exists
      if (profile.contacts.some(contact => contact.isPrimary && contact.verified)) {
        completedWeight += weight;
      }
    } else if (field === 'income') {
      // Check if monthly income is provided
      if (profile.income.monthly > 0) {
        completedWeight += weight;
      }
    } else if (field === 'employmentDetails') {
      // Check if employment details are provided
      if (profile.employmentDetails.employer && profile.employmentDetails.jobTitle) {
        completedWeight += weight * 0.7; // 70% of weight
        
        if (profile.employmentDetails.yearsEmployed > 0) {
          completedWeight += weight * 0.3; // Remaining 30%
        }
      }
    } else if (field === 'financialProfile') {
      // Check if financial profile is provided
      if (profile.financialProfile.creditScore > 0) {
        completedWeight += weight * 0.5; // 50% of weight
        
        if (profile.financialProfile.totalAssets > 0 || profile.financialProfile.totalLiabilities > 0) {
          completedWeight += weight * 0.5; // Remaining 50%
        }
      }
    } else {
      // For simple fields, check if they exist
      if (profile[field as keyof UserProfile]) {
        completedWeight += weight;
      }
    }
  }
  
  // Calculate percentage and round to nearest integer
  return Math.round((completedWeight / totalWeight) * 100);
}

/**
 * Add a new address to the user profile
 */
export function addUserAddress(address: Omit<UserAddress, 'isPrimary'>): UserProfile {
  // If this is the first address, make it primary
  const isPrimary = mockUserProfile.addresses.length === 0;
  
  // Add the new address
  mockUserProfile.addresses.push({
    ...address,
    isPrimary
  });
  
  // Update the last updated timestamp
  mockUserProfile.lastUpdated = new Date().toISOString();
  
  // Recalculate profile completeness
  mockUserProfile.profileCompleteness = calculateProfileCompleteness(mockUserProfile);
  
  return mockUserProfile;
}

/**
 * Set an address as primary
 */
export function setPrimaryAddress(addressIndex: number): UserProfile {
  // Ensure the address exists
  if (addressIndex >= 0 && addressIndex < mockUserProfile.addresses.length) {
    // Set all addresses to non-primary
    mockUserProfile.addresses.forEach(addr => {
      addr.isPrimary = false;
    });
    
    // Set the specified address as primary
    mockUserProfile.addresses[addressIndex].isPrimary = true;
    
    // Update the last updated timestamp
    mockUserProfile.lastUpdated = new Date().toISOString();
  }
  
  return mockUserProfile;
}

/**
 * Update user preferences
 */
export function updateUserPreferences(preferences: Partial<UserPreferences>): UserProfile {
  // Merge the new preferences with existing ones
  mockUserProfile.preferences = {
    ...mockUserProfile.preferences,
    ...preferences,
    // Merge nested objects
    notifications: {
      ...mockUserProfile.preferences.notifications,
      ...(preferences.notifications || {})
    },
    privacy: {
      ...mockUserProfile.preferences.privacy,
      ...(preferences.privacy || {})
    },
    security: {
      ...mockUserProfile.preferences.security,
      ...(preferences.security || {})
    },
    display: {
      ...mockUserProfile.preferences.display,
      ...(preferences.display || {})
    }
  };
  
  // Update the last updated timestamp
  mockUserProfile.lastUpdated = new Date().toISOString();
  
  return mockUserProfile;
}

/**
 * Get a simplified user profile summary
 */
export function getUserProfileSummary() {
  const profile = mockUserProfile;
  
  return {
    id: profile.id,
    fullName: profile.fullName,
    preferredName: profile.preferredName,
    primaryEmail: profile.contacts.find(c => c.type === 'email' && c.isPrimary)?.value || '',
    primaryPhone: profile.contacts.find(c => c.type === 'phone' && c.isPrimary)?.value || '',
    primaryAddress: profile.addresses.find(a => a.isPrimary) || null,
    occupation: profile.occupation,
    creditScore: profile.financialProfile.creditScore,
    profileCompleteness: profile.profileCompleteness
  };
} 