import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import { InvoiceFormLayout } from '../components/invoice-form/InvoiceFormLayout';
import { ClientInfoCard } from '../components/invoice-form/ClientInfoCard';
import { ProjectDetailsCard } from '../components/invoice-form/ProjectDetailsCard';
import { LineItemsCard } from '../components/invoice-form/LineItemsCard';
import { InvoiceSummaryCard } from '../components/invoice-form/InvoiceSummaryCard';
import { NotesCard } from '../components/invoice-form/NotesCard';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const form = useInvoiceForm({
    onSuccess: () => navigate('/')
  });

  const handleSubmit = () => {
    form.submit((payload) => api.post('/invoices', payload));
  };

  return (
    <InvoiceFormLayout
      title={t('common.createNewInvoice')}
      isSubmitting={form.isSubmitting}
      isFetchingInvoice={form.isFetchingInvoice}
      error={form.error}
      onSubmit={handleSubmit}
      submitButtonText={form.isSubmitting ? t('common.publishing') : t('common.publish')}
    >
      <div className="w-full lg:w-[65%] space-y-6">
        <ClientInfoCard
          clients={form.clients}
          clientId={form.clientId}
          selectedClient={form.selectedClient}
          isFetchingClients={form.isFetchingClients}
          onClientChange={form.handleClientChange}
        />
        <ProjectDetailsCard
          projectName={form.projectName}
          setProjectName={form.setProjectName}
          issueDate={form.issueDate}
          setIssueDate={form.setIssueDate}
          dueDate={form.dueDate}
          setDueDate={form.setDueDate}
        />
        <LineItemsCard
          lineItems={form.lineItems}
          onChange={form.handleLineItemChange}
          onRemove={form.removeLineItem}
          onAdd={form.addLineItem}
        />
      </div>

      <div className="w-full lg:w-[35%] space-y-6">
        <InvoiceSummaryCard
          subtotal={form.subtotal}
          discount={form.discount}
          setDiscount={form.setDiscount}
          taxRate={form.taxRate}
          setTaxRate={form.setTaxRate}
          total={form.total}
        />
        <NotesCard
          notes={form.notes}
          setNotes={form.setNotes}
        />
      </div>
    </InvoiceFormLayout>
  );
};

export default CreateInvoice;
