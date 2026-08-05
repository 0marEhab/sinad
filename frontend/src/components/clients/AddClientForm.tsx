import React, { useState, useEffect } from 'react';
import { InputField } from '../ui/InputField';
import { Building2, Mail, Phone, User, MapPin } from 'lucide-react';
import { api } from '../../utils/api';
import { Alert } from '../ui/Alert';
import { useTranslation } from 'react-i18next';

interface ClientFormProps {
  initialData?: any;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const AddClientForm = ({ initialData, onCancel, onSuccess }: ClientFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        clientName: initialData.clientName || '',
        companyName: initialData.companyName || '',
        contactPerson: initialData.contactPerson || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        address: initialData.address || ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (initialData) {
        await api.patch(`/clients/${initialData.id}`, formData);
      } else {
        await api.post('/clients', formData);
      }
      onSuccess?.();
    } catch (err: any) {
      if (err.response?.data?.message) {
        // Handle array of messages (validation errors) or single string
        const msg = err.response.data.message;
        setError(Array.isArray(msg) ? msg[0] : msg);
      } else {
        setError(`Failed to ${initialData ? 'update' : 'create'} client. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="p-6" onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4">
          <Alert message={error} />
        </div>
      )}

      <div className="md:gap-x-6">
        <InputField
          label={t('common.clientOrCompanyReq')}
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          placeholder="e.g. Zain Telecommunications"
          icon={<Building2 size={16} className="text-gray-400" />}
          required
          autoFocus
        />
        <InputField
          label={t('common.companyNameHeader')}
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="e.g. Zain Group"
          icon={<Building2 size={16} className="text-gray-400" />}
        />
        <InputField
          label={t('common.contactPerson')}
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          placeholder="e.g. Faisal Al-Rashed"
          icon={<User size={16} className="text-gray-400" />}
        />
        <InputField
          label={t('common.emailReq')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="contact@company.com"
          icon={<Mail size={16} className="text-gray-400" />}
          required
        />
        <InputField
          label={t('common.phoneNumber')}
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+965 0000 0000"
          icon={<Phone size={16} className="text-gray-400" />}
        />
        <InputField
          label={t('common.address')}
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g. Al Hamra Tower, Kuwait City"
          icon={<MapPin size={16} className="text-gray-400" />}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-[#050A22] text-white rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-md shadow-[#050A22]/20 disabled:opacity-50"
        >
          {isSubmitting ? t('common.saving') : initialData ? t('common.updateClient') : t('common.saveClient')}
        </button>
      </div>
    </form>
  );
};
