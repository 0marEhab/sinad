import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface LineItem {
  id: string; // for React keys
  description: string;
  notes?: string;
  quantity: number;
  unitPrice: number;
}

interface LineItemRowProps {
  item: LineItem;
  onChange: (id: string, field: keyof LineItem, value: any) => void;
  onRemove: (id: string) => void;
}

export const LineItemRow = ({ item, onChange, onRemove }: LineItemRowProps) => {
  const { t } = useTranslation();
  const amount = (item.quantity * item.unitPrice).toFixed(3);

  return (
    <div className="group flex items-start gap-4 px-2 py-4 mb-2 rounded-xl hover:bg-gray-50/80 border border-transparent hover:border-gray-100 transition-all duration-300">
      {/* Description & Notes */}
      <div className="flex-1 space-y-3">
        <div className="relative">
          <input
            type="text"
            value={item.description}
            onChange={(e) => onChange(item.id, 'description', e.target.value)}
            placeholder={t('common.itemDesc')}
            className="w-full bg-transparent border-b border-gray-200 px-1 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div className="relative">
          <textarea
            value={item.notes || ''}
            onChange={(e) => onChange(item.id, 'notes', e.target.value)}
            placeholder={t('common.optionalNotes')}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-600 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none h-14"
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="w-20 pt-1">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onChange(item.id, 'quantity', Number(e.target.value))}
          min="1"
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
        />
      </div>

      {/* Unit Price */}
      <div className="w-32 relative pt-1">
        <input
          type="number"
          step="0.001"
          value={item.unitPrice || ''}
          onChange={(e) => onChange(item.id, 'unitPrice', Number(e.target.value))}
          placeholder="0.000"
          className="w-full bg-white border border-gray-200 rounded-lg ps-3 pe-10 py-2 text-sm text-end focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-mono"
        />
        <span className="absolute end-3 top-3.5 text-[10px] font-bold text-gray-400">KWD</span>
      </div>

      {/* Total */}
      <div className="w-28 text-end pe-4 font-mono font-medium text-gray-900 text-sm py-3">
        {amount}
      </div>

      {/* Remove Button */}
      <div className="w-8 flex justify-end py-2">
        <button
          onClick={() => onRemove(item.id)}
          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Remove Item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
