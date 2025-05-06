'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'zh' | 'ms' | 'ta';

type TranslationKey = string;
type TranslationNamespace = 'home' | 'common';

interface Translations {
  [locale: string]: {
    [namespace: string]: {
      [key: string]: string
    }
  }
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (namespace: TranslationNamespace, key: string) => string;
  availableLocales: Locale[];
}

const defaultTranslations: Translations = {
  en: {
    home: {
      title: 'Find the Perfect Loan for Your Needs',
      subtitle: 'Compare loans from multiple providers with a single application',
      startNow: 'Start Now',
      howItWorks: 'How It Works',
      trustBy: 'Trusted By Leading Banks and Financial Institutions',
      featuredLenders: 'Featured Lenders'
    },
    common: {
      login: 'Login',
      register: 'Register',
      apply: 'Apply',
      compare: 'Compare',
      myAccount: 'My Account',
      logout: 'Logout'
    }
  },
  zh: {
    home: {
      title: '找到满足您需求的完美贷款',
      subtitle: '通过单一申请比较多家提供商的贷款',
      startNow: '立即开始',
      howItWorks: '运作方式',
      trustBy: '受到领先银行和金融机构的信任',
      featuredLenders: '特色贷款机构'
    },
    common: {
      login: '登录',
      register: '注册',
      apply: '申请',
      compare: '比较',
      myAccount: '我的账户',
      logout: '登出'
    }
  },
  ms: {
    home: {
      title: 'Cari Pinjaman Sempurna untuk Keperluan Anda',
      subtitle: 'Bandingkan pinjaman dari pelbagai penyedia dengan satu permohonan',
      startNow: 'Mula Sekarang',
      howItWorks: 'Cara Ia Berfungsi',
      trustBy: 'Dipercayai Oleh Bank dan Institusi Kewangan Terkemuka',
      featuredLenders: 'Pemberi Pinjaman Pilihan'
    },
    common: {
      login: 'Log Masuk',
      register: 'Daftar',
      apply: 'Mohon',
      compare: 'Bandingkan',
      myAccount: 'Akaun Saya',
      logout: 'Log Keluar'
    }
  },
  ta: {
    home: {
      title: 'உங்கள் தேவைகளுக்கான சிறந்த கடனைக் கண்டறியவும்',
      subtitle: 'ஒரே விண்ணப்பத்துடன் பல வழங்குநர்களிடமிருந்து கடன்களை ஒப்பிடவும்',
      startNow: 'இப்போது தொடங்கு',
      howItWorks: 'இது எப்படி செயல்படுகிறது',
      trustBy: 'முன்னணி வங்கிகள் மற்றும் நிதி நிறுவனங்களால் நம்பப்படுகிறது',
      featuredLenders: 'சிறப்பு கடன் வழங்குநர்கள்'
    },
    common: {
      login: 'உள்நுழைய',
      register: 'பதிவு செய்ய',
      apply: 'விண்ணப்பி',
      compare: 'ஒப்பிடு',
      myAccount: 'எனது கணக்கு',
      logout: 'வெளியேறு'
    }
  }
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  
  const t = (namespace: TranslationNamespace, key: string): string => {
    try {
      return defaultTranslations[locale]?.[namespace]?.[key] || 
             defaultTranslations.en[namespace][key] || 
             key;
    } catch (error) {
      console.warn(`Translation missing: ${locale}.${namespace}.${key}`);
      return key;
    }
  };
  
  return (
    <I18nContext.Provider 
      value={{ 
        locale, 
        setLocale, 
        t,
        availableLocales: ['en', 'zh', 'ms', 'ta']
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
} 