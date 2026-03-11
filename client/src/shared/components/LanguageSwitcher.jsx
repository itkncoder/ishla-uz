import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439' },
  { code: 'en', label: 'English' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleChange = (code) => {
    i18n.changeLanguage(code)
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-0.5 w-full">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            lang.code === i18n.language
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  )
}
