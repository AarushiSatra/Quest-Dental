import React, { useEffect, useRef, useState } from 'react';

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const monthLabel = (date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

// A custom calendar date picker (styled to match the site, unlike the
// native browser date input) that only allows selecting today or a
// future date — every day before today is disabled.
export default function DatePicker({ value, onChange, placeholder = 'Select a date' }) {
  const today = startOfDay(new Date());
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : today);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const isPastMonth = year === today.getFullYear() && month === today.getMonth();

  function goPrevMonth() {
    if (isPastMonth) return;
    setViewDate(new Date(year, month - 1, 1));
  }
  function goNextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  function selectDay(day) {
    onChange(toISODate(day));
    setOpen(false);
  }

  const selectedISO = value || '';
  const displayLabel = value
    ? new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : placeholder;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="field flex items-center justify-between w-full text-left"
      >
        <span className="flex items-center gap-2">
          <i className="ti ti-calendar text-neutral-400" aria-hidden="true"></i>
          <span className={value ? '' : 'text-neutral-400'}>{displayLabel}</span>
        </span>
        <i className={`ti ti-chevron-down text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true"></i>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-72 bg-white border border-line rounded-xl shadow-lg p-4 animate-riseIn">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={goPrevMonth}
              disabled={isPastMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Previous month"
            >
              <i className="ti ti-chevron-left text-sm" aria-hidden="true"></i>
            </button>
            <p className="text-sm font-medium text-ink">{monthLabel(viewDate)}</p>
            <button
              type="button"
              onClick={goNextMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
              aria-label="Next month"
            >
              <i className="ti ti-chevron-right text-sm" aria-hidden="true"></i>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekdayLabels.map((w, i) => (
              <div key={i} className="text-center text-[10px] text-neutral-400 py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const iso = toISODate(day);
              const isPast = startOfDay(day) < today;
              const isSelected = iso === selectedISO;
              const isToday = iso === toISODate(today);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isPast}
                  onClick={() => selectDay(day)}
                  className={`aspect-square rounded-lg text-xs flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-ink text-white font-medium'
                      : isPast
                      ? 'text-neutral-300 cursor-not-allowed'
                      : isToday
                      ? 'border border-ink text-ink font-medium hover:bg-neutral-100'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}