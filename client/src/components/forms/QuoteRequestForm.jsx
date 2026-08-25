import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import CustomSelect from '../ui/CustomSelect.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const productOptions = [
  { value: '', label: 'Product interest (optional)' },
  { value: 'sterifast-device', label: 'SteriFast device' },
  { value: 'cleaning-attachments', label: 'Cleaning attachments' },
  { value: 'surgical-instruments', label: 'Surgical instruments' },
  { value: 'diode-dental-laser', label: 'Diode dental laser' },
  { value: 'dental-treatment-unit', label: 'Dental treatment unit' },
  { value: 'oil-free-compressor', label: 'Oil-free compressor' },
  { value: 'lab-heating-equipment', label: 'Laboratory heating equipment' },
  { value: 'restorative-materials', label: 'Restorative materials' },
  { value: 'uv-storage-cabinet', label: 'UV instrument storage cabinet' },
];

const initialState = {
  clinicName: '',
  contactName: '',
  email: '',
  phone: '',
  city: '',
  productInterest: '',
  message: '',
};

export default function QuoteRequestForm({ defaultProductInterest = '' }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...initialState,
    productInterest: defaultProductInterest,
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        contactName: f.contactName || user.name || '',
        email: f.email || user.email || '',
        phone: f.phone || user.phone || '',
        clinicName: f.clinicName || user.clinicName || '',
        city: f.city || user.city || '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    try {
      const selectedProduct = productOptions.find((p) => p.value === form.productInterest);
      await api.post('/quotes', {
        ...form,
        productName: selectedProduct?.value ? selectedProduct.label : undefined,
      });
      setStatus('success');
      setForm(initialState);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  }

  if (user?.role === 'admin') {
    return (
      <div className="card text-center py-10 bg-surface border-line">
        <i className="ti ti-shield-lock text-3xl mb-3 text-neutral-400" aria-hidden="true"></i>
        <p className="font-medium mb-1">Admin accounts can't submit requests</p>
        <p className="text-sm text-neutral-600">
          Sign in with a customer account to request a quote.
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="card text-center py-10 animate-riseIn">
        <i className="ti ti-circle-check text-3xl mb-3" aria-hidden="true"></i>
        <p className="font-medium mb-1">Request received</p>
        <p className="text-sm text-neutral-600">
          A team member will follow up within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="field"
        placeholder="Clinic or hospital name"
        value={form.clinicName}
        onChange={update('clinicName')}
        required
      />
      <input
        className="field"
        placeholder="Your name"
        value={form.contactName}
        onChange={update('contactName')}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          className="field"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={update('email')}
          required
        />
        <input
          className="field"
          placeholder="Phone number"
          value={form.phone}
          onChange={update('phone')}
          required
        />
      </div>
      <input
        className="field"
        placeholder="City"
        value={form.city}
        onChange={update('city')}
        required
      />
      <CustomSelect
        value={form.productInterest}
        onChange={(val) => setForm((f) => ({ ...f, productInterest: val }))}
        options={productOptions}
        placeholder="Product interest (optional)"
      />
      <textarea
        className="field"
        rows="3"
        placeholder="Anything else we should know"
        value={form.message}
        onChange={update('message')}
      />

      {status === 'error' && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
        {status === 'submitting' ? 'Submitting…' : 'Submit request'}
      </button>
    </form>
  );
}