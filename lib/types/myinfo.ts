export interface MyInfoData {
  name: {
    value: string;
  };
  nric?: {
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