// Form validation utilities for Loandify

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Singapore phone number validation - improved regex
export const isValidSGPhone = (phone: string): boolean => {
  // Remove spaces, dashes, and +65 prefix
  const cleanPhone = phone.replace(/\s+|-|\+65/g, '');
  // Singapore numbers start with 8 or 9 and are 8 digits long
  const phoneRegex = /^[89]\d{7}$/;
  return phoneRegex.test(cleanPhone);
};

// Singapore postal code validation
export const isValidPostalCode = (postal: string): boolean => {
  // Singapore postal codes are 6 digits
  const postalRegex = /^\d{6}$/;
  return postalRegex.test(postal);
};

// Income validation (must be positive number)
export const isValidIncome = (income: number): boolean => {
  return !isNaN(income) && income >= 0;
};

// Age validation (must be at least 21 years old)
export const isValidAge = (dob: string): boolean => {
  const birthDate = new Date(dob);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(birthDate.getTime())) return false;
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 21;
};

// Validate Singapore NRIC
export const isValidNRIC = (nric: string): boolean => {
  // Basic NRIC format: S/T/F/G followed by 7 digits and a letter
  const nricRegex = /^[STFG]\d{7}[A-Z]$/;
  if (!nricRegex.test(nric)) return false;
  
  // Full validation would include checksum calculation
  return true;
};

// Validate Singapore address block number
export const isValidBlockNumber = (block: string): boolean => {
  // Block can be alphanumeric but should not be empty
  return block.trim().length > 0;
};

// Singapore unit number validation
export const isValidUnitNumber = (unit: string): boolean => {
  // Unit format: #DD-DD or #DD-DDD
  const unitRegex = /^#\d{2}-\d{2,3}$/;
  return unitRegex.test(unit);
};

// Password strength validation
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, at least one uppercase, one lowercase, one number, one special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

// Form field validation with error messages
export const validateField = (
  field: string,
  value: any
): { isValid: boolean; errorMessage: string } => {
  switch (field) {
    case 'email':
      return {
        isValid: isValidEmail(value),
        errorMessage: 'Please enter a valid email address'
      };
    case 'phone':
      return {
        isValid: isValidSGPhone(value),
        errorMessage: 'Please enter a valid Singapore phone number (e.g., 8123 4567)'
      };
    case 'postal':
      return {
        isValid: isValidPostalCode(value),
        errorMessage: 'Please enter a valid 6-digit Singapore postal code'
      };
    case 'income':
      return {
        isValid: isValidIncome(Number(value)),
        errorMessage: 'Please enter a valid income amount'
      };
    case 'dob':
      return {
        isValid: isValidAge(value),
        errorMessage: 'You must be at least 21 years old to apply'
      };
    case 'fullName':
      return {
        isValid: value && value.trim().length > 2,
        errorMessage: 'Full name must be at least 3 characters'
      };
    case 'nric':
      return {
        isValid: isValidNRIC(value),
        errorMessage: 'Please enter a valid Singapore NRIC (e.g., S1234567A)'
      };
    case 'unit':
      return {
        isValid: isValidUnitNumber(value),
        errorMessage: 'Please enter a valid unit number (e.g., #01-23)'
      };
    case 'block':
      return {
        isValid: isValidBlockNumber(value),
        errorMessage: 'Block number cannot be empty'
      };
    case 'password':
      return {
        isValid: isStrongPassword(value),
        errorMessage: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      };
    default:
      return { isValid: true, errorMessage: '' };
  }
};

// Validate the entire loan application form
export const validateLoanApplication = (
  userData: any
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Personal information
  if (!userData.fullName || userData.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters';
  }
  
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.email = 'Valid email address is required';
  }
  
  if (!userData.phone || !isValidSGPhone(userData.phone)) {
    errors.phone = 'Valid Singapore phone number is required';
  }
  
  if (!userData.dob || !isValidAge(userData.dob)) {
    errors.dob = 'You must be at least 21 years old to apply';
  }
  
  if (userData.nric && !isValidNRIC(userData.nric)) {
    errors.nric = 'Please enter a valid Singapore NRIC';
  }
  
  // Address validation
  if (!userData.address?.postal || !isValidPostalCode(userData.address.postal)) {
    errors['address.postal'] = 'Valid 6-digit Singapore postal code is required';
  }
  
  if (!userData.address?.block || userData.address.block.trim() === '') {
    errors['address.block'] = 'Block number is required';
  }
  
  if (!userData.address?.street || userData.address.street.trim() === '') {
    errors['address.street'] = 'Street name is required';
  }
  
  if (userData.address?.unit && !isValidUnitNumber(userData.address.unit)) {
    errors['address.unit'] = 'Please enter a valid unit number (e.g., #01-23)';
  }
  
  // Income validation
  if (!userData.income?.monthly || !isValidIncome(userData.income.monthly)) {
    errors['income.monthly'] = 'Valid monthly income is required';
  }
  
  if (userData.income?.monthly && userData.income.monthly < 1500) {
    errors['income.monthly'] = 'Monthly income must be at least $1,500';
  }
  
  // Employment status validation
  if (!userData.employmentStatus || userData.employmentStatus.trim() === '') {
    errors.employmentStatus = 'Employment status is required';
  }
  
  // Occupation validation
  if (!userData.occupation || userData.occupation.trim() === '') {
    errors.occupation = 'Occupation is required';
  }
  
  return errors;
}; 

// Real-time field validation with debounce
let debounceTimers: Record<string, NodeJS.Timeout> = {};

export const debounceValidation = (
  field: string, 
  value: any, 
  callback: (field: string, result: { isValid: boolean; errorMessage: string }) => void,
  delay: number = 500
): void => {
  // Clear previous timer for this field
  if (debounceTimers[field]) {
    clearTimeout(debounceTimers[field]);
  }
  
  // Set new timer
  debounceTimers[field] = setTimeout(() => {
    const result = validateField(field, value);
    callback(field, result);
  }, delay);
};

// Password strength indicator
export const getPasswordStrength = (password: string): {
  score: number; // 0-4
  feedback: string;
} => {
  if (!password) return { score: 0, feedback: 'Password is required' };
  
  let score = 0;
  const feedback = [];
  
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score < 2) feedback.push('Password is weak');
  else if (score < 4) feedback.push('Password strength is moderate');
  else feedback.push('Password is strong');
  
  if (password.length < 8) feedback.push('Password should be at least 8 characters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
  if (!/[0-9]/.test(password)) feedback.push('Add numbers');
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Add special characters');
  
  return {
    score: Math.min(score, 4),
    feedback: feedback[0] // Return the most important feedback
  };
}; 