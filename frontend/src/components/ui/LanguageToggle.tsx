import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-sm text-brand-primary hover:bg-black/5 transition-colors"
    >
      <Languages size={16} />
      <span>{i18n.language === 'en' ? 'عربي' : 'English'}</span>
    </button>
  );
};
