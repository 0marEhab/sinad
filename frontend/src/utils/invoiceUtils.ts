import type { LineItem } from '../components/invoice-form/LineItemRow';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const getDefaultDueDateString = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};

export const validateInvoiceForm = (clientId: string, lineItems: LineItem[]): string | null => {
  if (!clientId) {
    return 'Please select a client.';
  }

  const invalidItems = lineItems.filter(item => !item.description.trim() || item.unitPrice <= 0);
  if (invalidItems.length > 0) {
    return 'Please ensure all line items have a description and a valid unit price.';
  }

  return null;
};

export const buildInvoicePayload = (formState: {
  clientId: string;
  issueDate: string;
  dueDate: string;
  projectName: string;
  discount: number;
  taxRate: number;
  notes: string;
  lineItems: LineItem[];
}) => {
  return {
    clientId: formState.clientId,
    issueDate: new Date(formState.issueDate).toISOString(),
    dueDate: new Date(formState.dueDate).toISOString(),
    projectName: formState.projectName.trim() || undefined,
    discount: formState.discount,
    taxRate: formState.taxRate,
    notes: formState.notes.trim() || undefined,
    lineItems: formState.lineItems.map(item => ({
      description: item.description,
      notes: item.notes?.trim() || undefined,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
  };
};
