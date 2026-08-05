import { useTranslation } from 'react-i18next';
import { InvoiceCard } from './InvoiceCard';

interface ProjectDetailsCardProps {
  projectName: string;
  setProjectName: (name: string) => void;
  issueDate: string;
  setIssueDate: (date: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
}

export const ProjectDetailsCard = ({
  projectName,
  setProjectName,
  issueDate,
  setIssueDate,
  dueDate,
  setDueDate,
}: ProjectDetailsCardProps) => {
  const { t } = useTranslation();

  return (
    <InvoiceCard title={t('common.projectDetails')}>
      <div className="mb-5">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{t('common.projectName')}</label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder={t('common.projectDesc')}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{t('common.dateIssued')}</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{t('common.dueDate')}</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>
    </InvoiceCard>
  );
};
