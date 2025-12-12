import { Button } from '@/components/ui/button'
import { Filter, ArrowUpDown } from 'lucide-react'
import type { ReactNode } from 'react'

interface FilterOption {
  label: string
  value: string
}

interface SortOption {
  label: string
  value: string
}

interface FilterControlsProps {
  sortValue: string
  onSortChange: (value: string) => void
  sortOptions: SortOption[]
  onReset: () => void
  resetDisabled: boolean
  children?: ReactNode
}

export function FilterControls({
  sortValue,
  onSortChange,
  sortOptions,
  onReset,
  resetDisabled,
  children
}: FilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
      {/* Custom filters passed as children */}
      {children}

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 flex-shrink-0" />
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="border rounded px-3 py-2 bg-background flex-1 sm:flex-initial"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={onReset}
        disabled={resetDisabled}
        className="w-full sm:w-auto"
      >
        Réinitialiser
      </Button>
    </div>
  )
}

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  allLabel: string
}

export function FilterSelect({ value, onChange, options, allLabel }: FilterSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 flex-shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 bg-background flex-1 sm:flex-initial sm:min-w-[150px]"
      >
        <option value="all">{allLabel}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
