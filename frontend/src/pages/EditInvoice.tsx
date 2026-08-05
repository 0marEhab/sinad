import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import { InvoiceFormLayout } from '../components/invoice-form/InvoiceFormLayout';
import { ClientInfoCard } from '../components/invoice-form/ClientInfoCard';
import { ProjectDetailsCard } from '../components/invoice-form/ProjectDetailsCard';
import { LineItemsCard } from '../components/invoice-form/LineItemsCard';
import { InvoiceSummaryCard } from '../components/invoice-form/InvoiceSummaryCard';
import { NotesCard } from '../components/invoice-form/NotesCard';

const EditInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const form = useInvoiceForm({
    invoiceId: id,
    onSuccess: () => navigate('/')
  });

  const handleSubmit = () => {
    form.submit((payload) => api.patch(`/invoices/${id}`, payload));
  };

  return (
    <InvoiceFormLayout
      title="Edit Invoice"
      isSubmitting={form.isSubmitting}
      isFetchingInvoice={form.isFetchingInvoice}
      error={form.error}
      onSubmit={handleSubmit}
      submitButtonText={form.isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default EditInvoice;
