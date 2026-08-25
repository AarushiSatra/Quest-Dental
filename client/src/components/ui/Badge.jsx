import React from 'react';

export default function Badge({ children }) {
  return (
    <span className="border border-line rounded-full px-3 py-1 text-xs text-ink hover:border-ink transition-colors">
      {children}
    </span>
  );
}
