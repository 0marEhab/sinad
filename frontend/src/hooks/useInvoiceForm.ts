import { useState, useEffect, useMemo } from 'react';
import { api } from '../utils/api';
import type { LineItem } from '../components/invoice-form/LineItemRow';
import {
  generateId,
  getTodayDateString,
  getDefaultDueDateString,
  validateInvoiceForm,
  buildInvoicePayload
} from '../utils/invoiceUtils';

export interface UseInvoiceFormProps {
  invoiceId?: string;
  onSuccess?: () => void;
}

export const useInvoiceForm = ({ invoiceId, onSuccess }: UseInvoiceFormProps = {}) => {
  const [clients, setClients] = useState<any[]>([]);
  const [isFetchingClients, setIsFetchingClients] = useState(true);
  const [isFetchingInvoice, setIsFetchingInvoice] = useState(!!invoiceId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [clientId, setClientId] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [projectName, setProjectName] = useState('');
  const [issueDate, setIssueDate] = useState(getTodayDateString());
  const [dueDate, setDueDate] = useState(getDefaultDueDateString());
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: generateId(), description: '', notes: '', quantity: 1, unitPrice: 0 }
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [notes, setNotes] = useState('');


  const subtotal = useMemo(() =>
    lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
    [lineItems]);
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const total = subtotal - discount + taxAmount;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await api.get('/clients?limit=100');
        setClients(data.data);
      } catch (err) {
        console.error('Failed to fetch clients', err);
      } finally {
        setIsFetchingClients(false);
      }
    };

    const fetchInvoice = async () => {
      if (!invoiceId) return;
      try {
        const { data } = await api.get(`/invoices/${invoiceId}`);
        setClientId(data.clientId);
        setSelectedClient(data.client);
        setProjectName(data.projectName || '');
        setIssueDate(data.issueDate.split('T')[0]);
        setDueDate(data.dueDate.split('T')[0]);
        setDiscount(Number(data.discount));
        setTaxRate(Number(data.taxRate));
        setNotes(data.notes || '');
        setLineItems(data.lineItems.map((item: any) => ({
          id: item.id || generateId(),
          description: item.description,
          notes: item.notes || '',
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })));
      } catch (err) {
        console.error('Failed to fetch invoice', err);
        setError('Failed to load invoice details.');
      } finally {
        setIsFetchingInvoice(false);
      }
    };

    if (invoiceId) {
      fetchClients().then(() => fetchInvoice());
    } else {
      fetchClients();
    }
  }, [invoiceId]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    setClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(items => items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addLineItem = () => {
    setLineItems(items => [...items, { id: generateId(), description: '', notes: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(items => items.filter(item => item.id !== id));
  };

  const submit = async (apiCall: (payload: any) => Promise<any>) => {
    setError(null);
    const validationError = validateInvoiceForm(clientId, lineItems);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildInvoicePayload({
        clientId, issueDate, dueDate, projectName, discount, taxRate, notes, lineItems
      });
      await apiCall(payload);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    clients,
    isFetchingClients,
    isFetchingInvoice,
    isSubmitting,
    error,

    // Form fields
    clientId,
    selectedClient,
    projectName,
    setProjectName,
    issueDate,
    setIssueDate,
    dueDate,
    setDueDate,
    lineItems,
    discount,
    setDiscount,
    taxRate,
    setTaxRate,
    notes,
    setNotes,

    // Derived state
    subtotal,
    total,

    // Handlers
    handleClientChange,
    handleLineItemChange,
    addLineItem,
    removeLineItem,
    submit
  };
};
