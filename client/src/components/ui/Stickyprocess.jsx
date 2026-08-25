import React, { useEffect, useRef, useState } from 'react';

// Classic scrollytelling: a sticky panel on the left stays pinned while
// the user scrolls past a series of tall steps on the right. Whichever
// step is centered in the viewport becomes "active" and updates the
// pinned panel's content.
export default function StickyProcess({ steps }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActive(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="md:sticky md:top-24 h-fit">
        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
          Step {active + 1} of {steps.length}
        </p>
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-ink text-white mb-5 transition-transform duration-300">
          <i className={`ti ${steps[active].icon} text-2xl`} aria-hidden="true"></i>
        </div>
        <h3 className="font-heading font-black text-3xl uppercase tracking-tight mb-3">
          {steps[active].title}
        </h3>
        <p className="text-neutral-600 leading-relaxed max-w-sm">{steps[active].text}</p>

        <div className="flex gap-1.5 mt-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-ink' : 'w-4 bg-neutral-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        {steps.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => (stepRefs.current[i] = el)}
            data-index={i}
            className="min-h-[70vh] md:min-h-[60vh] flex items-center"
          >
            <div
              className={`w-full rounded-2xl border p-6 transition-all duration-300 ${
                i === active
                  ? 'border-ink bg-neutral-50 opacity-100 scale-100'
                  : 'border-line opacity-40 scale-95'
              }`}
            >
              <p className="font-heading font-black text-4xl text-neutral-300 mb-3">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="font-heading font-bold text-xl mb-2">{s.title}</p>
              <p className="text-sm text-neutral-600">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}