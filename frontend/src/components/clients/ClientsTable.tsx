import { Table } from '../ui/Table';
import { Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ClientData {
  id: string;
  clientName: string;
  companyName: string | null;
  contactPerson: string | null;
  phoneNumber: string | null;
  totalInvoices: number;
  outstandingBalance: string | number;
}

interface ClientsTableProps {
  clients: ClientData[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onEdit: (client: ClientData) => void;
  onDelete: (client: ClientData) => void;
}

export const ClientsTable = ({ clients, currentPage, totalPages, totalCount, onPageChange, isLoading, onEdit, onDelete }: ClientsTableProps) => {
  const { t } = useTranslation();
  const headers = [t('common.clientName'), t('common.companyNameHeader'), t('common.contactPerson'), t('common.phoneNumber'), t('common.totalInvoices'), t('common.outstandingBalance'), t('common.actions')];

  const limit = 10;
  const start = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalCount);
  const paginationInfo = totalCount > 0 ? `${t('common.showing')} ${start} ${t('common.to')} ${end} ${t('common.of')} ${totalCount} ${t('common.entries')}` : '';

  return (
    <Table
      headers={headers}
      paginationInfo={paginationInfo}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    >
      {isLoading ? (
        <tr>
          <td colSpan={7} className="text-center py-10 text-gray-500">{t('common.loadingClientsMsg')}</td>
        </tr>
      ) : clients.length === 0 ? (
        <tr>
          <td colSpan={7} className="text-center py-10 text-gray-500">{t('common.noClientsFound')}</td>
        </tr>
      ) : (
        clients.map((client) => (
          <tr key={client.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
            <td className="py-5 px-6 text-start font-semibold text-text-table">{client.clientName}</td>
            <td className="py-5 px-6 text-start text-gray-500">{client.companyName || '-'}</td>
            <td className="py-5 px-6 text-start text-gray-600">{client.contactPerson || '-'}</td>
            <td className="py-5 px-6 text-start font-mono text-gray-600 text-xs">{client.phoneNumber || '-'}</td>
            <td className="py-5 px-6 text-start">
              <span className="bg-accent-light text-accent px-2.5 py-1 rounded text-xs font-semibold">{client.totalInvoices}</span>
            </td>
            <td className={`py-5 px-6 text-start font-mono font-medium text-xs ${Number(client.outstandingBalance) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {Number(client.outstandingBalance).toLocaleString(undefined, { minimumFractionDigits: 3 })} <span className={Number(client.outstandingBalance) > 0 ? 'text-red-500 font-sans ms-1' : 'text-emerald-500 font-sans ms-1'}>KWD</span>
            </td>
            <td className="py-5 px-6 text-start">
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => onEdit(client)}
                  className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent-light rounded transition-colors"
                  title="Edit Client"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(client)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete Client"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </Table>
  );
};
