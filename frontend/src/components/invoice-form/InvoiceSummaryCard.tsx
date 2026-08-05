import React from 'react';
import { useTranslation } from 'react-i18next';

interface InvoiceSummaryCardProps {
  subtotal: number;
  discount: number;
  setDiscount: (value: number) => void;
  taxRate: number;
  setTaxRate: (value: number) => void;
  total: number;
}

export const InvoiceSummaryCard = ({
  subtotal,
  discount,
  setDiscount,
  taxRate,
  setTaxRate,
  total,
}: InvoiceSummaryCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-brand-darker rounded-lg shadow-sm p-8 text-gray-400 font-mono text-sm space-y-6">
      <div className="flex justify-between items-center">
        <span>{t('common.subtotal')}:</span>
        <span className="w-24 text-end text-white">{subtotal.toFixed(3)}</span>
      </div>

      <div className="flex justify-between items-center">
        <span>{t('common.discount')}:</span>
        <input
          type="number"
          step="0.001"
          min="0"
          value={discount || ''}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-24 bg-white text-black rounded px-2 py-1 text-end text-sm focus:outline-none"
        />
      </div>

      <div className="flex justify-between items-center">
        <span>{t('common.tax')} (%):</span>
        <input
          type="number"
          min="0"
          value={taxRate || ''}
          onChange={(e) => setTaxRate(Number(e.target.value))}
          className="w-24 bg-white text-black rounded px-2 py-1 text-end text-sm focus:outline-none"
        />
      </div>

      <hr className="border-gray-700/50 my-4" />

      <div className="flex justify-between items-center font-bold text-white text-lg">
        <span>{t('common.total')}:</span>
        <span>{total.toFixed(3)} KWD</span>
      </div>
    </div>
  );
};
