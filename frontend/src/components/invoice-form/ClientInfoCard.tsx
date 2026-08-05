import React from 'react';
import { useTranslation } from 'react-i18next';
import { InvoiceCard } from './InvoiceCard';

interface ClientInfoCardProps {
  clients: any[];
  clientId: string;
  selectedClient: any;
  isFetchingClients: boolean;
  onClientChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const ClientInfoCard = ({
  clients,
  clientId,
  selectedClient,
  isFetchingClients,
  onClientChange,
}: ClientInfoCardProps) => {
  const { t } = useTranslation();

  return (
    <InvoiceCard title={t('common.clientInfo')}>
      <div className="mb-5">
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
          {t('common.selectClient')}
        </label>
        <select
          value={clientId}
          onChange={onClientChange}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
          disabled={isFetchingClients}
        >
          <option value="">{isFetchingClients ? t('common.loadingClients') : t('common.chooseClient')}</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.clientName} {client.companyName ? `(${client.companyName})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{t('common.companyName')}</label>
          <input
            disabled
            value={selectedClient?.companyName || ''}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{t('common.email')}</label>
          <input
            disabled
            value={selectedClient?.email || ''}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{t('common.phoneNumber')}</label>
          <input
            disabled
            value={selectedClient?.phoneNumber || ''}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>
    </InvoiceCard>
  );
};
