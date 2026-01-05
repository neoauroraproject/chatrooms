import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../utils/i18n';

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

export default function LanguageToggle({ currentLanguage, onLanguageChange, className = '' }: LanguageToggleProps) {
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => onLanguageChange(currentLanguage === 'en' ? 'fa' : 'en')}
        className="flex items-center space-x-2 hover:bg-white/20 p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
        title={currentLanguage === 'en' ? 'Switch to Persian' : 'Switch to English'}
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">
          {currentLanguage === 'en' ? 'فا' : 'EN'}
        </span>
      </button>
    </div>
  );
}