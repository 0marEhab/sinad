import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle } from 'lucide-react';
import { InvoiceCard } from './InvoiceCard';
import { LineItemRow } from './LineItemRow';
import type { LineItem } from './LineItemRow';

interface LineItemsCardProps {
  lineItems: LineItem[];
  onChange: (id: string, field: keyof LineItem, value: any) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export const LineItemsCard = ({
  lineItems,
  onChange,
  onRemove,
  onAdd,
}: LineItemsCardProps) => {
  const { t } = useTranslation();

  return (
    <InvoiceCard title={t('common.lineItems')}>
      {/* Table Header */}
      <div className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider px-2 py-3 flex items-center mb-2 rounded-lg border border-gray-100">
        <div className="flex-1 text-start ps-1">{t('common.description')}</div>
        <div className="w-20 text-center">{t('common.qty')}</div>
        <div className="w-32 text-start ps-3">{t('common.unitPrice')}</div>
        <div className="w-28 text-end pe-4">{t('common.totalKwd')}</div>
        <div className="w-8"></div>
      </div>

      {lineItems.map((item) => (
        <LineItemRow
          key={item.id}
          item={item}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}

      <hr className="border-gray-100 mb-6 mt-4" />

      {/* Add Item Button */}
      <div className="px-2">
        <button
          onClick={onAdd}
          className="group flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300"
        >
          <PlusCircle size={18} className="text-gray-400 group-hover:text-black transition-colors" />
          {t('common.addLineItem')}
        </button>
      </div>
    </InvoiceCard>
  );
};
