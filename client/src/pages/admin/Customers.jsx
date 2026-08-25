import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/customers').then(setCustomers).catch(() => setCustomers([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-ink mb-6">
        Customers <span className="text-neutral-400 font-normal">({customers.length})</span>
      </h1>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-neutral-500">No customers yet.</p>
      ) : (
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          <div className="divide-y divide-line">
            {customers.map((c) => (
              <div key={c._id} className="p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink truncate">{c.name}</p>
                  <p className="text-sm text-neutral-600 truncate">{c.email}</p>
                  {(c.clinicName || c.city) && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {[c.clinicName, c.city].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                {c.phone && <p className="text-sm text-neutral-500 shrink-0">{c.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}