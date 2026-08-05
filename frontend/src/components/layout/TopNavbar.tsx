import { User, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';

export const TopNavbar = () => {
  const { user } = useAuthStore();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="h-16 bg-surface-navbar border-b border-gray-200 flex items-center justify-end px-8 shrink-0">
      <div className="flex items-center gap-6 text-brand-dark">
        <button
          onClick={toggleLanguage}
          className="font-medium text-sm flex items-center gap-2 hover:bg-gray-200 px-4 py-4 rounded-2xl hover:text-brand-primary transition-colors"
        >
          <Globe size={16} />
          {i18n.language === 'ar' ? 'English' : 'عربي'}
        </button>
        <div className="flex items-center gap-3">
          <span className="font-medium text-sm">{user?.name}</span>
          <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer">
            <User size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};
