import React from 'react';
import QuoteRequestForm from '../components/forms/QuoteRequestForm.jsx';

const contactMethods = [
  {
    icon: 'ti-brand-whatsapp',
    title: 'WhatsApp',
    subtitle: 'Message us directly',
    href: (whatsappNumber) => `https://wa.me/${whatsappNumber}`,
  },
  {
    icon: 'ti-mail',
    title: 'Email',
    subtitle: (email) => email,
    href: (_, email) => `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
  },
  {
    icon: 'ti-map-pin',
    title: 'Location',
    subtitle: () => 'Ghatkopar West, Mumbai, India',
    href: () =>
      'https://www.google.com/maps/search/?api=1&query=Quest+Dental+Products+Ghatkopar+West+Mumbai',
  },
];

export default function Contact() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const email = import.meta.env.VITE_CONTACT_EMAIL;

  return (
    <div>
      <div className="bg-surface border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-sm text-accent font-medium mb-2">Get in touch</p>
          <h1 className="font-heading font-semibold text-4xl text-ink mb-3">Contact us</h1>
          <p className="text-neutral-600 max-w-lg">
            Reach out directly, or send a quote request and our team will
            follow up within 1 business day.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-3">
          {contactMethods.map((m) => (
            <a
              key={m.title}
              href={m.href(whatsappNumber, email)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 bg-white border border-line rounded-xl p-5 hover:border-ink transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <i className={`ti ${m.icon} text-xl`} aria-hidden="true"></i>
              </div>
              <div>
                <p className="font-medium text-ink">{m.title}</p>
                <p className="text-sm text-neutral-500">
                  {typeof m.subtitle === 'function' ? m.subtitle(email) : m.subtitle}
                </p>
              </div>
              <i className="ti ti-arrow-up-right text-neutral-300 ml-auto" aria-hidden="true"></i>
            </a>
          ))}

          <div className="bg-ink text-white rounded-xl p-5 mt-6">
            <p className="text-sm font-medium mb-1">Response time</p>
            <p className="text-sm text-white/60">
              Our team typically responds within 1 business day for quote and
              booking requests.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white border border-line rounded-2xl p-6 md:p-8">
            <p className="font-heading font-semibold text-xl text-ink mb-1">Request a quote</p>
            <p className="text-sm text-neutral-600 mb-6">
              Tell us about your clinic and what you're looking for.
            </p>
            <QuoteRequestForm />
          </div>
        </div>
      </div>
    </div>
  );
}