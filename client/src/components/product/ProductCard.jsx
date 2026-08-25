import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.slug}`} className="card block animate-riseIn">
      <div className="bg-ink aspect-video rounded-lg flex items-center justify-center mb-4 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <i className="ti ti-vaccine-bottle text-3xl text-white" aria-hidden="true"></i>
        )}
      </div>
      <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">
        {product.category.replace('-', ' ')}
      </p>
      <p className="font-medium mb-1">{product.name}</p>
      <p className="text-sm text-neutral-600">{product.shortDescription}</p>
    </Link>
  );
}