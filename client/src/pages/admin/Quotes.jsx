import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import CustomSelect from '../../components/ui/CustomSelect.jsx';

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

const statusColors = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-amber-50 text-amber-700',
  closed: 'bg-green-50 text-green-700',
};

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  function loadQuotes() {
    setLoading(true);
    api.get('/quotes').then(setQuotes).catch(() => setQuotes([])).finally(() => setLoading(false));
  }

  async function handleStatusChange(id, status) {
    setQuotes((prev) => prev.map((q) => (q._id === id ? { ...q, status } : q)));
    try {
      await api.patch(`/quotes/${id}`, { status });
    } catch {
      loadQuotes(); // revert on failure
    }
  }

  const filtered = filter ? quotes.filter((q) => q.status === filter) : quotes;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="font-heading font-semibold text-2xl text-ink">Requests</h1>
        <div className="w-44">
          <CustomSelect
            value={filter}
            onChange={setFilter}
            options={[{ value: '', label: 'All statuses' }, ...statusOptions]}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-neutral-500">No requests found.</p>
      ) : (
        // No overflow-hidden here — a hidden overflow on this wrapper would
        // clip the status dropdown's popover on the last row in the list.
        // Rounded corners are applied to the individual rows instead.
        <div className="bg-white border border-line rounded-xl">
          <div className="divide-y divide-line">
            {filtered.map((q, i) => (
              <div
                key={q._id}
                className={`p-5 flex flex-col md:flex-row md:items-center gap-4 ${
                  i === 0 ? 'rounded-t-xl' : ''
                } ${i === filtered.length - 1 ? 'rounded-b-xl' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-ink">{q.clinicName}</p>
                    <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 capitalize ${statusColors[q.status]}`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {q.contactName} · {q.email} · {q.phone}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {q.city}
                    {q.productInterest && ` · Product: ${q.productName || q.productInterest}`}
                    {q.serviceInterest && ` · Service: ${q.serviceName || q.serviceInterest}`}
                    {q.preferredDate && ` · Preferred: ${q.preferredDate}`}
                  </p>
                  {q.message && <p className="text-xs text-neutral-500 mt-1 italic">"{q.message}"</p>}
                </div>
                <div className="w-full md:w-40 shrink-0">
                  <CustomSelect
                    value={q.status}
                    onChange={(val) => handleStatusChange(q._id, val)}
                    options={statusOptions}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}