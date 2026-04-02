import { useState, useEffect } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
  suffix?: string;
}

export function RangeSlider({ min, max, value, onChange, label = 'Points', suffix = 'points' }: RangeSliderProps) {
  const [minInput, setMinInput] = useState(String(value[0]));
  const [maxInput, setMaxInput] = useState(String(value[1]));

  const [minVal, maxVal] = value;

  useEffect(() => { setMinInput(String(minVal)); }, [minVal]);
  useEffect(() => { setMaxInput(String(maxVal)); }, [maxVal]);

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const minPercent = max > min ? ((minVal - min) / (max - min)) * 100 : 0;
  const maxPercent = max > min ? ((maxVal - min) / (max - min)) * 100 : 100;

  return (
    <div className="flex items-center gap-3 flex-1 sm:min-w-[300px]">
      <div className="flex-1 space-y-3">
        {/* Dual range slider track */}
        <div className="relative flex w-full touch-none select-none items-center h-5">
          <div className="relative h-2 w-full rounded-full bg-secondary">
            <div
              className="absolute h-full bg-primary rounded-full"
              style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            onChange={(e) => {
              const v = Math.min(Number(e.target.value), maxVal - 1);
              onChange([v, maxVal]);
            }}
            className="range-thumb"
            style={{ zIndex: minVal > (min + max) / 2 ? 5 : 3 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            onChange={(e) => {
              const v = Math.max(Number(e.target.value), minVal + 1);
              onChange([minVal, v]);
            }}
            className="range-thumb"
            style={{ zIndex: 4 }}
          />
        </div>

        {/* Number inputs */}
        <div className="flex gap-2 items-center text-sm">
          <input
            type="number"
            min={min}
            max={maxVal}
            value={minInput}
            onChange={(e) => {
              setMinInput(e.target.value);
              const v = Number(e.target.value);
              if (!isNaN(v)) onChange([clamp(v, min, maxVal), maxVal]);
            }}
            onBlur={() => {
              const v = Number(minInput);
              const clamped = isNaN(v) ? min : clamp(v, min, maxVal);
              onChange([clamped, maxVal]);
              setMinInput(String(clamped));
            }}
            className="w-20 h-9 px-2 border rounded bg-background text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            min={minVal}
            max={max}
            value={maxInput}
            onChange={(e) => {
              setMaxInput(e.target.value);
              const v = Number(e.target.value);
              if (!isNaN(v)) onChange([minVal, clamp(v, minVal, max)]);
            }}
            onBlur={() => {
              const v = Number(maxInput);
              const clamped = isNaN(v) ? max : clamp(v, minVal, max);
              onChange([minVal, clamped]);
              setMaxInput(String(clamped));
            }}
            className="w-20 h-9 px-2 border rounded bg-background text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-muted-foreground">{suffix}</span>
        </div>
      </div>

      {/* CSS for range thumbs */}
      <style>{`
        input[type="range"].range-thumb {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          margin: 0;
          padding: 0;
          pointer-events: none;
          background: none;
          -webkit-appearance: none;
          appearance: none;
        }
        input[type="range"].range-thumb::-webkit-slider-runnable-track {
          background: none;
          border: none;
        }
        input[type="range"].range-thumb::-moz-range-track {
          background: none;
          border: none;
        }
        input[type="range"].range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--primary));
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 0 2px rgba(0,0,0,0.1);
          margin-top: -6px;
        }
        input[type="range"].range-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--primary));
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 0 2px rgba(0,0,0,0.1);
        }
        input[type="range"].range-thumb::-webkit-slider-thumb:hover {
          background: hsl(var(--accent));
        }
        input[type="range"].range-thumb::-moz-range-thumb:hover {
          background: hsl(var(--accent));
        }
        input[type="range"].range-thumb:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
