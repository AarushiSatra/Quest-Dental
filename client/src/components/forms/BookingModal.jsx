import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import DatePicker from '../ui/DatePicker.jsx';

const initialState = {
  clinicName: '',
  contactName: '',
  email: '',
  phone: '',
  city: '',
  preferredDate: '',
  message: '',
};

const STEPS = ['Your clinic', 'Contact details', 'Schedule'];

export default function BookingModal({ service, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialState);
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

  function canProceed() {
    if (step === 0) return form.clinicName.trim() && form.contactName.trim();
    if (step === 1) return form.email.trim() && form.phone.trim() && form.city.trim();
    return true;
  }

  async function handleSubmit() {
    setStatus('submitting');
    setErrorMessage('');
    try {
      await api.post('/quotes', { ...form, serviceInterest: service.slug, serviceName: service.name });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 animate-riseIn"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 animate-riseIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
          aria-label="Close"
        >
          <i className="ti ti-x" aria-hidden="true"></i>
        </button>

        {user?.role === 'admin' ? (
          <div className="text-center py-6">
            <i className="ti ti-shield-lock text-3xl mb-3 text-neutral-400" aria-hidden="true"></i>
            <p className="font-heading font-bold text-lg mb-1">Admin accounts can't book services</p>
            <p className="text-sm text-neutral-600 mb-6">
              Sign in with a customer account to book this service.
            </p>
            <button onClick={onClose} className="btn-secondary w-full">
              Close
            </button>
          </div>
        ) : status === 'success' ? (
          <div className="text-center py-6">
            <i className="ti ti-circle-check text-4xl mb-3" aria-hidden="true"></i>
            <p className="font-heading font-bold text-xl mb-1">Booking requested</p>
            <p className="text-sm text-neutral-600 mb-6">
              A team member will confirm your {service.name.toLowerCase()} booking
              within 1 business day.
            </p>
            <button onClick={onClose} className="btn-primary w-full">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ink text-white mb-4">
              <i className={`ti ${service.icon} text-lg`} aria-hidden="true"></i>
            </div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              Book · {service.name}
            </p>
            <p className="font-heading font-bold text-2xl mb-5">{STEPS[step]}</p>

            <div className="flex gap-1.5 mb-6">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= step ? 'bg-ink' : 'bg-neutral-200'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-3 min-h-[180px]">
              {step === 0 && (
                <>
                  <input
                    className="field"
                    placeholder="Clinic or hospital name"
                    value={form.clinicName}
                    onChange={update('clinicName')}
                    autoFocus
                  />
                  <input
                    className="field"
                    placeholder="Your name"
                    value={form.contactName}
                    onChange={update('contactName')}
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <input
                    className="field"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={update('email')}
                    autoFocus
                  />
                  <input
                    className="field"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={update('phone')}
                  />
                  <input
                    className="field"
                    placeholder="City"
                    value={form.city}
                    onChange={update('city')}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-neutral-500 mb-1 block">
                      Preferred date (optional)
                    </label>
                    <DatePicker
                      value={form.preferredDate}
                      onChange={(iso) => setForm((f) => ({ ...f, preferredDate: iso }))}
                      placeholder="Choose a date"
                    />
                  </div>
                  <textarea
                    className="field"
                    rows="3"
                    placeholder="Anything else we should know"
                    value={form.message}
                    onChange={update('message')}
                  />
                </>
              )}
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-600 mt-3">{errorMessage}</p>
            )}

            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="btn-secondary flex-1"
                  type="button"
                >
                  Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => canProceed() && setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="btn-primary flex-1 disabled:opacity-40"
                  type="button"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={status === 'submitting'}
                  className="btn-primary flex-1 disabled:opacity-60"
                  type="button"
                >
                  {status === 'submitting' ? 'Submitting…' : 'Confirm booking'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}