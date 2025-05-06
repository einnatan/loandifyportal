import { MyInfoUserData } from '../services/singpassService';

/**
 * Interface for token data stored in URL parameter
 */
interface SingpassToken {
  id: string;
  exp: number;
}

/**
 * Parse a Singpass token from URL parameter
 */
export function parseSingpassToken(token: string): SingpassToken | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const data = JSON.parse(decoded) as SingpassToken;
    
    // Check if the token is expired
    if (data.exp < Date.now()) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error parsing Singpass token:', error);
    return null;
  }
}

/**
 * Map MyInfo data to application form data
 */
export function mapMyInfoToFormData(userData: MyInfoUserData): Record<string, any> {
  return {
    // Personal information
    fullName: userData.name,
    nric: userData.nric,
    dateOfBirth: userData.dateOfBirth,
    email: userData.email,
    phoneNumber: userData.mobileNo,
    address: userData.address,
    nationality: userData.nationality,
    
    // Financial information
    income: userData.income,
    employmentStatus: userData.education, // Not directly mapped but we use education as a proxy
    
    // Educational background
    educationLevel: userData.education,
    
    // Housing information
    housingType: userData.housingType,
    maritalStatus: userData.maritalStatus,
    
    // CPF information
    cpfContributions: userData.cpfContributions,
    cpfOrdinaryAccount: userData.cpfBalances.ordinary,
    cpfSpecialAccount: userData.cpfBalances.special,
    cpfMedisaveAccount: userData.cpfBalances.medisave,
  };
}

/**
 * Mock retrieving MyInfo data from session/database using a token
 * In a real application, this would fetch the data from a secure storage
 */
export function retrieveMyInfoData(token: SingpassToken): MyInfoUserData {
  // In a real application, you would fetch this data from your database
  // using the token ID as a key
  
  // For demo purposes, we'll return a mock user
  return {
    name: 'Tan Xiao Ming',
    nric: 'S9812345A',
    dateOfBirth: '1990-01-01',
    email: 'xiaoming@example.com',
    mobileNo: '91234567',
    address: 'Block 123 Ang Mo Kio Avenue 6 #12-34 S123456',
    nationality: 'SINGAPORE CITIZEN',
    income: 65000,
    cpfContributions: 13000,
    cpfBalances: {
      ordinary: 58000,
      special: 27000,
      medisave: 37000,
    },
    education: 'BACHELOR\'S DEGREE',
    housingType: 'HDB',
    maritalStatus: 'MARRIED',
  };
} 