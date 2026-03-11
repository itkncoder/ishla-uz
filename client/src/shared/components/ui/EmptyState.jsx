import clsx from 'clsx'

export default function EmptyState({ icon, title, message, action, className }) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-12', className)}>
      {icon && <div className="text-5xl mb-4 opacity-30">{icon}</div>}
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>}
      {message && <p className="text-gray-500 text-sm text-center max-w-md">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
