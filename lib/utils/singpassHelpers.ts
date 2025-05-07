import { MyInfoData } from '../types/myinfo';

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
export function mapMyInfoToFormData(userData: MyInfoData): Record<string, any> {
  return {
    // Personal information
    fullName: userData.name.value,
    nric: userData.nric?.value || '',
    dateOfBirth: userData.dob.value,
    email: userData.email.value,
    phoneNumber: `${userData.mobileno.prefix}${userData.mobileno.nbr}`,
    address: `${userData.regadd.block} ${userData.regadd.street} ${userData.regadd.unit} Singapore ${userData.regadd.postal}`,
    nationality: userData.nationality.desc,
    
    // Financial information
    income: userData.noa.assessable.value,
    employmentStatus: userData.employment.status.desc,
    
    // Educational background
    educationLevel: userData.occupation.desc,
    
    // Housing information
    housingType: userData.housingtype.desc,
    maritalStatus: userData.sex.desc,
    
    // CPF information
    cpfContributions: userData.cpfcontributions.history.reduce((sum: number, month: { amount: number }) => sum + month.amount, 0),
    cpfOrdinaryAccount: userData.cpfbalances.oa.value,
    cpfSpecialAccount: userData.cpfbalances.sa.value,
    cpfMedisaveAccount: userData.cpfbalances.ma.value,
  };
}

/**
 * Mock retrieving MyInfo data from session/database using a token
 * In a real application, this would fetch the data from a secure storage
 */
export function retrieveMyInfoData(token: SingpassToken): MyInfoData {
  // In a real application, you would fetch this data from your database
  // using the token ID as a key
  
  // For demo purposes, we'll return a mock user
  return {
    name: {
      value: 'Tan Xiao Ming'
    },
    sex: {
      code: 'M',
      desc: 'MALE'
    },
    race: {
      code: 'CN',
      desc: 'CHINESE'
    },
    nationality: {
      code: 'SG',
      desc: 'SINGAPORE CITIZEN'
    },
    dob: {
      value: '1990-01-01'
    },
    email: {
      value: 'xiaoming@example.com'
    },
    mobileno: {
      prefix: '+65',
      nbr: '91234567'
    },
    regadd: {
      unit: '12-34',
      street: 'Ang Mo Kio Avenue 6',
      block: '123',
      building: '',
      postal: '123456',
      country: {
        code: 'SG',
        desc: 'SINGAPORE'
      }
    },
    housingtype: {
      code: 'HDB',
      desc: 'HDB'
    },
    hdbtype: {
      code: '4R',
      desc: '4-ROOM'
    },
    occupation: {
      code: 'IT',
      desc: 'SOFTWARE ENGINEER'
    },
    employment: {
      status: {
        code: 'EMPLOYED',
        desc: 'EMPLOYED'
      }
    },
    cpfcontributions: {
      history: [
        {
          month: '2023-01',
          amount: 1100,
          employer: 'ABC COMPANY PTE LTD'
        },
        {
          month: '2023-02',
          amount: 1100,
          employer: 'ABC COMPANY PTE LTD'
        },
        {
          month: '2023-03',
          amount: 1100,
          employer: 'ABC COMPANY PTE LTD'
        }
      ]
    },
    cpfbalances: {
      ma: {
        value: 37000
      },
      oa: {
        value: 58000
      },
      sa: {
        value: 27000
      }
    },
    noa: {
      assessable: {
        value: 65000
      },
      yearofassessment: {
        value: '2023'
      }
    }
  };
} 