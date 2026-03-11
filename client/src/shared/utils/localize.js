/**
 * Extract a translated string from a multilingual object { en, ru, uz }.
 * Falls back to: current lang → 'en' → 'ru' → first available value → ''.
 */
export default function localize(obj, lang) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[lang] || obj.en || obj.ru || Object.values(obj)[0] || ''
}

/**
 * Get localized label from a classification item { label, labelEn, labelUz }.
 * Falls back: labelLang → labelEn → label (ru) → ''.
 */
export function localizeLabel(item, lang) {
  if (!item) return ''
  if (typeof item === 'string') return item
  if (lang === 'en') return item.labelEn || item.label || ''
  if (lang === 'uz') return item.labelUz || item.labelEn || item.label || ''
  return item.label || item.labelEn || ''
}
