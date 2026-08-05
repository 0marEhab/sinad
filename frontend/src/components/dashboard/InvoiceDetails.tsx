import { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { api } from '../../utils/api';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';

interface InvoiceDetailsProps {
  invoiceId: string;
}

export const InvoiceDetails = ({ invoiceId }: InvoiceDetailsProps) => {
  const { t, i18n } = useTranslation();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);
    try {
      const element = invoiceRef.current;
      const imgData = await toPng(element, {
        pixelRatio: 2,
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (element.scrollHeight * pdfWidth) / element.scrollWidth;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (error: any) {
      console.error('Error generating PDF', error);
      alert('Error generating PDF: ' + (error.message || 'Unknown error'));
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await api.get(`/invoices/${invoiceId}`);
        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice details', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">{t('common.loading')}</div>;
  }

  if (!invoice) {
    return <div className="p-10 text-center text-red-500">{t('common.error')}</div>;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-100 text-emerald-700';
      case 'UNPAID': return 'bg-red-100 text-red-700';
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-surface-invoice py-8 px-4 sm:px-8 font-sans text-gray-800 rounded-b-2xl">

      {/* Top Action Bar */}
      <div className="max-w-[800px] mx-auto flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className={`${getStatusColor(invoice.status)} px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase`}>
            {invoice.status}
          </span>
          <span className="text-gray-500 text-sm font-medium">Invoice #{invoice.invoiceNumber}</span>
        </div>
        <div className="flex items-center gap-3">

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-black transition-all shadow-md shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed">
            <Download size={16} />
            {isDownloading ? t('common.loading') : t('common.downloadPDF')}
          </button>
        </div>
      </div>

      {/* A4 Invoice Container */}
      <div ref={invoiceRef} className="max-w-[800px] mx-auto bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-8 sm:p-14 mb-10 relative overflow-hidden ">

        <div className="flex justify-between items-start mb-16 mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{t('common.invoice')}</h1>
            <p className="text-gray-400 text-sm font-mono">{invoice.invoiceNumber}</p>
          </div>

          <div className="text-end text-sm text-gray-500 space-y-1.5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">SINAD Systems</h2>
            <p>Al Hamra Tower, 45th Floor</p>
            <p>Kuwait City, Kuwait</p>
            <p className="text-gray-400 mt-2">info@sinadsystems.com.kw</p>
            <p className="text-gray-400">+965 2222 3333</p>
          </div>
        </div>

        {/* Billing & Project Details */}
        <div className="flex justify-between items-start mb-14 bg-gray-50/50 p-6 rounded-xl border border-gray-50">
          {/* Billed To */}
          <div className="text-sm">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">{t('common.billedTo')}</h3>
            <p className="font-bold text-gray-900 mb-1 text-base">{invoice.client.clientName}</p>
            {invoice.client.companyName && <p className="text-gray-500 mb-1">{invoice.client.companyName}</p>}
            {invoice.client.phoneNumber && <p className="text-gray-500 mb-2">{invoice.client.phoneNumber}</p>}
            <p className="text-brand-primary font-medium">{invoice.client.email}</p>
          </div>

          {/* Dates & Project */}
          <div className="text-sm grid grid-cols-2 gap-x-12 gap-y-6 text-end">
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('common.dateIssued')}</h3>
              <p className="font-semibold text-gray-900">{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('common.dueDate')}</h3>
              <p className="font-semibold text-gray-900">{formatDate(invoice.dueDate)}</p>
            </div>
            <div className="col-span-2">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('common.project')}</h3>
              <p className="font-semibold text-brand-primary">{invoice.projectName || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="mb-10 overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm text-start">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold tracking-wider">
                <th className="py-4 px-6 uppercase">{t('common.description')}</th>
                <th className="py-4 px-6 uppercase text-end">{t('common.unitPrice')}</th>
                <th className="py-4 px-6 uppercase text-end">{t('common.qty')}</th>
                <th className="py-4 px-6 uppercase text-end">{t('common.amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lineItems.map((item: any) => (
                <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-6">
                    <p className="font-bold text-gray-900 mb-1">{item.description}</p>
                    {item.notes && <p className="text-gray-500 text-xs leading-relaxed whitespace-pre-line">{item.notes}</p>}
                  </td>
                  <td className="py-5 px-6 font-mono text-end text-gray-600">{Number(item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 3 })}</td>
                  <td className="py-5 px-6 font-mono text-end text-gray-600">{Number(item.quantity).toLocaleString()}</td>
                  <td className="py-5 px-6 font-mono text-end font-bold text-gray-900">{Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 3 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-16">
          <div className="w-full  bg-gray-50/50 rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{t('common.subtotal')}</span>
                <span className="font-mono font-medium text-gray-900">{Number(invoice.subtotal).toLocaleString(undefined, { minimumFractionDigits: 3 })} <span className="font-sans text-[10px] uppercase tracking-wider ms-1 text-gray-400">KWD</span></span>
              </div>

              {Number(invoice.discount) > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{t('common.discount')}</span>
                  <span className="font-mono font-medium text-red-500">-{Number(invoice.discount).toLocaleString(undefined, { minimumFractionDigits: 3 })} <span className="font-sans text-[10px] uppercase tracking-wider ms-1">KWD</span></span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-500">
                <span>{t('common.tax')} ({invoice.taxRate}%)</span>
                <span className="font-mono font-medium text-gray-900">{((Number(invoice.subtotal) - Number(invoice.discount)) * (Number(invoice.taxRate) / 100)).toLocaleString(undefined, { minimumFractionDigits: 3 })} <span className="font-sans text-[10px] uppercase tracking-wider ms-1 text-gray-400">KWD</span></span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200/60 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-900 text-base">{t('common.total')}</span>
                <span className="font-mono font-bold text-gray-900 text-xl">{Number(invoice.total).toLocaleString(undefined, { minimumFractionDigits: 3 })} <span className="font-sans text-xs ms-1 text-gray-500">KWD</span></span>
              </div>

              {Number(invoice.amountPaid) > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>{t('common.amountPaid')}</span>
                  <span className="font-mono font-bold text-emerald-600">-{Number(invoice.amountPaid).toLocaleString(undefined, { minimumFractionDigits: 3 })} <span className="font-sans text-[10px] uppercase tracking-wider ms-1 opacity-70">KWD</span></span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center p-5 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-dark rounded-xl shadow-xl shadow-brand-primary/20 ring-1 ring-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col gap-1">
                <span className="text-white/70 text-xs font-medium uppercase tracking-wider">{t('common.balanceDue')}</span>
                <span className="font-mono font-bold text-white text-2xl tracking-tight">
                  {Number(invoice.balanceDue).toLocaleString(undefined, { minimumFractionDigits: 3 })}
                  <span className="font-sans text-xs ms-1.5 text-white/50 font-normal tracking-normal">KWD</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="pt-8 pb-8 border-t border-gray-100">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('common.paymentHistory')}</h3>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm text-start">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-bold tracking-wider">
                    <th className="py-4 px-6 uppercase">{t('common.date')}</th>
                    <th className="py-4 px-6 uppercase">{t('common.method')}</th>
                    <th className="py-4 px-6 uppercase text-end">{t('common.amount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-center divide-gray-100">
                  {invoice.payments.map((payment: any) => (
                    <tr key={payment.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{formatDate(payment.paidAt)}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {payment.method.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-end font-bold text-gray-900">
                        {Number(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 3 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


      </div>

    </div>
  );
};
