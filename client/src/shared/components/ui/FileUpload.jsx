import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { validateFile } from '@shared/utils/sanitize'

export default function FileUpload({
  label,
  accept = '.pdf,.jpg,.jpeg,.png,.webp',
  maxSize,
  onChange,
  preview,
  error: externalError,
  disabled,
  className,
}) {
  const { t } = useTranslation('common')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const inputRef = useRef(null)

  const error = externalError || validationError

  const handleFile = (file) => {
    if (!file) return
    setValidationError(null)

    const err = validateFile(file)
    if (err) {
      setValidationError(err)
      // Reset the input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setFileName(file.name)
    onChange?.(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
        </label>
      )}
      <div
        className={clsx(
          'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
          dragOver ? 'border-[#004AAD] bg-[#e8f0fe]/30' : 'border-gray-200 hover:border-[#004AAD]/50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-300'
        )}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        {preview ? (
          <div className="flex flex-col items-center gap-2">
            <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
            <span className="text-sm text-gray-500">{fileName || 'Click to replace'}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {fileName ? (
              <span className="text-sm font-medium text-[#004AAD]">{fileName}</span>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-700">{t('ui.dropFileOrClick')}</span>
                <span className="text-xs text-gray-400">{t('ui.allowedFileTypes')}</span>
              </>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
