import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'ti-layout-dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'ti-vaccine-bottle' },
  { to: '/admin/services', label: 'Services', icon: 'ti-settings' },
  { to: '/admin/quotes', label: 'Requests', icon: 'ti-clipboard-list' },
  { to: '/admin/customers', label: 'Customers', icon: 'ti-users' },
];

export default function AdminLayout() {
  return (
    <div className="bg-surface min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="md:sticky md:top-24 h-fit">
          <div className="flex items-center gap-2 mb-6 px-1">
            <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center">
              <i className="ti ti-shield-lock text-sm" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-ink leading-tight">Admin</p>
              <p className="text-[11px] text-neutral-500 leading-tight">Quest Dental</p>
            </div>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors ${
                    isActive ? 'bg-ink text-white' : 'text-neutral-600 hover:bg-white'
                  }`
                }
              >
                <i className={`ti ${item.icon} text-base`} aria-hidden="true"></i>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/"
            className="hidden md:flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-neutral-500 hover:text-ink hover:bg-white transition-colors mt-4"
          >
            <i className="ti ti-arrow-left text-base" aria-hidden="true"></i>
            Back to site
          </Link>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}