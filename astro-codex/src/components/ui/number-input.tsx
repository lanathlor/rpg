import { Input } from './input'
import { Button } from './button'
import { Minus, Plus } from 'lucide-react'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function NumberInput({ value, onChange, min = 0, max, className }: NumberInputProps) {
  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <Button
        size="icon"
        variant="outline"
        className="h-7 w-7"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value) || min
          onChange(max !== undefined ? Math.min(max, Math.max(min, v)) : Math.max(min, v))
        }}
        min={min}
        max={max}
        className="h-7 w-14 text-center text-xs"
      />
      <Button
        size="icon"
        variant="outline"
        className="h-7 w-7"
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
        disabled={max !== undefined && value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
