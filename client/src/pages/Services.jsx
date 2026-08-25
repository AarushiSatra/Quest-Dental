import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import BookingModal from '../components/forms/BookingModal.jsx';

export default function Services() {
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    api.get('/services').then(setServices).catch(() => setServices([]));
  }, []);

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-medium">
          Beyond the product line
        </p>
        <h1 className="font-heading font-black text-6xl md:text-7xl tracking-tight uppercase leading-[0.9]">
          Services
        </h1>
        <p className="text-neutral-600 mt-4 max-w-xl">
          Installation, training, servicing and bulk order support — click any
          service to book it directly.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {services.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActiveService(s)}
            className="group w-full flex items-start gap-6 py-8 border-t border-line hover:bg-neutral-50 transition-colors -mx-4 px-4 animate-riseIn text-left"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="font-heading font-black text-3xl md:text-4xl text-neutral-300 group-hover:text-ink transition-colors w-16 shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ink text-white shrink-0 mt-1">
              <i className={`ti ${s.icon} text-xl`} aria-hidden="true"></i>
            </div>

            <div className="flex-1">
              <p className="font-heading font-bold text-xl mb-1">{s.name}</p>
              <p className="text-sm text-neutral-600 max-w-xl">{s.description}</p>
            </div>

            <span className="text-xs font-medium border border-line rounded-full px-3 py-1.5 self-center shrink-0 hidden sm:block group-hover:bg-ink group-hover:text-white group-hover:border-ink transition-colors">
              Book now
            </span>
          </button>
        ))}
        <div className="border-t border-line" />
      </div>

      <section className="bg-ink">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white uppercase tracking-tight mb-3">
            Need a custom setup?
          </h2>
          <p className="text-white/60 mb-6 max-w-xl mx-auto">
            From turnkey installations to bulk institutional orders, our team
            scopes it with you directly.
          </p>
          <Link to="/contact" className="btn-primary inline-block">
            Talk to our team
          </Link>
        </div>
      </section>

      {activeService && (
        <BookingModal service={activeService} onClose={() => setActiveService(null)} />
      )}
    </div>
  );
}