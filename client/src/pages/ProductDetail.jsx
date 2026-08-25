import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import Badge from '../components/ui/Badge.jsx';
import QuoteRequestForm from '../components/forms/QuoteRequestForm.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${slug}`)
      .then(setProduct)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center">Product not found.</div>;
  }
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div>
        <div className="bg-ink aspect-video rounded-xl flex items-center justify-center mb-6 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="ti ti-vaccine-bottle text-5xl text-white" aria-hidden="true"></i>
          )}
        </div>
        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
          {product.category.replace('-', ' ')}
        </p>
        <h1 className="text-2xl font-medium mb-3">{product.name}</h1>
        <p className="text-neutral-600 leading-relaxed mb-4">{product.description}</p>

        {product.badges?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {product.badges.map((b) => (
              <Badge key={b}>{b}</Badge>
            ))}
          </div>
        )}

        {product.specs?.length > 0 && (
          <div className="mb-6">
            <p className="font-medium mb-2">Specifications</p>
            <ul className="space-y-2 text-sm">
              {product.specs.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <i className="ti ti-check mt-0.5" aria-hidden="true"></i>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.useCases?.length > 0 && (
          <div className="mb-6">
            <p className="font-medium mb-2">Who it's for</p>
            <ul className="space-y-2 text-sm">
              {product.useCases.map((u) => (
                <li key={u} className="flex items-start gap-2">
                  <i className="ti ti-users mt-0.5" aria-hidden="true"></i>
                  {u}
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.certifications?.length > 0 && (
          <div>
            <p className="font-medium mb-2">Certifications & compliance</p>
            <ul className="space-y-2 text-sm">
              {product.certifications.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <i className="ti ti-shield-check mt-0.5" aria-hidden="true"></i>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <div className="card sticky top-24">
          <p className="font-medium mb-1">Request a quote</p>
          <p className="text-sm text-neutral-600 mb-4">
            A team member will follow up within 1 business day.
          </p>
          <QuoteRequestForm defaultProductInterest={product.slug} />
        </div>
      </div>
    </div>
  );
}