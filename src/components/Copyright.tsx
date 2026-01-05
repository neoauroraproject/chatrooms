import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface CopyrightProps {
  className?: string;
}

export default function Copyright({ className = '' }: CopyrightProps) {
  const { t, rtl } = useLanguage();

  return (
    <div className={`text-center text-xs text-gray-500 ${className}`} dir={rtl ? 'rtl' : 'ltr'}>
      <p className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
        © 2024 • {t.poweredBy}
      </p>
    </div>
  );
}