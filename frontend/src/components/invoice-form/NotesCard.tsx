import React from 'react';
import { useTranslation } from 'react-i18next';
import { InvoiceCard } from './InvoiceCard';

interface NotesCardProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const NotesCard = ({ notes, setNotes }: NotesCardProps) => {
  const { t } = useTranslation();

  return (
    <InvoiceCard>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">
        {t('common.additionalNotes')}
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none h-28"
      ></textarea>
    </InvoiceCard>
  );
};
