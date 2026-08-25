import React from 'react';
import { Link } from 'react-router-dom';

// A uniform-size product tile with an image that zooms on hover and
// details that slide up from the bottom edge.
export default function BentoProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-ink block aspect-square"
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:opacity-100"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <i
            className="ti ti-vaccine-bottle text-4xl text-white/30 transition-transform duration-500 group-hover:scale-110"
            aria-hidden="true"
          ></i>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {product.badges?.length > 0 && (
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {product.badges.slice(0, 2).map((b) => (
            <span
              key={b}
              className="text-[10px] uppercase tracking-wide bg-white text-ink rounded-full px-2 py-1 font-medium"
            >
              {b}
            </span>
          ))}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-[11px] uppercase tracking-wide text-white/60 mb-1">
          {product.category.replace('-', ' ')}
        </p>
        <p className="font-heading font-bold text-white leading-tight text-base">
          {product.name}
        </p>
        <p className="text-white/70 mt-1 text-xs opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 overflow-hidden transition-all duration-300">
          {product.shortDescription}
        </p>
      </div>
    </Link>
  );
}