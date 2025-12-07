import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  className?: string
}

export function Slider({ min, max, step = 1, value, onValueChange, className }: SliderProps) {
  // Clamp values to min/max range
  const clamp = (val: number, minimum: number, maximum: number) =>
    Math.max(minimum, Math.min(maximum, val))

  const [minValue, maxValue] = [
    clamp(value[0], min, max),
    clamp(value[1], min, max)
  ]

  const minPercent = ((minValue - min) / (max - min)) * 100
  const maxPercent = ((maxValue - min) / (max - min)) * 100

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxValue - step)
    onValueChange([newMin, maxValue])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minValue + step)
    onValueChange([minValue, newMax])
  }

  // Inline styles - simple approach, only style the thumbs
  const rangeInputStyle = `
    input[type="range"].range-slider {
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
      -moz-appearance: none;
      appearance: none;
    }
    /* Hide all track elements */
    input[type="range"].range-slider::-webkit-slider-runnable-track {
      background: none;
      border: none;
    }
    input[type="range"].range-slider::-moz-range-track {
      background: none;
      border: none;
    }
    input[type="range"].range-slider::-ms-track {
      background: none;
      border: none;
      color: transparent;
    }
    /* Style only the thumbs */
    input[type="range"].range-slider::-webkit-slider-thumb {
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
    input[type="range"].range-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: hsl(var(--background));
      border: 2px solid hsl(var(--primary));
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 0 2px rgba(0,0,0,0.1);
    }
    input[type="range"].range-slider::-webkit-slider-thumb:hover {
      background: hsl(var(--accent));
    }
    input[type="range"].range-slider::-moz-range-thumb:hover {
      background: hsl(var(--accent));
    }
    input[type="range"].range-slider:focus {
      outline: none;
    }
  `

  return (
    <>
      <style>{rangeInputStyle}</style>
      <div className={cn("relative flex w-full touch-none select-none items-center h-5", className)}>
        {/* Track */}
        <div className="relative h-2 w-full rounded-full bg-secondary">
          {/* Active range */}
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />
        </div>

        {/* Min thumb - higher z-index when closer to max */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="range-slider"
          style={{ zIndex: minValue > (min + max) / 2 ? 5 : 3 }}
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="range-slider"
          style={{ zIndex: 4 }}
        />
      </div>
    </>
  )
}
