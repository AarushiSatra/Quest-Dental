import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import CustomSelect from '../../components/ui/CustomSelect.jsx';

const categories = [
  { value: 'device', label: 'Device' },
  { value: 'attachment', label: 'Attachment' },
  { value: 'surgical', label: 'Surgical' },
  { value: 'clinical-hardware', label: 'Clinical hardware' },
  { value: 'lab-equipment', label: 'Lab equipment' },
  { value: 'restorative', label: 'Restorative' },
  { value: 'storage-safety', label: 'Storage & safety' },
];

const emptyForm = {
  name: '',
  slug: '',
  category: 'device',
  shortDescription: '',
  description: '',
  image: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = editing
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  function loadProducts() {
    setLoading(true);
    api
      .get('/products?includeInactive=true')
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }

  function openNew() {
    setForm(emptyForm);
    setEditing({});
    setError('');
  }

  function openEdit(product) {
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      shortDescription: product.shortDescription,
      description: product.description,
      image: product.image || '',
    });
    setEditing(product);
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing._id) {
        await api.patch(`/products/${editing._id}`, form);
      } else {
        await api.post('/products', form);
      }
      setEditing(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-semibold text-2xl text-ink">
          Products <span className="text-neutral-400 font-normal">({products.length})</span>
        </h1>
        <button onClick={openNew} className="btn-primary">
          <i className="ti ti-plus mr-1" aria-hidden="true"></i>
          Add product
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : (
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          <div className="divide-y divide-line">
            {products.map((p) => (
              <div key={p._id} className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-ink shrink-0 overflow-hidden flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <i className="ti ti-vaccine-bottle text-white/40" aria-hidden="true"></i>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{p.name}</p>
                  <p className="text-xs text-neutral-500">
                    {p.category.replace('-', ' ')} · {p.slug}
                  </p>
                </div>
                <button
                  onClick={() => openEdit(p)}
                  className="text-sm text-neutral-500 hover:text-ink px-3 py-1.5"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5"
                >
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
              {editing._id ? 'Edit product' : 'Add product'}
            </p>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                className="field"
                placeholder="Product name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                className="field"
                placeholder="Slug (e.g. sterifast-device)"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
              />
              <CustomSelect
                value={form.category}
                onChange={(val) => setForm((f) => ({ ...f, category: val }))}
                options={categories}
              />
              <input
                className="field"
                placeholder="Short description"
                value={form.shortDescription}
                onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                required
              />
              <textarea
                className="field"
                rows="3"
                placeholder="Full description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
              <input
                className="field"
                placeholder="Image path (e.g. /assets/images/product.jpg)"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
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