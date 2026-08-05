import { useState, useEffect } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { ClientsTable } from '../components/clients/ClientsTable';
import type { ClientData } from '../components/clients/ClientsTable';
import { Dialog } from '../components/ui/Dialog';
import { AddClientForm } from '../components/clients/AddClientForm';
import { api } from '../utils/api';
import { useTranslation } from 'react-i18next';

const Clients = () => {
  const { t } = useTranslation();
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  const [clientToDelete, setClientToDelete] = useState<ClientData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');


  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/clients', {
        params: {
          page: currentPage,
          limit: 10,
          search: debouncedSearch,
        }
      });
      setClients(data.data);
      setTotalPages(data.meta.totalPages);
      setTotalCount(data.meta.total);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage, debouncedSearch]);

  const handleClientSaved = () => {
    setIsClientFormOpen(false);
    setSelectedClient(null);
    fetchClients();
  };

  const openAddForm = () => {
    setSelectedClient(null);
    setIsClientFormOpen(true);
  };

  const openEditForm = (client: ClientData) => {
    setSelectedClient(client);
    setIsClientFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/clients/${clientToDelete.id}`);
      setClientToDelete(null);
      fetchClients();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete client');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-text-page-title mb-1">{t('common.clientsTitle')}</h1>
          <p className="text-gray-500 text-sm">{t('common.clientsDesc')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('common.searchClients')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand-deep focus:ring-1 focus:ring-brand-deep transition-all"
            />
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-deep text-white rounded-lg font-medium hover:bg-brand-deep/90 transition-all text-sm shadow-md shadow-brand-deep/20 w-full sm:w-auto shrink-0"
          >
            <Plus size={18} />
            {t('common.addNewClient')}
          </button>
        </div>
      </div>

      <ClientsTable
        clients={clients}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
        onEdit={openEditForm}
        onDelete={(client) => setClientToDelete(client)}
      />

      <Dialog
        isOpen={isClientFormOpen}
        onClose={() => setIsClientFormOpen(false)}
        title={selectedClient ? t('common.editClient') : t('common.addNewClient')}
        maxWidth="max-w-2xl"
      >
        <AddClientForm
          initialData={selectedClient}
          onCancel={() => setIsClientFormOpen(false)}
          onSuccess={handleClientSaved}
        />
      </Dialog>

      <Dialog
        isOpen={!!clientToDelete}
        onClose={() => !isDeleting && setClientToDelete(null)}
        title={t('common.deleteClient')}
        maxWidth="max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertTriangle size={24} />
            <p className="font-medium">{t('common.deleteConfirm')} {clientToDelete?.clientName}?</p>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {t('common.deleteClientWarning')}
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setClientToDelete(null)}
              disabled={isDeleting}
              className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-md shadow-red-600/20 disabled:opacity-50"
            >
              {isDeleting ? t('common.deleting') : t('common.deleteClient')}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Clients;
