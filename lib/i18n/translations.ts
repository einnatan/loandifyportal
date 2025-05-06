export type Language = 'en' | 'zh' | 'ms' | 'ta';

export interface TranslationSection {
  [key: string]: string;
}

export interface LanguageTranslations {
  [language: string]: TranslationSection;
}

export interface Translations {
  [section: string]: LanguageTranslations;
}

export const translations: Translations = {
  // Common
  common: {
    en: {
      home: 'Home',
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      apply: 'Apply',
      offers: 'Offers',
      loyalty: 'Loyalty',
      refer: 'Refer',
      feedback: 'Feedback',
      calculator: 'Calculator',
      appointments: 'Appointments',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      next: 'Next',
      back: 'Back',
      search: 'Search',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
    },
    zh: {
      home: '首页',
      dashboard: '仪表板',
      profile: '个人资料',
      settings: '设置',
      logout: '登出',
      apply: '申请',
      offers: '优惠',
      loyalty: '忠诚计划',
      refer: '推荐',
      feedback: '反馈',
      calculator: '计算器',
      appointments: '预约',
      save: '保存',
      cancel: '取消',
      submit: '提交',
      next: '下一步',
      back: '返回',
      search: '搜索',
      loading: '加载中...',
      error: '发生错误',
      success: '成功',
    },
    ms: {
      home: 'Laman Utama',
      dashboard: 'Papan Pemuka',
      profile: 'Profil',
      settings: 'Tetapan',
      logout: 'Log Keluar',
      apply: 'Mohon',
      offers: 'Tawaran',
      loyalty: 'Kesetiaan',
      refer: 'Rujuk',
      feedback: 'Maklum Balas',
      calculator: 'Kalkulator',
      appointments: 'Temujanji',
      save: 'Simpan',
      cancel: 'Batal',
      submit: 'Hantar',
      next: 'Seterusnya',
      back: 'Kembali',
      search: 'Cari',
      loading: 'Memuatkan...',
      error: 'Ralat berlaku',
      success: 'Berjaya',
    },
    ta: {
      home: 'முகப்பு',
      dashboard: 'டாஷ்போர்டு',
      profile: 'சுயவிவரம்',
      settings: 'அமைப்புகள்',
      logout: 'வெளியேறு',
      apply: 'விண்ணப்பிக்கவும்',
      offers: 'சலுகைகள்',
      loyalty: 'விசுவாசம்',
      refer: 'பரிந்துரைக்கவும்',
      feedback: 'கருத்து',
      calculator: 'கால்குலேட்டர்',
      appointments: 'சந்திப்புகள்',
      save: 'சேமி',
      cancel: 'ரத்து செய்',
      submit: 'சமர்ப்பி',
      next: 'அடுத்து',
      back: 'பின்செல்',
      search: 'தேடு',
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை ஏற்பட்டது',
      success: 'வெற்றி',
    }
  },
  
  // Home page
  home: {
    en: {
      title: 'Simplify Your Loan Journey',
      subtitle: 'Apply once, compare multiple offers',
      startNow: 'Start Now',
      howItWorks: 'How It Works',
      trustBy: 'Trusted by thousands of borrowers',
      featuredLenders: 'Featured Lenders',
    },
    zh: {
      title: '简化您的贷款流程',
      subtitle: '一次申请，比较多个优惠',
      startNow: '立即开始',
      howItWorks: '工作原理',
      trustBy: '数千借款人的信任',
      featuredLenders: '特色贷款机构',
    },
    ms: {
      title: 'Permudahkan Perjalanan Pinjaman Anda',
      subtitle: 'Mohon sekali, bandingkan pelbagai tawaran',
      startNow: 'Mula Sekarang',
      howItWorks: 'Cara Ia Berfungsi',
      trustBy: 'Dipercayai oleh ribuan peminjam',
      featuredLenders: 'Pemberi Pinjaman Terkemuka',
    },
    ta: {
      title: 'உங்கள் கடன் பயணத்தை எளிதாக்குங்கள்',
      subtitle: 'ஒரே முறை விண்ணப்பிக்கவும், பல சலுகைகளை ஒப்பிடவும்',
      startNow: 'இப்போது தொடங்கு',
      howItWorks: 'இது எப்படி செயல்படுகிறது',
      trustBy: 'ஆயிரக்கணக்கான கடன் வாங்குபவர்களால் நம்பப்படுகிறது',
      featuredLenders: 'சிறப்பு கடன் வழங்குநர்கள்',
    }
  },

  // Dashboard
  dashboard: {
    en: {
      yourLoans: 'Your Loans',
      upcomingPayments: 'Upcoming Payments',
      paymentHistory: 'Payment History',
      recommendations: 'Recommendations',
      notifications: 'Notifications',
    },
    zh: {
      yourLoans: '您的贷款',
      upcomingPayments: '即将到来的付款',
      paymentHistory: '付款历史',
      recommendations: '推荐',
      notifications: '通知',
    },
    ms: {
      yourLoans: 'Pinjaman Anda',
      upcomingPayments: 'Pembayaran Akan Datang',
      paymentHistory: 'Sejarah Pembayaran',
      recommendations: 'Cadangan',
      notifications: 'Pemberitahuan',
    },
    ta: {
      yourLoans: 'உங்கள் கடன்கள்',
      upcomingPayments: 'வரவிருக்கும் கட்டணங்கள்',
      paymentHistory: 'பணம் செலுத்திய வரலாறு',
      recommendations: 'பரிந்துரைகள்',
      notifications: 'அறிவிப்புகள்',
    }
  },

  // Profile
  profile: {
    en: {
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      addresses: 'Addresses',
      financialInfo: 'Financial Information',
      employmentInfo: 'Employment Information',
      securitySettings: 'Security Settings',
    },
    zh: {
      personalInfo: '个人信息',
      contactInfo: '联系信息',
      addresses: '地址',
      financialInfo: '财务信息',
      employmentInfo: '就业信息',
      securitySettings: '安全设置',
    },
    ms: {
      personalInfo: 'Maklumat Peribadi',
      contactInfo: 'Maklumat Hubungan',
      addresses: 'Alamat',
      financialInfo: 'Maklumat Kewangan',
      employmentInfo: 'Maklumat Pekerjaan',
      securitySettings: 'Tetapan Keselamatan',
    },
    ta: {
      personalInfo: 'தனிப்பட்ட தகவல்',
      contactInfo: 'தொடர்பு தகவல்',
      addresses: 'முகவரிகள்',
      financialInfo: 'நிதி தகவல்',
      employmentInfo: 'வேலைவாய்ப்பு தகவல்',
      securitySettings: 'பாதுகாப்பு அமைப்புகள்',
    }
  }
}; 