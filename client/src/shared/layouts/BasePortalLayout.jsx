import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@shared/components/LanguageSwitcher'
import useAuthStore from '@stores/authStore'
import useUiStore from '@stores/uiStore'

export default function BasePortalLayout({ sidebarItems, portalTitle }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-5 transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="text-xl font-bold mb-8 px-2">
          ISHLA<span className="text-[#004AAD]">.UZ</span>
        </div>
        <nav className="space-y-1">
          {sidebarItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={i === 0}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#004AAD]/10 text-[#004AAD]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => {
                if (window.innerWidth < 1024) setSidebarOpen(false)
              }}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{t(item.label)}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-5 h-16 flex items-center">
          <button
            className="lg:hidden mr-3 text-gray-500 hover:text-gray-700 p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="text-lg font-semibold text-gray-900">{portalTitle}</span>

          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher variant="light" />

            {user && (
              <span className="text-sm text-gray-500 hidden sm:inline">
                {user.name || user.email}
              </span>
            )}

            <button
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => { logout(); navigate('/') }}
            >
              {t('common:logout', 'Logout')}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
