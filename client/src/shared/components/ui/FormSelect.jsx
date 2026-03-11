import clsx from 'clsx'

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  required,
  disabled,
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={clsx(
          'w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#004AAD] focus:ring-1 focus:ring-[#004AAD] bg-white appearance-none',
          error ? 'border-red-300' : 'border-gray-300',
          !value && 'text-gray-400',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
