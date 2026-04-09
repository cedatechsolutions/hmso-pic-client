import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import {
  datePickerPopoverClasses,
  datePickerTriggerClasses,
  fieldClasses,
  fieldLabelClasses,
} from './styles'

type DatePickerFieldProps = {
  label: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  value: string
}

const displayFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const parseStoredDate = (value: string) => {
  if (!value) {
    return undefined
  }

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  const date = new Date(year, month - 1, day)

  return Number.isNaN(date.getTime()) ? undefined : date
}

const formatStoredDate = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function DatePickerField({
  label,
  onChange,
  placeholder = 'Select date',
  required = false,
  value,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonId = useId()
  const contentId = `${buttonId}-calendar`
  const selectedDate = useMemo(() => parseStoredDate(value), [value])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div ref={wrapperRef} className={`${fieldClasses} relative`}>
      <span className={fieldLabelClasses}>
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>

      <button
        id={buttonId}
        type="button"
        className={datePickerTriggerClasses}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={selectedDate ? 'text-slate-800' : 'text-[#8a94a3]'}>
          {selectedDate ? displayFormatter.format(selectedDate) : placeholder}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div id={contentId} className={datePickerPopoverClasses}>
          <DayPicker
            animate
            mode="single"
            navLayout="after"
            selected={selectedDate}
            showOutsideDays
            onSelect={(date) => {
              if (!date) {
                return
              }

              onChange(formatStoredDate(date))
              setIsOpen(false)
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

export default DatePickerField
