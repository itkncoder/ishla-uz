import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function MultiSelect({ label, required, value = [], onChange, options = [], placeholder }) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus()
    if (!open) setSearch('')
  }, [open])

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()) && !value.includes(o))
    : options.filter((o) => !value.includes(o))

  const handleAdd = (item) => {
    onChange([...value, item])
  }

  const handleRemove = (item) => {
    onChange(value.filter((v) => v !== item))
  }

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f0fe] text-[#003275] text-sm font-medium border border-[#a8c7f5]"
          >
            {item}
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="text-[#6ba3e0] hover:text-red-500 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        {value.length === 0 && !open && (
          <span className="text-sm text-gray-400">{placeholder || 'No items selected'}</span>
        )}
      </div>

      {/* Add Button / Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm transition-all cursor-pointer ${
            open
              ? 'border-[#004AAD] ring-2 ring-[#004AAD]/10 bg-white text-[#004AAD]'
              : 'border-gray-200 bg-gray-50/50 text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full max-w-xs rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
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
            <div className="max-h-48 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3.5 py-3 text-sm text-gray-400 text-center">{t('ui.noMoreOptions')}</div>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleAdd(item)}
                    className="w-full text-left px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {item}
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
