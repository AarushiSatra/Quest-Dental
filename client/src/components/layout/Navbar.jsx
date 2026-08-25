import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const links = [
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-line sticky top-0 bg-white/90 backdrop-blur z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
          <i className="ti ti-vaccine-bottle text-xl" aria-hidden="true"></i>
          Quest Dental
        </Link>

        <button
          className="flex items-center justify-center w-10 h-10 rounded-full border border-line hover:border-ink transition-colors"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <i className="ti ti-menu-2 text-xl" aria-hidden="true"></i>
        </button>
      </div>

      {open && (
        <div className="border-t border-line animate-riseIn">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm py-2 ${isActive ? 'font-medium' : 'text-neutral-600 hover:text-ink transition-colors'}`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <div className="border-t border-line my-3" />

            {user ? (
              <>
                <p className="text-sm text-neutral-600 py-1">Hi, {user.name.split(' ')[0]}</p>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="text-sm py-2 text-neutral-600 hover:text-ink transition-colors"
                >
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="text-sm py-2 text-neutral-600 hover:text-ink transition-colors flex items-center gap-1.5"
                  >
                    <i className="ti ti-layout-dashboard text-base" aria-hidden="true"></i>
                    Admin dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="btn-secondary py-2 px-4 text-left w-fit mt-1"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex gap-3 flex-wrap">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary py-2 px-4">
                  Sign in
                </Link>
                <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary py-2 px-4">
                  Request a quote
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}