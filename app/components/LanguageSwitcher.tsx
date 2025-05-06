'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState('en');

  const localeNames: Record<string, string> = {
    'en': 'English',
    'zh': '中文',
    'ms': 'Bahasa Melayu',
    'ta': 'தமிழ்'
  };

  const availableLocales = ['en', 'zh', 'ms', 'ta'];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleDropdown}
        className="text-sm"
      >
        <span className="mr-1">{localeNames[locale]}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
          {availableLocales.map((l) => (
            <button
              key={l}
              onClick={() => handleLocaleChange(l)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${l === locale ? 'bg-gray-50 font-medium' : ''}`}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 