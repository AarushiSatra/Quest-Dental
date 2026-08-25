import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import BentoProductCard from '../components/product/BentoProductCard.jsx';
import CountUp from '../components/ui/CountUp.jsx';
import Reveal from '../components/ui/Reveal.jsx';

const stats = [
  { target: 100, suffix: '%', label: 'Microbial elimination in trials' },
  { target: 12, suffix: '+', label: 'Years in dental technology' },
  { target: 9, suffix: '', label: 'Products across the catalog' },
  { target: 6, suffix: '', label: 'Services, end to end' },
];

const trustPoints = [
  { icon: 'ti-certificate', label: 'Patented technology' },
  { icon: 'ti-award', label: 'Dental Innovation of the Year' },
  { icon: 'ti-building-hospital', label: 'Trusted by dental practices' },
  { icon: 'ti-shield-check', label: 'Clinically trial-tested' },
];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-surface border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-line rounded-full px-4 py-1.5 mb-6">
              <i className="ti ti-award text-accent text-sm" aria-hidden="true"></i>
              <p className="text-xs text-ink font-medium">
                Dental Innovation of the Year, Indian Dental Divas
              </p>
            </div>

            <h1 className="font-heading font-semibold text-4xl md:text-5xl text-ink leading-tight mb-5">
              Chairside sterilization, engineered for the modern dental practice
            </h1>

            <p className="text-neutral-600 text-lg leading-relaxed mb-8 max-w-lg">
              SteriFast cleans and sterilizes small dental instruments in one
              compact, patented device — built for endodontic files, burs,
              scaler tips and orthodontic bands.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link to="/contact" className="btn-primary">
                Request a demo
              </Link>
              <Link to="/products" className="btn-secondary">
                View products
              </Link>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <p className="font-heading font-semibold text-lg text-ink">Why SteriFast</p>
              <span className="text-xs text-accent bg-accent/10 rounded-full px-3 py-1">
                Patented
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { icon: 'ti-clock', text: 'Sterilizes in a fraction of standard autoclave time' },
                { icon: 'ti-target', text: 'Purpose-built for endodontic files, burs and bands' },
                { icon: 'ti-shield-check', text: 'Clinically trial-tested, no damage to delicate instruments' },
              ].map((b) => (
                <div key={b.text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <i className={`ti ${b.icon} text-base`} aria-hidden="true"></i>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed pt-1">{b.text}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="font-heading font-semibold text-2xl text-ink">
                  <CountUp target={100} suffix="%" />
                </p>
                <p className="text-xs text-neutral-500">Elimination rate</p>
              </div>
              <div>
                <p className="font-heading font-semibold text-2xl text-ink">Rapid</p>
                <p className="text-xs text-neutral-500">Cycle time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {trustPoints.map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-neutral-600">
              <i className={`ti ${t.icon} text-accent`} aria-hidden="true"></i>
              <span className="text-sm">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <p className="font-heading font-semibold text-3xl text-white">
                <CountUp target={s.target} suffix={s.suffix} />
              </p>
              <p className="text-xs text-white/60 mt-1">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Product showcase */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-3 mb-10">
            <div>
              <p className="text-sm text-accent font-medium mb-2">The catalog</p>
              <h2 className="font-heading font-semibold text-3xl text-ink">
                Products and equipment
              </h2>
            </div>
            <Link to="/products" className="text-sm font-medium text-ink hover:text-accent transition-colors">
              View all products →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <BentoProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why it matters */}
      <section className="bg-surface border-y border-line">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <Reveal>
            <p className="text-sm text-accent font-medium mb-2 text-center">Why practices choose us</p>
            <h2 className="font-heading font-semibold text-3xl text-ink text-center mb-12">
              Built around real clinical needs
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: 'ti-clock',
                title: 'Faster turnaround',
                text: 'No lengthy autoclave queues — sterilize chairside in a fraction of the standard time.',
              },
              {
                icon: 'ti-target',
                title: 'Purpose-built',
                text: 'Designed specifically for endodontic files, burs, scaler tips and orthodontic bands.',
              },
              {
                icon: 'ti-award',
                title: 'Proven and recognized',
                text: 'Patented technology, incubated at riidl, and winner of the Dental Innovation of the Year Award.',
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="bg-white border border-line rounded-xl p-6 h-full">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <i className={`ti ${f.icon} text-lg`} aria-hidden="true"></i>
                  </div>
                  <p className="font-heading font-semibold text-lg text-ink mb-2">{f.title}</p>
                  <p className="text-sm text-neutral-600 leading-relaxed">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Origin banner */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <Reveal>
          <div className="bg-white border border-line rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <i className="ti ti-award text-xl" aria-hidden="true"></i>
              </div>
              <div>
                <p className="font-heading font-semibold text-lg text-ink">Patented, incubated at riidl</p>
                <p className="text-sm text-neutral-500">Somaiya Vidyavihar University</p>
              </div>
            </div>
            <Link to="/about" className="btn-secondary">
              Read our story
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="bg-ink">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <Reveal>
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-white mb-3">
              Ready to bring SteriFast to your clinic?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Get a personalized quote or schedule a demo — our team responds
              within 1 business day.
            </p>
            <Link to="/contact" className="btn-primary inline-block">
              Request a quote
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}