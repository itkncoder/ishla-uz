import { useRef } from 'react'

const DIGITS_MAX = 9

// Extract only the 9 local digits, always stripping the 998 country code
function extractDigits(str) {
  const all = (str || '').replace(/\D/g, '')
  if (all.startsWith('998')) return all.slice(3, 3 + DIGITS_MAX)
  return all.slice(0, DIGITS_MAX)
}

// Format: +998 (XX) XXX-XX-XX — only shows as far as digits go
function formatDisplay(digits) {
  if (!digits) return '+998 '
  let r = '+998 ('
  r += digits.slice(0, 2)
  if (digits.length <= 2) return r
  r += ') '
  r += digits.slice(2, 5)
  if (digits.length <= 5) return r
  r += '-'
  r += digits.slice(5, 7)
  if (digits.length <= 7) return r
  r += '-'
  r += digits.slice(7, 9)
  return r
}

export default function PhoneInput({ label, required, value, onChange, placeholder, disabled }) {
  const inputRef = useRef(null)

  const digits = extractDigits(value)
  const display = digits ? formatDisplay(digits) : ''

  const placeCursor = (d) => {
    const pos = formatDisplay(d || '').length
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(pos, pos)
      }
    })
  }

  const handleChange = (e) => {
    const newDigits = extractDigits(e.target.value)
    onChange(newDigits ? `+998${newDigits}` : '')
    placeCursor(newDigits)
  }

  const handleFocus = () => {
    if (!digits) {
      // Don't call onChange — just place cursor after render
    }
    placeCursor(digits)
  }

  const handleClick = () => {
    const el = inputRef.current
    if (!el) return
    const prefixLen = 6 // "+998 (" length
    if (el.selectionStart < prefixLen && digits) {
      placeCursor('')
    }
  }

  const handleKeyDown = (e) => {
    if (disabled) return
    const el = inputRef.current
    if (!el) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      if (!digits) return
      const newDigits = digits.slice(0, -1)
      onChange(newDigits ? `+998${newDigits}` : '')
      placeCursor(newDigits)
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="tel"
        value={display}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onClick={handleClick}
        placeholder={placeholder || '+998 (__) ___-__-__'}
        disabled={disabled}
        className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
      />
    </div>
  )
}
