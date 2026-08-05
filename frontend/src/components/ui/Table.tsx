import React from 'react';
import { useTranslation } from 'react-i18next';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  paginationInfo?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const Table = ({ headers, children, paginationInfo, currentPage = 1, totalPages = 1, onPageChange }: TableProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-start border-collapse">
        <thead>
          <tr className="bg-[#1B1F3B] text-white">
            {headers.map((header, idx) => (
              <th key={idx} className={`py-4 px-6 font-medium whitespace-nowrap ${idx === headers.length - 1 ? 'text-end' : 'text-start'}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-[#1B1F3B]">
          {children}
        </tbody>
      </table>

      {/* Pagination Container */}
      {paginationInfo && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-gray-500">
          <div>
            {paginationInfo}
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.prev')}
            </button>
            <button className="px-3 py-1.5 border border-[#1B1F3B] rounded bg-[#1B1F3B] text-white">
              {currentPage}
            </button>
            <button 
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
