import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const statusMeta = {
  new: { label: 'New', color: '#2563EB', bg: 'bg-blue-50', text: 'text-blue-700' },
  contacted: { label: 'Contacted', color: '#D97706', bg: 'bg-amber-50', text: 'text-amber-700' },
  closed: { label: 'Closed', color: '#16A34A', bg: 'bg-green-50', text: 'text-green-700' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/admin/summary').then(setSummary).catch(() => setSummary(null));
  }, []);

  if (!summary) return <p className="text-sm text-neutral-500">Loading…</p>;

  const cards = [
    { label: 'Products', value: summary.productCount, icon: 'ti-vaccine-bottle', to: '/admin/products' },
    { label: 'Services', value: summary.serviceCount, icon: 'ti-settings', to: '/admin/services' },
    { label: 'Customers', value: summary.customerCount, icon: 'ti-users', to: '/admin/customers' },
    { label: 'Total requests', value: summary.totalRequests, icon: 'ti-clipboard-list', to: '/admin/quotes' },
  ];

  const total = summary.totalRequests || 1;

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-8">
        <div>
          <p className="text-sm text-accent font-medium mb-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="font-heading font-semibold text-3xl text-ink">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products" className="btn-secondary text-sm py-2 px-4">
            <i className="ti ti-plus mr-1" aria-hidden="true"></i>
            Add product
          </Link>
          <Link to="/admin/services" className="btn-primary text-sm py-2 px-4">
            <i className="ti ti-plus mr-1" aria-hidden="true"></i>
            Add service
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group bg-white border border-line rounded-2xl p-5 hover:border-ink hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <i className={`ti ${c.icon} text-lg`} aria-hidden="true"></i>
              </div>
              <i
                className="ti ti-arrow-up-right text-neutral-300 group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                aria-hidden="true"
              ></i>
            </div>
            <p className="font-heading font-semibold text-3xl text-ink">{c.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <div className="md:col-span-2 bg-white border border-line rounded-2xl p-6">
          <p className="font-medium text-ink mb-4">Requests by status</p>

          <div className="h-2.5 rounded-full overflow-hidden flex mb-5 bg-neutral-100">
            {Object.keys(statusMeta).map((key) => {
              const count = summary.statusCounts[key] || 0;
              const pct = (count / total) * 100;
              return pct > 0 ? (
                <div
                  key={key}
                  style={{ width: `${pct}%`, backgroundColor: statusMeta[key].color }}
                  className="h-full"
                />
              ) : null;
            })}
          </div>

          <div className="space-y-3">
            {Object.entries(statusMeta).map(([key, meta]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-sm text-neutral-600">{meta.label}</span>
                </div>
                <span className="text-sm font-medium text-ink">
                  {summary.statusCounts[key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 bg-white border border-line rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-line flex items-center justify-between">
            <p className="font-medium text-ink">Recent requests</p>
            <Link to="/admin/quotes" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          {summary.recentQuotes.length === 0 ? (
            <p className="text-sm text-neutral-500 p-6">No requests yet.</p>
          ) : (
            <div className="divide-y divide-line">
              {summary.recentQuotes.map((q) => {
                const meta = statusMeta[q.status] || statusMeta.new;
                return (
                  <div key={q._id} className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center shrink-0 text-xs font-medium text-neutral-600">
                      {q.clinicName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">{q.clinicName}</p>
                      <p className="text-xs text-neutral-500 truncate">
                        {q.productName || q.productInterest || q.serviceName || q.serviceInterest || 'General enquiry'}
                      </p>
                    </div>
                    <span className={`text-xs font-medium rounded-full px-2.5 py-1 shrink-0 ${meta.bg} ${meta.text}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-neutral-400 shrink-0 hidden sm:block w-14 text-right">
                      {timeAgo(q.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}