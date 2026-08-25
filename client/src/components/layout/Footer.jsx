import React from 'react';

export default function Footer() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const email = import.meta.env.VITE_CONTACT_EMAIL;

  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <p className="font-medium mb-2">Quest Dental Products</p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Quest+Dental+Products+Ghatkopar+West+Mumbai"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-600 hover:text-ink transition-colors"
          >
            Ghatkopar West, Mumbai, India
          </a>
          <p className="text-neutral-600 mt-1">Incubated at riidl, Somaiya Vidyavihar University</p>
        </div>

        <div>
          <p className="font-medium mb-2">Get in touch</p>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-neutral-600 hover:text-ink transition-colors mb-2"
          >
            <i className="ti ti-brand-whatsapp" aria-hidden="true"></i>
            WhatsApp us
          </a>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-neutral-600 hover:text-ink transition-colors"
          >
            <i className="ti ti-mail" aria-hidden="true"></i>
            {email}
          </a>
        </div>

        <div>
          <p className="font-medium mb-2">Company</p>
          <a href='\products' className="text-neutral-600 hover:text-ink transition-colors">
            Products
          </a><br></br>
          <a href='\services' className="text-neutral-600 hover:text-ink transition-colors mb -2">
            Services
          </a><br></br>
          <a href='\about' className="text-neutral-600 hover:text-ink transition-colors mb -2">
            About
          </a><br></br>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Quest Dental Products. All rights reserved.
      </div>
    </footer>
  );
}