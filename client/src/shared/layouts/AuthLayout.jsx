import { Outlet } from 'react-router'
import LanguageSwitcher from '@shared/components/LanguageSwitcher'
import { Link } from 'react-router'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-gray-700">ISHLA</span>
            <span className="text-[#004AAD]">.UZ</span>
          </Link>
          <LanguageSwitcher variant="light" />
        </div>
      </header>

      <div className="flex flex-1 items-start justify-center px-4 pt-10 pb-12">
        <Outlet />
      </div>

      <footer className="py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} ishla.uz
      </footer>
    </div>
  )
}
