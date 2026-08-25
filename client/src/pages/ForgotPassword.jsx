import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import PasswordInput from '../components/ui/PasswordInput.jsx';

export default function ForgotPassword() {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: enter email, 1: enter code + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleRequestCode(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    try {
      await forgotPassword(email);
      setStatus('idle');
      setStep(1);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match');
      return;
    }
    setStatus('submitting');
    setErrorMessage('');
    try {
      await resetPassword(email, otp, newPassword);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white border border-line rounded-2xl p-8 text-center animate-riseIn">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-circle-check text-2xl" aria-hidden="true"></i>
          </div>
          <p className="font-heading font-semibold text-xl text-ink mb-2">Password reset</p>
          <p className="text-sm text-neutral-600 mb-6">
            Your password has been updated. You can sign in with it now.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full">
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full bg-white border border-line rounded-2xl p-8 animate-riseIn">
        <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-5">
          <i className="ti ti-shield-lock text-xl" aria-hidden="true"></i>
        </div>

        <h1 className="font-heading font-semibold text-2xl text-ink mb-1">
          Reset your password
        </h1>
        <p className="text-neutral-600 mb-6 text-sm">
          {step === 0
            ? "Enter your account email and we'll send a verification code."
            : `Enter the code sent to ${email} and choose a new password.`}
        </p>

        {step === 0 ? (
          <form onSubmit={handleRequestCode} className="space-y-3">
            <div className="relative">
              <i
                className="ti ti-mail absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                aria-hidden="true"
              ></i>
              <input
                className="field pl-9"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {status === 'error' && <p className="text-sm text-red-600">{errorMessage}</p>}
            <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
              {status === 'submitting' ? 'Sending…' : 'Send code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-3">
            <div className="relative">
              <i
                className="ti ti-key absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                aria-hidden="true"
              ></i>
              <input
                className="field pl-9 tracking-[0.3em] font-medium"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                inputMode="numeric"
                required
              />
            </div>

            <PasswordInput
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <PasswordInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {status === 'error' && <p className="text-sm text-red-600">{errorMessage}</p>}
            <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
              {status === 'submitting' ? 'Resetting…' : 'Reset password'}
            </button>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="text-sm text-neutral-500 hover:text-ink w-full text-center"
            >
              Use a different email
            </button>
          </form>
        )}

        <p className="text-sm text-neutral-600 mt-6 text-center">
          <Link to="/login" className="text-ink font-medium">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}