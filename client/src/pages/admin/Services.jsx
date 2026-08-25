import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

const emptyForm = { name: '', slug: '', description: '', detail: '', icon: 'ti-settings' };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  function loadServices() {
    setLoading(true);
    api.get('/services').then(setServices).catch(() => setServices([])).finally(() => setLoading(false));
  }

  function openNew() {
    setForm(emptyForm);
    setEditing({});
    setError('');
  }

  function openEdit(service) {
    setForm({
      name: service.name,
      slug: service.slug,
      description: service.description,
      detail: service.detail || '',
      icon: service.icon || 'ti-settings',
    });
    setEditing(service);
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing._id) {
        await api.patch(`/services/${editing._id}`, form);
      } else {
        await api.post('/services', form);
      }
      setEditing(null);
      loadServices();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    await api.delete(`/services/${id}`);
    loadServices();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-semibold text-2xl text-ink">
          Services <span className="text-neutral-400 font-normal">({services.length})</span>
        </h1>
        <button onClick={openNew} className="btn-primary">
          <i className="ti ti-plus mr-1" aria-hidden="true"></i>
          Add service
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : (
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          <div className="divide-y divide-line">
            {services.map((s) => (
              <div key={s._id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-ink text-white shrink-0 flex items-center justify-center">
                  <i className={`ti ${s.icon}`} aria-hidden="true"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{s.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{s.slug}</p>
                </div>
                <button onClick={() => openEdit(s)} className="text-sm text-neutral-500 hover:text-ink px-3 py-1.5">
                  Edit
                </button>
                <button onClick={() => handleDelete(s._id)} className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto animate-riseIn">
            <p className="font-heading font-semibold text-xl text-ink mb-4">
              {editing._id ? 'Edit service' : 'Add service'}
            </p>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                className="field"
                placeholder="Service name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                className="field"
                placeholder="Slug (e.g. on-site-calibration)"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
              />
              <input
                className="field"
                placeholder="Short description (shown in list)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
              <textarea
                className="field"
                rows="3"
                placeholder="Full detail text"
                value={form.detail}
                onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
              />
              <input
                className="field"
                placeholder="Tabler icon class (e.g. ti-settings)"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}