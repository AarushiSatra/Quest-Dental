import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext.jsx';
import PasswordInput from '../components/ui/PasswordInput.jsx';
//change the signup page to include a name field and handle Google sign-in

export default function Signup() {
  const { loginWithGoogle, signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
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

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password);
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
            Join clinics using SteriFast
          </h2>

          <ul
            className="space-y-2 animate-riseIn"
            style={{ animationDelay: '0.2s' }}
          >
            <li className="flex items-center gap-2 text-white/70 text-sm">
              <i className="ti ti-circle-check text-white" aria-hidden="true"></i>
              Request quotes on any product
            </li>
            <li className="flex items-center gap-2 text-white/70 text-sm">
              <i className="ti ti-circle-check text-white" aria-hidden="true"></i>
              Track enquiries in one place
            </li>
            <li className="flex items-center gap-2 text-white/70 text-sm">
              <i className="ti ti-circle-check text-white" aria-hidden="true"></i>
              Priority follow-up from our team
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm animate-riseIn">
          <h1 className="font-heading font-black text-4xl uppercase tracking-tight mb-1">
            Create account
          </h1>
          <p className="text-neutral-600 mb-6">Join to request quotes and track enquiries</p>

          <div className="mb-4">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in failed')} />
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-line flex-1" />
            <span className="text-xs text-neutral-500">or</span>
            <div className="h-px bg-line flex-1" />
          </div>

          <form onSubmit={handleSignup} className="space-y-3">
            <input
              className="field"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Create account
            </button>
          </form>

          <p className="text-sm text-neutral-600 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-ink font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}