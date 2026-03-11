import clsx from 'clsx'

export default function StatsCard({ icon, value, label, trend, trendUp, className }) {
  return (
    <div className={clsx('rounded-2xl border border-gray-100 bg-white p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-[#004AAD]">{icon}</div>
        {trend && (
          <span
            className={clsx(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trendUp ? 'bg-[#e8f0fe] text-[#004AAD]' : 'bg-red-50 text-red-500'
            )}
          >
            {trendUp ? '+' : ''}{trend}
          </span>
        )}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  )
}
