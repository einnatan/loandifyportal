/**
 * Service for handling Singpass MyInfo API integration
 * 
 * In a production environment, this would integrate with the actual
 * Singpass MyInfo API (https://api.singpass.gov.sg/library/myinfo/developers/overview)
 * 
 * For the prototype, we are simulating the API calls and responses.
 */

export interface MyInfoData {
  name: {
    value: string;
  };
  sex: {
    code: string;
    desc: string;
  };
  race: {
    code: string;
    desc: string;
  };
  nationality: {
    code: string;
    desc: string;
  };
  dob: {
    value: string;
  };
  email: {
    value: string;
  };
  mobileno: {
    prefix: string;
    nbr: string;
  };
  regadd: {
    unit: string;
    street: string;
    block: string;
    building: string;
    postal: string;
    country: {
      code: string;
      desc: string;
    };
  };
  housingtype: {
    code: string;
    desc: string;
  };
  hdbtype: {
    code: string;
    desc: string;
  };
  occupation: {
    code: string;
    desc: string;
  };
  employment: {
    status: {
      code: string;
      desc: string;
    };
  };
  cpfcontributions: {
    history: Array<{
      month: string;
      amount: number;
      employer: string;
    }>;
  };
  cpfbalances: {
    ma: {
      value: number;
    };
    oa: {
      value: number;
    };
    sa: {
      value: number;
    };
  };
  noa: {
    assessable: {
      value: number;
    };
    yearofassessment: {
      value: string;
    };
  };
}

/**
 * Function to initialize the Singpass authentication flow
 * In production, this would redirect the user to Singpass login
 */
export function initSingpassAuth(redirectUrl: string): string {
  // In a real app, this would redirect to the Singpass authentication URL
  // For the prototype, we'll return a simulated URL that would normally be used for redirect
  
  // Construct a simulated Singpass login URL
  const singpassAuthUrl = 'https://api.singpass.gov.sg/authorize' + 
    '?client_id=YOUR_CLIENT_ID' +
    '&redirect_uri=' + encodeURIComponent(redirectUrl) +
    '&response_type=code' +
    '&scope=openid myinfo.personal.read' +
    '&state=' + generateRandomState();
  
  return singpassAuthUrl;
}

/**
 * Function to handle the callback from Singpass authentication
 * In production, this would exchange the code for tokens and fetch user data
 */
export async function handleSingpassCallback(code: string): Promise<MyInfoData> {
  // In a real app, this would:
  // 1. Exchange the auth code for an access token
  // 2. Use the access token to fetch MyInfo data
  // For this prototype, we'll simulate the response

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    name: {
      value: "TAN XIAO HUI"
    },
    sex: {
      code: "F",
      desc: "FEMALE"
    },
    race: {
      code: "CN",
      desc: "CHINESE"
    },
    nationality: {
      code: "SG",
      desc: "SINGAPORE CITIZEN"
    },
    dob: {
      value: "1990-01-15"
    },
    email: {
      value: "myinfotesting@gmail.com"
    },
    mobileno: {
      prefix: "+65",
      nbr: "97324992"
    },
    regadd: {
      unit: "128",
      street: "BEDOK NORTH AVENUE 1",
      block: "128",
      building: "",
      postal: "460128",
      country: {
        code: "SG",
        desc: "SINGAPORE"
      }
    },
    housingtype: {
      code: "HDB",
      desc: "HDB"
    },
    hdbtype: {
      code: "4R",
      desc: "4-ROOM"
    },
    occupation: {
      code: "IT",
      desc: "SOFTWARE ENGINEER"
    },
    employment: {
      status: {
        code: "EMPLOYED",
        desc: "EMPLOYED"
      }
    },
    cpfcontributions: {
      history: [
        {
          month: "2023-01",
          amount: 1100,
          employer: "ACME TECH PTE LTD"
        },
        {
          month: "2023-02",
          amount: 1100,
          employer: "ACME TECH PTE LTD"
        },
        {
          month: "2023-03",
          amount: 1100,
          employer: "ACME TECH PTE LTD"
        }
      ]
    },
    cpfbalances: {
      ma: {
        value: 11000
      },
      oa: {
        value: 18500
      },
      sa: {
        value: 6800
      }
    },
    noa: {
      assessable: {
        value: 68500
      },
      yearofassessment: {
        value: "2023"
      }
    }
  };
}

/**
 * Helper function to generate a random state parameter
 * for CSRF protection in the OAuth flow
 */
function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Function to format MyInfo data for use in form fields
 */
export function formatMyInfoForForm(myInfoData: MyInfoData) {
  return {
    fullName: myInfoData.name.value,
    gender: myInfoData.sex.desc,
    dob: myInfoData.dob.value,
    email: myInfoData.email.value,
    phone: `${myInfoData.mobileno.prefix}${myInfoData.mobileno.nbr}`,
    address: {
      block: myInfoData.regadd.block,
      street: myInfoData.regadd.street,
      unit: myInfoData.regadd.unit,
      postal: myInfoData.regadd.postal,
      country: myInfoData.regadd.country.desc
    },
    housingType: myInfoData.housingtype.desc,
    hdbType: myInfoData.hdbtype.desc,
    occupation: myInfoData.occupation.desc,
    employmentStatus: myInfoData.employment.status.desc,
    income: {
      monthly: calculateMonthlyIncome(myInfoData),
      annual: myInfoData.noa.assessable.value
    },
    cpf: {
      oa: myInfoData.cpfbalances.oa.value,
      sa: myInfoData.cpfbalances.sa.value,
      ma: myInfoData.cpfbalances.ma.value,
      total: myInfoData.cpfbalances.oa.value + 
             myInfoData.cpfbalances.sa.value + 
             myInfoData.cpfbalances.ma.value
    }
  };
}

/**
 * Helper function to calculate approximate monthly income
 * based on NOA and CPF contributions
 */
function calculateMonthlyIncome(myInfoData: MyInfoData): number {
  // In a real app, this would use a more sophisticated calculation
  // For prototype, we'll use a simple approximation based on annual assessable income
  
  // If we have CPF contributions, use that for a more accurate monthly figure
  if (myInfoData.cpfcontributions.history.length > 0) {
    // Calculate average of last 3 months' CPF contributions
    const recentContributions = myInfoData.cpfcontributions.history.slice(0, 3);
    const totalContribution = recentContributions.reduce(
      (sum, month) => sum + month.amount, 0
    );
    const avgContribution = totalContribution / recentContributions.length;
    
    // Estimate monthly income - CPF contribution is approximately 20% of income
    return Math.round(avgContribution * 5);
  }
  
  // Fall back to annual income / 12
  return Math.round(myInfoData.noa.assessable.value / 12);
} 