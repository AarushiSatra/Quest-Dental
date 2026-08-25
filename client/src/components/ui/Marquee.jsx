import React from 'react';

// Infinite horizontal scroll strip. Duplicates the items once so the
// loop is seamless.
export default function Marquee({ items }) {
  return (
    <div className="overflow-hidden border-y border-line bg-ink py-4">
      <div className="flex w-max animate-marquee">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-8 shrink-0">
            <i className={`ti ${item.icon} text-white/60`} aria-hidden="true"></i>
            <span className="text-white/80 text-sm font-medium uppercase tracking-wide whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}