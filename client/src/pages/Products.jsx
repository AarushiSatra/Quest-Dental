import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import BentoProductCard from '../components/product/BentoProductCard.jsx';
import CustomSelect from '../components/ui/CustomSelect.jsx';

const categories = [
  { value: '', label: 'All' },
  { value: 'device', label: 'Devices' },
  { value: 'attachment', label: 'Attachments' },
  { value: 'surgical', label: 'Surgical instruments' },
  { value: 'clinical-hardware', label: 'Clinical hardware' },
  { value: 'lab-equipment', label: 'Lab equipment' },
  { value: 'restorative', label: 'Restorative' },
  { value: 'storage-safety', label: 'Storage & safety' },
];

const sortOptions = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'newest', label: 'Newest' },
];

export default function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [badge, setBadge] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    api.get('/products').then(setAllProducts).catch(() => setAllProducts([]));
  }, []);

  const badges = useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) => (p.badges || []).forEach((b) => set.add(b)));
    return Array.from(set);
  }, [allProducts]);

  const activeFilterCount = [category, badge].filter(Boolean).length;

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (category) list = list.filter((p) => p.category === category);
    if (badge) list = list.filter((p) => (p.badges || []).includes(badge));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  }, [allProducts, category, badge, search, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-medium">
          The full catalog
        </p>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <h1 className="font-heading font-black text-6xl md:text-7xl tracking-tight uppercase leading-[0.9]">
            Products
          </h1>
          <p className="text-sm text-neutral-500 mb-2">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <i
            className="ti ti-search absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          ></i>
          <input
            className="w-full rounded-full border border-line bg-neutral-50 pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-ink focus:bg-white transition-colors"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium border transition-colors ${
            filtersOpen ? 'bg-ink text-white border-ink' : 'border-line hover:border-ink'
          }`}
        >
          <i className="ti ti-adjustments-horizontal" aria-hidden="true"></i>
          Filters
          {activeFilterCount > 0 && (
            <span
              className={`text-[10px] rounded-full w-4 h-4 flex items-center justify-center ${
                filtersOpen ? 'bg-white text-ink' : 'bg-ink text-white'
              }`}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {filtersOpen && (
        <div className="rounded-2xl border border-line bg-neutral-50 p-5 mb-6 animate-riseIn">
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Sort by</p>
            <CustomSelect value={sort} onChange={setSort} options={sortOptions} />
          </div>

            {badges.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Badge</p>
                <CustomSelect
                  value={badge}
                  onChange={setBadge}
                  options={[{ value: '', label: 'All badges' }, ...badges.map((b) => ({ value: b, label: b }))]}
                />
              </div>
            )}
          </div>

          <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Category</p>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={
                  category === c.value
                    ? 'bg-ink text-white rounded-full px-4 py-1.5 text-sm font-medium transition-colors'
                    : 'bg-white border border-line rounded-full px-4 py-1.5 text-sm hover:border-ink transition-colors'
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setCategory('');
                setBadge('');
              }}
              className="text-xs text-neutral-500 hover:text-ink mt-4 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <BentoProductCard key={p.slug} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-neutral-500 text-sm mt-8">
          No products match your search or filters.
        </p>
      )}
    </div>
  );
}