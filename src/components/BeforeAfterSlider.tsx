import React, { useState, useRef } from 'react';
import { MoveHorizontal } from 'lucide-react';
import paintBeforeSwirlsImg from '../assets/images/paint_before_swirls_1794151982499.jpg';
import paintAfterCeramicImg from '../assets/images/paint_after_ceramic_1794151984739.jpg';

const BEFORE_IMAGE = paintBeforeSwirlsImg;
const AFTER_IMAGE = paintAfterCeramicImg;

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updatePositionFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.round((x / rect.width) * 100);
    setSliderPosition(percentage);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="before-after"
      aria-labelledby="before-after-heading"
      className="py-20 lg:py-28 scroll-mt-20 border-t border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-medium text-cyan-400 tracking-wide mb-2">
              02. Multi-Stage Paint Correction Proof
            </p>
            <h2
              id="before-after-heading"
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance"
            >
              Swirl-Marred Clear Coat vs. 9H Liquid Glass Mirror Finish
            </h2>
          </div>

          {/* Preset Quick-Compare Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setSliderPosition(15)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                sliderPosition <= 25
                  ? 'bg-cyan-400 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Inspect Ceramic (85%)
            </button>
            <button
              type="button"
              onClick={() => setSliderPosition(50)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                sliderPosition > 25 && sliderPosition < 75
                  ? 'bg-cyan-400 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              50/50 Split
            </button>
            <button
              type="button"
              onClick={() => setSliderPosition(85)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                sliderPosition >= 75
                  ? 'bg-cyan-400 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Inspect Swirls (85%)
            </button>
          </div>
        </div>

        {/* Interactive Slider Viewport */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative w-full aspect-16/10 sm:aspect-16/9 max-h-[580px] rounded-2xl overflow-hidden border border-slate-800 select-none cursor-ew-resize bg-slate-900 shadow-2xl touch-pan-y"
        >
          {/* Base Layer: AFTER (Mirror Gloss Ceramic Finish) */}
          <img
            src={AFTER_IMAGE}
            alt="After multi-stage paint correction and 9H ceramic coating with deep mirror gloss and water beading"
            referrerPolicy="no-referrer"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Clipped Overlay Layer: BEFORE (Dull Swirled Paint) */}
          <div
            data-testid="before-overlay-clip"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <img
              src={BEFORE_IMAGE}
              alt="Before paint correction showing heavy circular wash swirls and micro-scratches under inspection lamp"
              referrerPolicy="no-referrer"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Center Draggable Divider Line & Handle */}
          <div
            style={{ left: `${sliderPosition}%` }}
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.9)] pointer-events-none"
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-xl">
              <MoveHorizontal className="w-5 h-5" />
            </div>
          </div>

          {/* Top Scrim & Corner Labels */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/75 to-transparent pointer-events-none z-20" />
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 pointer-events-none z-20">
            <span className="text-xs sm:text-sm font-medium text-slate-200 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg shadow-md">
              Before: Dealership Wash Swirls & Oxidation (61.4 GU)
            </span>
          </div>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none z-20">
            <span className="text-xs sm:text-sm font-medium text-cyan-300 bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 px-3 py-1.5 rounded-lg shadow-md">
              After: 2-Stage Correction + 9H Ceramic (98.6 GU)
            </span>
          </div>

          {/* Bottom Scrim & Accessible Range Control */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-300">
              Drag the handle or use the slider to inspect clear-coat defect removal under Scangrip
              daylight lamps.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-64">
              <label htmlFor="paint-comparison-slider" className="sr-only">
                Before and After Paint Correction Comparison Percentage
              </label>
              <input
                id="paint-comparison-slider"
                type="range"
                min={0}
                max={100}
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                aria-label="Before and After Paint Correction Comparison Percentage"
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="font-mono-num text-xs text-cyan-300 w-10 text-right shrink-0">
                {sliderPosition}%
              </span>
            </div>
          </div>
        </div>

        {/* Quantitative Inspection Proof Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400">Gloss Meter Reading (60° Angle)</div>
            <div className="text-xl font-bold text-white font-mono-num mt-1">
              61.4 GU → 98.6 GU (+60.5%)
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Measured via Rhopoint IQ-S glossmeter across 12 panels on a 2023 Porsche 911 GT3.
            </p>
          </div>
          <div>
            <div className="text-xs text-slate-400">Ultrasonic Clear-Coat Preservation</div>
            <div className="text-xl font-bold text-white font-mono-num mt-1">
              &lt; 2.8 µm Removed
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Digital DeFelsko PosiTector depth mapping before every Rupes rotary & dual-action pass.
            </p>
          </div>
          <div>
            <div className="text-xs text-slate-400">Hydrophobic Contact Angle</div>
            <div className="text-xl font-bold text-white font-mono-num mt-1">
              114° Water Beading
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Infrared-lamp cured Gyeon Infinite / Kamikaze Miyabi coat in our dust-controlled bay.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
