import React, { useRef, useState } from 'react';

// Drag-to-reveal comparison: right side ("after") is clipped by a
// draggable divider so the user physically slides between the two states.
export default function CompareSlider({ leftLabel, rightLabel, leftContent, rightContent }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX) {
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }

  function handlePointerDown(e) {
    dragging.current = true;
    updateFromClientX(e.clientX ?? e.touches?.[0]?.clientX);
  }
  function handlePointerMove(e) {
    if (!dragging.current) return;
    updateFromClientX(e.clientX ?? e.touches?.[0]?.clientX);
  }
  function stopDragging() {
    dragging.current = false;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-line"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={stopDragging}
    >
      {/* Left / "before" layer, full width */}
      <div className="absolute inset-0 bg-neutral-200 flex flex-col items-center justify-center p-6 text-center">
        <i className="ti ti-clock-hour-9 text-4xl text-neutral-500 mb-3" aria-hidden="true"></i>
        <p className="font-heading font-bold text-2xl text-neutral-700">{leftContent}</p>
        <p className="text-xs uppercase tracking-wide text-neutral-500 mt-2">{leftLabel}</p>
      </div>

      {/* Right / "after" layer, clipped to reveal only up to the divider */}
      <div
        className="absolute inset-0 bg-ink flex flex-col items-center justify-center p-6 text-center"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <i className="ti ti-bolt text-4xl text-white mb-3" aria-hidden="true"></i>
        <p className="font-heading font-bold text-2xl text-white">{rightContent}</p>
        <p className="text-xs uppercase tracking-wide text-mute mt-2">{rightLabel}</p>
      </div>

      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <i className="ti ti-arrows-horizontal text-ink" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  );
}