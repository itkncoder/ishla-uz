import { useState, useRef, useEffect, useMemo } from 'react'

function parse(dateStr) {
  if (!dateStr) return { day: null, month: null, year: null }
  const [y, m, d] = dateStr.split('-')
  return { day: parseInt(d, 10) || null, month: parseInt(m, 10) || null, year: parseInt(y, 10) || null }
}

function fmt(day, month, year) {
  if (!day || !month || !year) return ''
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function daysInMonth(m, y) {
  if (!m) return 31
  return new Date(y || 2000, m, 0).getDate()
}

export default function DatePicker({ label, required, value, onChange, placeholder, labels = {}, yearRange }) {
  const [open, setOpen] = useState(null) // 'day' | 'month' | 'year' | null
  const ref = useRef(null)

  const parsed = useMemo(() => parse(value), [value])
  const [day, setDay] = useState(parsed.day)
  const [month, setMonth] = useState(parsed.month)
  const [year, setYear] = useState(parsed.year)

  useEffect(() => {
    const p = parse(value)
    setDay(p.day)
    setMonth(p.month)
    setYear(p.year)
  }, [value])

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const dayLabel = labels.day || 'Day'
  const monthLabel = labels.month || 'Month'
  const yearLabel = labels.year || 'Year'
  const monthsShort = labels.monthsShort || {}
  const monthsFull = labels.monthsFull || {}

  const getMonthShort = (m) => monthsShort[m] || m
  const getMonthFull = (m) => monthsFull[m] || monthsShort[m] || m

  const currentYear = new Date().getFullYear()
  const years = useMemo(() => {
    const [from, to] = yearRange || [currentYear - 80, currentYear - 18]
    const arr = []
    if (from <= to) {
      for (let y = to; y >= from; y--) arr.push(y)
    } else {
      for (let y = from; y >= to; y--) arr.push(y)
    }
    return arr
  }, [currentYear, yearRange])

  const maxDays = daysInMonth(month || 1, year || 2000)
  const days = useMemo(() => Array.from({ length: maxDays }, (_, i) => i + 1), [maxDays])

  const commit = (d, m, y) => {
    if (d && m && y) {
      onChange(fmt(Math.min(d, daysInMonth(m, y)), m, y))
    }
  }

  const selectDay = (d) => {
    setDay(d)
    commit(d, month, year)
    setOpen(month ? (year ? null : 'year') : 'month')
  }

  const selectMonth = (m) => {
    setMonth(m)
    const clamped = day ? Math.min(day, daysInMonth(m, year || 2000)) : day
    setDay(clamped)
    commit(clamped, m, year)
    setOpen(year ? (day ? null : 'day') : 'year')
  }

  const selectYear = (y) => {
    setYear(y)
    const clamped = day ? Math.min(day, daysInMonth(month || 1, y)) : day
    setDay(clamped)
    commit(clamped, month, y)
    setOpen(day ? (month ? null : 'month') : 'day')
  }

  const toggle = (panel) => setOpen(open === panel ? null : panel)

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {/* Day */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggle('day')}
            className={`w-full h-10 rounded-lg border bg-gray-50/50 px-3 text-sm outline-none transition-all flex items-center justify-between gap-1 cursor-pointer ${
              open === 'day' ? 'border-[#004AAD] ring-2 ring-[#004AAD]/10 bg-white' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className={day ? 'text-gray-900' : 'text-gray-400'}>{day || dayLabel}</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${open === 'day' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {open === 'day' && (
            <DropdownList items={days} value={day} onSelect={selectDay} />
          )}
        </div>

        {/* Month */}
        <div className="relative flex-[1.4]">
          <button
            type="button"
            onClick={() => toggle('month')}
            className={`w-full h-10 rounded-lg border bg-gray-50/50 px-3 text-sm outline-none transition-all flex items-center justify-between gap-1 cursor-pointer ${
              open === 'month' ? 'border-[#004AAD] ring-2 ring-[#004AAD]/10 bg-white' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className={month ? 'text-gray-900' : 'text-gray-400'}>
              {month ? getMonthShort(month) : monthLabel}
            </span>
            <svg className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${open === 'month' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {open === 'month' && (
            <DropdownList
              items={Array.from({ length: 12 }, (_, i) => i + 1)}
              value={month}
              onSelect={selectMonth}
              renderItem={(v) => getMonthFull(v)}
            />
          )}
        </div>

        {/* Year */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => toggle('year')}
            className={`w-full h-10 rounded-lg border bg-gray-50/50 px-3 text-sm outline-none transition-all flex items-center justify-between gap-1 cursor-pointer ${
              open === 'year' ? 'border-[#004AAD] ring-2 ring-[#004AAD]/10 bg-white' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className={year ? 'text-gray-900' : 'text-gray-400'}>{year || yearLabel}</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${open === 'year' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {open === 'year' && (
            <DropdownList items={years} value={year} onSelect={selectYear} />
          )}
        </div>
      </div>
    </div>
  )
}

function DropdownList({ items, value, onSelect, renderItem }) {
  const listRef = useRef(null)

  useEffect(() => {
    if (!listRef.current || !value) return
    const el = listRef.current.querySelector('[data-active="true"]')
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [value])

  return (
    <div className="absolute z-50 mt-1 left-0 right-0 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      <div ref={listRef} className="max-h-60 overflow-y-auto py-1">
        {items.map((item) => {
          const isActive = item === value
          return (
            <button
              key={item}
              type="button"
              data-active={isActive}
              onClick={() => onSelect(item)}
              className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                isActive
                  ? 'bg-[#e8f0fe] text-[#004AAD] font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{renderItem ? renderItem(item) : item}</span>
              {isActive && (
                <svg className="w-4 h-4 text-[#004AAD] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
