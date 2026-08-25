import React from 'react';
import { Link } from 'react-router-dom';
import CountUp from '../components/ui/CountUp.jsx';

const timeline = [
  {
    label: 'Origin',
    title: 'An idea at riidl',
    text: 'SteriFast began as a concept developed and incubated at riidl, the Research Innovation Incubation Design Labs at Somaiya Vidyavihar University, under founder Dr. Nomal.',
  },
  {
    label: 'Technology',
    title: 'Patented sterilization physics',
    text: 'Non-ionizing radiation technology was engineered specifically for micro-instruments — endodontic files, scaler tips, surgical burs and orthodontic bands — and patented.',
  },
  {
    label: 'Validation',
    title: '100% microbial elimination',
    text: 'In controlled clinical trials using Bacillus pumilus spore strips, a highly resilient biological indicator, SteriFast achieved a 100% microbial elimination rate.',
  },
  {
    label: 'Recognition',
    title: 'Dental Innovation of the Year',
    text: 'The device won the Dental Innovation of the Year Award from Indian Dental Divas, recognizing its approach to chairside sterilization.',
  },
  {
    label: 'Today',
    title: 'A full dental hardware catalog',
    text: 'Quest Dental Products now supplies sterilization devices, cleaning attachments, surgical instruments, clinical hardware, lab equipment and restorative materials — backed by installation, training and servicing support.',
  },
];

const stats = [
  { target: 100, suffix: '%', label: 'Microbial elimination in trials' },
  { target: 12, suffix: '+', label: 'Years in dental technology' },
  { target: 9, suffix: '', label: 'Products across the catalog' },
  { target: 1, suffix: '', label: 'Patented flagship device' },
];

export default function About() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-medium">
          Our story
        </p>
        <h1 className="font-heading font-black text-6xl md:text-7xl tracking-tight uppercase leading-[0.9] mb-6">
          About
        </h1>
        <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl">
          Quest Dental Products is a Mumbai-based dental technology company built
          around SteriFast, a patented rapid-sterilization device for small dental
          instruments — and a growing catalog of hardware and services for modern
          clinical practice.
        </p>
      </div>

      <div className="bg-ink">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading font-black text-3xl md:text-4xl text-white">
                <CountUp target={s.target} suffix={s.suffix} />
              </p>
              <p className="text-xs text-white/50 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="font-heading font-bold text-2xl uppercase tracking-tight mb-8">
          From idea to catalog
        </h2>

        <div>
          {timeline.map((t, i) => (
            <div
              key={t.title}
              className="flex gap-6 pb-10 relative animate-riseIn"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {i < timeline.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-line" />
              )}
              <div className="w-8 h-8 rounded-full bg-ink text-white text-xs font-medium flex items-center justify-center shrink-0 z-10">
                {i + 1}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
                  {t.label}
                </p>
                <p className="font-heading font-bold text-xl mb-1">{t.title}</p>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="card bg-ink text-white border-ink flex items-center gap-4">
          <i className="ti ti-award text-3xl" aria-hidden="true"></i>
          <div>
            <p className="font-heading font-bold text-lg">Dental Innovation of the Year</p>
            <p className="text-sm text-mute">Awarded by Indian Dental Divas</p>
          </div>
        </div>
      </div>

      <section className="bg-neutral-50 border-t border-line">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="font-heading font-black text-3xl uppercase tracking-tight mb-3">
            Work with us
          </h2>
          <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
            Explore the full catalog or get in touch to discuss what your clinic
            needs.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/products" className="btn-secondary">
              View products
            </Link>
            <Link to="/contact" className="btn-primary">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}