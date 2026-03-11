import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function Dropdown({ label, required, optional, value, onChange, options = [], placeholder, searchable = false }) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropUp, setDropUp] = useState(false)
  const ref = useRef(null)
  const searchRef = useRef(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        setDropUp(spaceBelow < 280)
      }
      if (searchable && searchRef.current) {
        searchRef.current.focus()
      }
    } else {
      setSearch('')
    }
  }, [open, searchable])

  const filtered = searchable && search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const handleSelect = (opt) => {
    onChange(opt.value)
    setOpen(false)
  }

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
          <span>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</span>
          {optional && <span className="text-xs font-normal text-gray-400">({optional})</span>}
        </label>
      )}
      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full h-10 rounded-lg border bg-gray-50/50 px-3.5 text-sm text-left outline-none transition-all flex items-center justify-between gap-2 cursor-pointer ${
            open ? 'border-[#004AAD] ring-2 ring-[#004AAD]/10 bg-white' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className={selected ? 'text-gray-900 truncate' : 'text-gray-400 truncate'}>
            {selected ? selected.label : placeholder || 'Select...'}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div className={`absolute z-50 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden ${dropUp ? 'bottom-full mb-1' : 'mt-1'}`}>
            {searchable && (
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-8 rounded-lg bg-gray-50 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none border border-gray-200 focus:border-[#004AAD] focus:ring-1 focus:ring-[#004AAD]/10"
                  />
                </div>
              </div>
            )}
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3.5 py-3 text-sm text-gray-400 text-center">{t('ui.noResults')}</div>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                      opt.value === value
                        ? 'bg-[#e8f0fe] text-[#004AAD] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {opt.value === value && (
                      <svg className="w-4 h-4 text-[#004AAD] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
