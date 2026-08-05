import { useNavigate } from 'react-router-dom';
import {
  FileText, LayoutGrid, FilePlus, Users, LogOut
} from 'lucide-react';
import { SidebarLink } from './SidebarLink';
import { api } from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <aside className="w-64 bg-brand-dark flex flex-col justify-between shrink-0">
      <div>

        <div className="h-20 flex items-center px-6 gap-3 text-white">
          <div className="bg-white/10 p-2 rounded">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">SINAD</h1>
          </div>
        </div>


        <nav className="px-4 mt-4 space-y-1">
          <SidebarLink icon={<LayoutGrid size={18} />} label={t('nav.dashboard')} to="/" />
          <SidebarLink icon={<FilePlus size={18} />} label={t('nav.newInvoice')} to="/create-invoice" />
          <SidebarLink icon={<Users size={18} />} label={t('nav.clients')} to="/clients" />
        </nav>


      </div>

      <div className="p-4 space-y-1 mb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded transition-colors text-gray-400 hover:text-white text-left rtl:text-right"
        >
          <LogOut size={18} className="rtl:rotate-180" />
          {t('common.logout')}
        </button>
      </div>
    </aside>
  );
};
