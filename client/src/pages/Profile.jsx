import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import PasswordInput from '../components/ui/PasswordInput.jsx';

const fields = [
  { key: 'name', label: 'Full name', icon: 'ti-user', required: true },
  { key: 'phone', label: 'Phone number', icon: 'ti-phone', placeholder: '+91XXXXXXXXXX' },
  { key: 'clinicName', label: 'Clinic or hospital name', icon: 'ti-building-hospital' },
  { key: 'city', label: 'City', icon: 'ti-map-pin' },
];

export default function Profile() {
  const {
    user,
    loading,
    updateProfile,
    requestEmailChangeOtp,
    changeEmail,
    requestPasswordChangeOtp,
    changePassword,
  } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', clinicName: '', city: '' });
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const [errorMessage, setErrorMessage] = useState('');

  // Change email: step 0 = enter new email, step 1 = enter the code sent to it
  const [emailStep, setEmailStep] = useState(0);
  const [newEmail, setNewEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailStatus, setEmailStatus] = useState('idle');
  const [emailError, setEmailError] = useState('');

  // Change password: step 0 = request a code, step 1 = enter code + new password
  const [passwordStep, setPasswordStep] = useState(0);
  const [passwordOtp, setPasswordOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('idle');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        clinicName: user.clinicName || '',
        city: user.city || '',
      });
    }
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const completedCount = fields.filter((f) => form[f.key]?.trim()).length;

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');
    try {
      await updateProfile(form);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  }

  async function handleRequestEmailOtp(e) {
    e.preventDefault();
    setEmailStatus('saving');
    setEmailError('');
    try {
      await requestEmailChangeOtp(newEmail);
      setEmailStatus('idle');
      setEmailStep(1);
    } catch (err) {
      setEmailStatus('error');
      setEmailError(err.message);
    }
  }

  async function handleConfirmEmailOtp(e) {
    e.preventDefault();
    setEmailStatus('saving');
    setEmailError('');
    try {
      await changeEmail(emailOtp);
      setEmailStatus('saved');
      setEmailStep(0);
      setNewEmail('');
      setEmailOtp('');
      setTimeout(() => setEmailStatus('idle'), 2500);
    } catch (err) {
      setEmailStatus('error');
      setEmailError(err.message);
    }
  }

  async function handleRequestPasswordOtp() {
    setPasswordStatus('saving');
    setPasswordError('');
    try {
      await requestPasswordChangeOtp();
      setPasswordStatus('idle');
      setPasswordStep(1);
    } catch (err) {
      setPasswordStatus('error');
      setPasswordError(err.message);
    }
  }

  async function handleConfirmPasswordOtp(e) {
    e.preventDefault();
    setPasswordStatus('saving');
    setPasswordError('');
    try {
      await changePassword(passwordOtp, newPassword);
      setPasswordStatus('saved');
      setPasswordStep(0);
      setPasswordOtp('');
      setNewPassword('');
      setTimeout(() => setPasswordStatus('idle'), 2500);
    } catch (err) {
      setPasswordStatus('error');
      setPasswordError(err.message);
    }
  }

  return (
    <div className="bg-surface min-h-[calc(100vh-64px)]">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <p className="text-sm text-accent font-medium mb-2">Your account</p>
        <h1 className="font-heading font-semibold text-3xl text-ink mb-2">Profile</h1>
        <p className="text-neutral-600 mb-8 max-w-lg">
          These details are saved to your account and automatically fill in
          whenever you request a quote or book a service — no need to retype
          them each time.
        </p>

        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <div className="px-6 md:px-8 py-6 border-b border-line flex items-center justify-between">
            <div>
              <p className="font-medium text-ink">{user.name}</p>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Profile completeness</p>
              <p className="font-heading font-semibold text-ink">
                {completedCount}/{fields.length}
              </p>
            </div>
          </div>

          <div className="h-1 bg-line">
            <div
              className="h-full bg-ink transition-all duration-500"
              style={{ width: `${(completedCount / fields.length) * 100}%` }}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs uppercase tracking-wide text-neutral-500 mb-1.5 block">
                  {f.label}
                </label>
                <div className="relative">
                  <i
                    className={`ti ${f.icon} absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400`}
                    aria-hidden="true"
                  ></i>
                  <input
                    className="field pl-9"
                    value={form[f.key]}
                    onChange={update(f.key)}
                    placeholder={f.placeholder}
                    required={f.required}
                  />
                </div>
              </div>
            ))}

            {status === 'error' && <p className="text-sm text-red-600">{errorMessage}</p>}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={status === 'saving'} className="btn-primary">
                {status === 'saving' ? 'Saving…' : 'Save changes'}
              </button>
              {status === 'saved' && (
                <span className="text-sm text-green-600 flex items-center gap-1 animate-riseIn">
                  <i className="ti ti-check" aria-hidden="true"></i>
                  Saved
                </span>
              )}
            </div>
          </form>
        </div>

        <p className="text-sm text-accent font-medium mt-10 mb-3">Account security</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-line rounded-2xl p-6">
            <p className="font-medium text-ink mb-1">Change email</p>
            <p className="text-xs text-neutral-500 mb-4">Currently {user.email}</p>

            {emailStep === 0 ? (
              <form onSubmit={handleRequestEmailOtp} className="space-y-3">
                <input
                  className="field"
                  type="email"
                  placeholder="New email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
                {emailStatus === 'error' && <p className="text-sm text-red-600">{emailError}</p>}
                <button type="submit" disabled={emailStatus === 'saving'} className="btn-secondary w-full">
                  {emailStatus === 'saving' ? 'Sending…' : 'Send code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmEmailOtp} className="space-y-3">
                <p className="text-xs text-neutral-500">Code sent to {newEmail}</p>
                <input
                  className="field"
                  placeholder="6-digit code"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  maxLength={6}
                  required
                />
                {emailStatus === 'error' && <p className="text-sm text-red-600">{emailError}</p>}
                <button type="submit" disabled={emailStatus === 'saving'} className="btn-secondary w-full">
                  {emailStatus === 'saving' ? 'Confirming…' : 'Confirm code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailStep(0);
                    setEmailOtp('');
                  }}
                  className="text-xs text-neutral-500 hover:text-ink w-full text-center"
                >
                  Use a different email
                </button>
              </form>
            )}

            {emailStatus === 'saved' && (
              <p className="text-sm text-green-600 flex items-center gap-1 mt-3">
                <i className="ti ti-check" aria-hidden="true"></i> Email updated
              </p>
            )}
          </div>

          <div className="bg-white border border-line rounded-2xl p-6">
            <p className="font-medium text-ink mb-1">Change password</p>
            <p className="text-xs text-neutral-500 mb-4">
              We'll email a code to {user.email} to confirm it's you
            </p>

            {passwordStep === 0 ? (
              <>
                {passwordStatus === 'error' && (
                  <p className="text-sm text-red-600 mb-3">{passwordError}</p>
                )}
                <button
                  type="button"
                  onClick={handleRequestPasswordOtp}
                  disabled={passwordStatus === 'saving'}
                  className="btn-secondary w-full"
                >
                  {passwordStatus === 'saving' ? 'Sending…' : 'Send code'}
                </button>
              </>
            ) : (
              <form onSubmit={handleConfirmPasswordOtp} className="space-y-3">
                <input
                  className="field"
                  placeholder="6-digit code"
                  value={passwordOtp}
                  onChange={(e) => setPasswordOtp(e.target.value)}
                  maxLength={6}
                  required
                />
                <PasswordInput
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                {passwordStatus === 'error' && (
                  <p className="text-sm text-red-600">{passwordError}</p>
                )}
                <button type="submit" disabled={passwordStatus === 'saving'} className="btn-secondary w-full">
                  {passwordStatus === 'saving' ? 'Updating…' : 'Confirm and update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordStep(0);
                    setPasswordOtp('');
                  }}
                  className="text-xs text-neutral-500 hover:text-ink w-full text-center"
                >
                  Cancel
                </button>
              </form>
            )}

            {passwordStatus === 'saved' && (
              <p className="text-sm text-green-600 flex items-center gap-1 mt-3">
                <i className="ti ti-check" aria-hidden="true"></i> Password updated
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}