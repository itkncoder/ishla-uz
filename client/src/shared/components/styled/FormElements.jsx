export function Input({ label, required, optional, className, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
          <span>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</span>
          {optional && <span className="text-xs font-normal text-gray-400">({optional})</span>}
        </label>
      )}
      <input
        {...props}
        className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}

export function Select({ label, required, options = [], placeholder, className, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <select
        {...props}
        className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3 text-sm text-gray-900 outline-none transition-all focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 focus:bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

export function Textarea({ label, optional, className, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
          <span>{label}</span>
          {optional && <span className="text-xs font-normal text-gray-400">({optional})</span>}
        </label>
      )}
      <textarea
        {...props}
        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 focus:bg-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}

export function SaveButton({ label, ...props }) {
  return (
    <button
      {...props}
      className="px-5 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer"
    >
      {label}
    </button>
  )
}

export function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-[#004AAD]/40 hover:text-[#004AAD] hover:bg-[#e8f0fe]/50 transition-all cursor-pointer w-full justify-center"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      {label}
    </button>
  )
}

export function ItemCard({ children, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 group">
      <div className="flex-1 min-w-0">{children}</div>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
