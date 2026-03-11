import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@shared/components/LanguageSwitcher'
import RoleSwitcher from '@shared/components/RoleSwitcher'
import AuthModal from '@shared/components/AuthModal'
import useAuthStore from '@stores/authStore'
import logoVariant2 from '@shared/assets/logo_variant2.png'

const NAV_ITEMS = [
  {
    to: '/employer',
    key: 'dashboard',
    end: true,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    to: '/employer/chat',
    key: 'chat',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    to: '/employer/kyc',
    key: 'kyc',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
]

export default function EmployerPortalLayout() {
  const { t } = useTranslation('employer')
  const { t: tCommon } = useTranslation('common')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const switchRole = useAuthStore((s) => s.switchRole)

  useEffect(() => {
    switchRole('employer')
  }, [switchRole])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const userName = user?.name || 'Employer'
  const userInitial = userName.charAt(0).toUpperCase()
  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-[#004AAD]/10 text-[#004AAD]'
        : 'text-gray-600 hover:text-[#004AAD] hover:bg-gray-100'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
      isActive
        ? 'text-[#004AAD] bg-[#004AAD]/10'
        : 'text-gray-600 hover:text-[#004AAD] hover:bg-gray-100'
    }`

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <NavLink to="/employer" className="shrink-0">
              <img src={logoVariant2} alt="ISHLA.UZ" className="h-28" />
            </NavLink>
          </div>

          {/* Center: Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.key} to={item.to} end={item.end} className={linkClass}>
                {item.icon}
                <span>{t(`sidebar.${item.key}`)}</span>
              </NavLink>
            ))}
          </div>

          {/* Right: Profile/Auth (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004AAD] to-[#003275] flex items-center justify-center text-white text-sm font-semibold">
                    {userInitial}
                  </div>
                  <svg className={`w-3 h-3 opacity-50 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-gray-200 shadow-xl shadow-black/10 z-50 animate-[fadeIn_0.15s_ease-out]">
                    {/* User info */}
                    <div className="px-4 py-3.5 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004AAD] to-[#003275] flex items-center justify-center text-white text-sm font-bold">
                          {userInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Role switcher */}
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <RoleSwitcher />
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      <NavLink
                        to="/employer/kyc"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#004AAD] hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.25-4.5l-7.5 7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1">{t('sidebar.kyc')}</span>
                      </NavLink>
                      <NavLink
                        to="/employer/help"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#004AAD] hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        <span className="flex-1">{t('nav.help', 'Help')}</span>
                      </NavLink>
                    </div>

                    {/* Language */}
                    <div className="px-4 py-2 border-t border-gray-100">
                      <LanguageSwitcher />
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => { setUserMenuOpen(false); handleLogout() }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer rounded-b-xl"
                      >
                        <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        <span className="flex-1 text-left">{t('nav.logout', 'Logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button
                  onClick={() => setAuthModal('login')}
                  className="text-sm font-semibold bg-[#004AAD] text-white px-8 py-[7px] rounded-lg hover:bg-[#003d8f] transition-all duration-200 cursor-pointer shadow-lg shadow-[#004AAD]/20 whitespace-nowrap"
                >
                  {tCommon('landing.login', 'Login')}
                </button>
              </div>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden text-gray-600 hover:text-[#004AAD] p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 pb-3 animate-[fadeIn_0.15s_ease-out]">
            <div className="space-y-0.5 px-0 py-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end={item.end}
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  <span>{t(`sidebar.${item.key}`)}</span>
                </NavLink>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-1 pt-2 mx-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004AAD] to-[#003275] flex items-center justify-center text-white text-sm font-bold">
                      {userInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <RoleSwitcher />
                  </div>
                  <NavLink
                    to="/employer/kyc"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-[#004AAD] hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.25-4.5l-7.5 7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1">{t('sidebar.kyc')}</span>
                  </NavLink>
                  <NavLink
                    to="/employer/help"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-[#004AAD] hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    <span className="flex-1">{t('nav.help', 'Help')}</span>
                  </NavLink>
                  <div className="flex items-center px-3 py-2">
                    <LanguageSwitcher />
                  </div>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout() }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer rounded-lg"
                  >
                    <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    <span className="flex-1 text-left">{t('nav.logout', 'Logout')}</span>
                  </button>
                </>
              ) : (
                <div className="px-2 py-2 flex items-center gap-2">
                  <LanguageSwitcher />
                  <button
                    onClick={() => { setMobileOpen(false); setAuthModal('login') }}
                    className="flex-1 text-sm font-semibold bg-[#004AAD] text-white py-2.5 rounded-lg hover:bg-[#003d8f] transition-all cursor-pointer text-center shadow-lg shadow-[#004AAD]/20"
                  >
                    {tCommon('landing.login', 'Login')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="max-w-[1280px] mx-auto px-5 py-6">
        <Outlet />
      </main>

      {/* Auth Modal */}
      <AuthModal
        open={!!authModal}
        mode={authModal || 'login'}
        onClose={() => setAuthModal(null)}
      />
    </div>
  )
}
