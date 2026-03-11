import { useEffect, useRef } from 'react'
import clsx from 'clsx'

export default function Modal({ open, onClose, title, children, actions, className, size = 'md' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }[size]

  return (
    <dialog
      ref={dialogRef}
      className={clsx('fixed inset-0 z-50 m-0 h-full w-full bg-transparent p-0 backdrop:bg-black/40', className)}
      onClose={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={clsx('w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-xl', sizeClass)}>
          {title && <h3 className="text-lg font-semibold text-gray-900 mb-5">{title}</h3>}
          {children}
          {actions && (
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              {actions}
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="fixed inset-0 -z-10">
        <button className="h-full w-full cursor-default" onClick={onClose} />
      </form>
    </dialog>
  )
}
