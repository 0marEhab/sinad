import { useState } from 'react';
import { Eye, Trash2, Banknote, AlertTriangle, Edit } from 'lucide-react';
import { Table } from '../ui/Table';
import { Dialog } from '../ui/Dialog';
import { InvoiceDetails } from './InvoiceDetails';
import { RecordPaymentDialog } from './RecordPaymentDialog';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  client: {
    clientName: string;
  };
  issueDate: string;
  total: string | number;
  amountPaid: string | number;
  balanceDue: string | number;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
}

interface InvoiceTableProps {
  invoices: InvoiceData[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const StatusBadge = ({ status }: { status: InvoiceData['status'] }) => {
  switch (status) {
    case 'PAID': return <span className="text-green-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">PAID</span>;
    case 'UNPAID': return <span className="text-red-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide">UNPAID</span>;
    case 'PARTIAL': return <span className="text-yellow-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">PARTIAL</span>;
    default: return null;
  }
}

export const InvoiceTable = ({ invoices, isLoading, currentPage, totalPages, totalCount, onPageChange, onRefresh }: InvoiceTableProps) => {
  const { t } = useTranslation();
  const headers = ['#', t('common.client'), t('common.dateIssued'), t('common.total'), t('common.paid'), t('common.remaining'), t('common.status'), t('common.actions')];
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceData | null>(null);
  const navigate = useNavigate();

  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 10;
  const start = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalCount);
  const paginationInfo = totalCount > 0 ? `${t('common.showing')} ${start} ${t('common.to')} ${end} ${t('common.of')} ${totalCount} ${t('common.entries')}` : '';

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/invoices/${invoiceToDelete.id}`);
      setInvoiceToDelete(null);
      onRefresh();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete invoice');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(',', ',\n');
  };

  return (
    <>
      <Table
        headers={headers}
        paginationInfo={paginationInfo}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      >
        {isLoading ? (
          <tr>
            <td colSpan={8} className="text-center py-10 text-gray-500">{t('common.loadingInvoices')}</td>
          </tr>
        ) : invoices.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-10 text-gray-500">{t('common.noInvoices')}</td>
          </tr>
        ) : (
          invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
              <td className="py-4 px-6 text-start font-mono text-gray-500 whitespace-pre">{invoice.invoiceNumber}</td>
              <td className="py-4 px-6 text-start font-semibold whitespace-pre">{invoice.client.clientName}</td>
              <td className="py-4 px-6 text-start text-gray-600 whitespace-pre">{formatDate(invoice.issueDate)}</td>
              <td className="py-4 px-6 text-start font-mono font-medium">
                {Number(invoice.total).toLocaleString(undefined, { minimumFractionDigits: 3 })} <span className="text-gray-400 font-sans text-xs ms-1">KWD</span>
              </td>
              <td className="py-4 px-6 text-start font-mono">{Number(invoice.amountPaid).toLocaleString(undefined, { minimumFractionDigits: 3 })}</td>
              <td className={`py-4 px-6 text-start font-mono ${Number(invoice.balanceDue) > 0 ? (invoice.status === 'UNPAID' ? 'text-red-600 font-medium' : '') : ''}`}>
                {Number(invoice.balanceDue).toLocaleString(undefined, { minimumFractionDigits: 3 })}
              </td>
              <td className="py-4 px-6 text-start">
                <StatusBadge status={invoice.status} />
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  {(invoice.status === 'PARTIAL' || invoice.status === 'UNPAID') && (
                    <button title="Record Payment" className="flex items-center" onClick={() => setPaymentInvoice(invoice)}>
                      <Banknote size={18} className="cursor-pointer hover:text-brand-dark" />
                    </button>
                  )}
                  <button title="Edit Invoice" className="flex items-center" onClick={() => navigate(`/edit-invoice/${invoice.id}`)}>
                    <Edit size={18} className="cursor-pointer hover:text-brand-dark" />
                  </button>
                  <button title="View Invoice" className="flex items-center" onClick={() => setSelectedInvoiceId(invoice.id)}>
                    <Eye size={18} className="cursor-pointer hover:text-brand-dark" />
                  </button>
                  <button title="Delete Invoice" className="flex items-center" onClick={() => setInvoiceToDelete(invoice)}>
                    <Trash2 size={18} className="cursor-pointer hover:text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </Table>

      <Dialog
        isOpen={!!selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        maxWidth="max-w-4xl"
      >
        {selectedInvoiceId && <InvoiceDetails invoiceId={selectedInvoiceId} />}
      </Dialog>

      {paymentInvoice && (
        <RecordPaymentDialog
          isOpen={!!paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          invoiceId={paymentInvoice.id}
          invoiceNumber={paymentInvoice.invoiceNumber}
          balanceDue={Number(paymentInvoice.balanceDue)}
          onSuccess={onRefresh}
        />
      )}

      <Dialog
        isOpen={!!invoiceToDelete}
        onClose={() => !isDeleting && setInvoiceToDelete(null)}
        title={t('common.deleteInvoice')}
        maxWidth="max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertTriangle size={24} />
            <p className="font-medium">{t('common.deleteConfirm')} {invoiceToDelete?.invoiceNumber}?</p>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {t('common.deleteWarning')}
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setInvoiceToDelete(null)}
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
              {isDeleting ? t('common.deleting') : t('common.deleteInvoice')}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
