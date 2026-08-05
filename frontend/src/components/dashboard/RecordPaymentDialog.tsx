import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { api } from '../../utils/api';
import { Loader2 } from 'lucide-react';

interface RecordPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  invoiceNumber: string;
  balanceDue: number;
  onSuccess: () => void;
}

export const RecordPaymentDialog = ({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
  balanceDue,
  onSuccess,
}: RecordPaymentDialogProps) => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState('BANK_TRANSFER');
  const [reference, setReference] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post(`/invoices/${invoiceId}/payments`, {
        amount: Number(amount),
        method,
        reference,
        paidAt: new Date(paidAt).toISOString(),
        notes,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Record Payment for ${invoiceNumber}`}>
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Max: {balanceDue.toLocaleString()} KWD)
            </label>
            <input
              type="number"
              required
              step="0.001"
              max={balanceDue}
              min="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent transition-all outline-none"
              placeholder="0.000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent transition-all outline-none bg-white"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="KNET">KNET</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference (Optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Transaction ID"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent transition-all outline-none resize-none"
              placeholder="Any additional information..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[#1B1F3B] text-white rounded-lg text-sm font-medium hover:bg-[#2a2f55] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Record Payment'
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
