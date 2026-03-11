import clsx from 'clsx'

const COLOR_MAP = {
  primary: 'bg-[#004AAD]',
  success: 'bg-[#004AAD]',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export default function ProgressBar({ value = 0, max = 100, label, showPercent = true, size = 'md', color = 'primary', className }) {
  const pct = Math.round((value / max) * 100)

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size]

  const barColor = COLOR_MAP[color] || COLOR_MAP.primary

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercent && <span className="text-sm text-gray-500">{pct}%</span>}
        </div>
      )}
      <div className={clsx('w-full rounded-full bg-gray-100 overflow-hidden', heightClass)}>
        <div
          className={clsx('h-full rounded-full transition-all', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
