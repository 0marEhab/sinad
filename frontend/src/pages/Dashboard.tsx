import { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { InvoiceTable } from '../components/dashboard/InvoiceTable';
import type { InvoiceData } from '../components/dashboard/InvoiceTable';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/invoices', {
        params: {
          page: currentPage,
          limit: 10,
          search: debouncedSearch,
          status: statusFilter !== 'ALL' ? statusFilter : undefined
        }
      });
      setInvoices(data.data);
      setTotalPages(data.meta.totalPages);
      setTotalCount(data.meta.total);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, debouncedSearch, statusFilter]);

  return (
    <>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark mb-1">{t('common.dashboardTitle')}</h2>
          <p className="text-gray-500 text-base">{t('common.dashboardDesc')}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
              className="w-full ps-9 pe-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-brand-dark"
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none w-full bg-white border border-gray-300 rounded ps-4 pe-10 py-2 focus:outline-none focus:border-brand-dark cursor-pointer"
            >
              <option value="">{t('common.allStatuses')}</option>
              <option value="UNPAID">{t('common.unpaid')}</option>
              <option value="PARTIAL">{t('common.partial')}</option>
              <option value="PAID">{t('common.paid')}</option>
            </select>
            <div className="absolute inset-y-0 end-0 pe-3 flex items-center pointer-events-none">
              <ChevronDown size={16} className="text-brand-dark" />
            </div>
          </div>

          {/* Create Invoice Button */}
          <Link to="/create-invoice" className="flex items-center justify-center gap-2 bg-brand-primary text-white px-5 py-2 rounded font-medium hover:bg-opacity-90 transition-colors w-full sm:w-auto shrink-0">
            <Plus size={18} />
            {t('common.createNewInvoice')}
          </Link>
        </div>
      </div>

      <InvoiceTable
        invoices={invoices}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
        onRefresh={fetchInvoices}
      />
    </>
  );
};

export default Dashboard;
