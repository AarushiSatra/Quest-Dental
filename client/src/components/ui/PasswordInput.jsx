import React, { useState } from 'react';

// A password input with a show/hide eye toggle, styled to match `.field`.
export default function PasswordInput({ value, onChange, placeholder, required }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <i
        className="ti ti-lock absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        aria-hidden="true"
      ></i>
      <input
        className="field pl-9 pr-10"
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        <i className={`ti ${visible ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
      </button>
    </div>
  );
}