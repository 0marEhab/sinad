import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InvoiceFormLayoutProps {
  title: string;
  isSubmitting: boolean;
  isFetchingInvoice?: boolean;
  error: string | null;
  onSubmit: () => void;
  submitButtonText: string;
  children: React.ReactNode;
}

export const InvoiceFormLayout = ({
  title,
  isSubmitting,
  isFetchingInvoice = false,
  error,
  onSubmit,
  submitButtonText,
  children,
}: InvoiceFormLayoutProps) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-[1200px] mx-auto text-gray-900 pb-12">
      {isFetchingInvoice ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <div className="flex gap-3">
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-black text-white rounded font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {submitButtonText}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {children}
          </div>
        </>
      )}
    </div>
  );
};
