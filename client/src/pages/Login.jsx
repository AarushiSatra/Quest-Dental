import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext.jsx';
import PasswordInput from '../components/ui/PasswordBox8.jsx';

export default function Login() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleGoogleSuccess(credentialResponse) {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError('');
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-ink relative overflow-hidden p-10">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <p className="relative font-heading font-bold text-lg text-white flex items-center gap-2 animate-riseIn">
          <i className="ti ti-vaccine-bottle text-xl" aria-hidden="true"></i>
          Quest Dental
        </p>

        <div className="relative">
          <h2
            className="font-heading font-black text-5xl text-white uppercase leading-[0.95] tracking-tight mb-6 animate-riseIn"
            style={{ animationDelay: '0.1s' }}
          >
            Chairside sterilization, reimagined
          </h2>

          <div
            className="flex gap-3 animate-riseIn"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3">
              <p className="font-heading font-bold text-white text-xl">100%</p>
              <p className="text-white/50 text-xs mt-0.5">Microbial elimination</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3">
              <p className="font-heading font-bold text-white text-xl">Patented</p>
              <p className="text-white/50 text-xs mt-0.5">Award-winning tech</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm animate-riseIn">
          <h1 className="font-heading font-black text-4xl uppercase tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-neutral-600 mb-6">Sign in to continue</p>

          <div className="mb-4">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in failed')} />
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-line flex-1" />
            <span className="text-xs text-neutral-500">or</span>
            <div className="h-px bg-line flex-1" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              className="field"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-neutral-500 hover:text-ink">
                Forgot password?
              </Link>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Sign in
            </button>
          </form>

          <p className="text-sm text-neutral-600 mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-ink font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}