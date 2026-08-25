import React, { useEffect, useRef, useState } from 'react';

// A fully custom dropdown so we control every color/hover state —
// native <select> option lists can't be restyled past browser defaults.
export default function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="field flex items-center justify-between w-full text-left"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <i
          className={`ti ti-chevron-down text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        ></i>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-line rounded-lg shadow-lg overflow-hidden animate-riseIn">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 text-sm transition-colors ${
                o.value === value ? 'bg-ink text-white' : 'hover:bg-neutral-100'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}