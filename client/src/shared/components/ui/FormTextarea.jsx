import clsx from 'clsx'

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  rows = 4,
  className,
}) {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={clsx(
          'w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#004AAD] focus:ring-1 focus:ring-[#004AAD]',
          error ? 'border-red-300' : 'border-gray-300',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
        )}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
