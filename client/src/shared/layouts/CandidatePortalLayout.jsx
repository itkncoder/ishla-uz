import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@shared/components/LanguageSwitcher'
import RoleSwitcher from '@shared/components/RoleSwitcher'
import AuthModal from '@shared/components/AuthModal'
import useAuthStore from '@stores/authStore'
import useCandidateProfileStore from '@stores/candidateProfileStore'
import logoVariant2 from '@shared/assets/logo_variant2.png'

const NAV_ITEMS = [
  {
    to: '/candidate/jobs',
    key: 'jobs',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    to: '/candidate/chat',
    key: 'chat',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
]

const DIRECTIONS = [
  {
    key: 'construction',
    subs: ['construction', 'rawMaterials', 'blueCollar'],
  },
  {
    key: 'hospitality',
    subs: ['tourism', 'domesticStaff', 'sportsFitness'],
  },
  {
    key: 'healthcare',
    subs: ['medicine', 'insurance'],
  },
  {
    key: 'manufacturing',
    subs: ['manufacturing', 'procurement', 'transport'],
  },
  {
    key: 'logistics',
    subs: ['transport', 'procurement', 'autoBusiness'],
  },
  {
    key: 'agriculture',
    subs: ['agriculture', 'rawMaterials'],
  },
  {
    key: 'it',
    subs: ['it', 'artsMedia', 'marketing'],
  },
  {
    key: 'retail',
    subs: ['retail', 'sales', 'consulting', 'finance'],
  },
]

export default function CandidatePortalLayout() {
  const { t } = useTranslation('candidate')
  const { t: tCommon } = useTranslation('common')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typingPlaceholder, setTypingPlaceholder] = useState('')
  const userMenuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isDirectionsPage = location.pathname === '/candidate'
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const fetchMe = useCandidateProfileStore((s) => s.fetchMe)
  const switchRole = useAuthStore((s) => s.switchRole)

  useEffect(() => {
    switchRole('candidate')
    if (user) fetchMe()
  }, [switchRole, user])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const SEARCH_PLACEHOLDERS = Array.from({ length: 7 }, (_, i) => tCommon(`home.searchPlaceholders.${i}`))

  useEffect(() => {
    if (searchQuery) return
    let idx = 0, char = 0, deleting = false, timeout
    const tick = () => {
      const current = SEARCH_PLACEHOLDERS[idx]
      if (!deleting) {
        char++
        setTypingPlaceholder(current.slice(0, char))
        timeout = setTimeout(tick, char === current.length ? 1500 : 80)
        if (char === current.length) deleting = true
      } else {
        char--
        setTypingPlaceholder(current.slice(0, char))
        if (char === 0) {
          deleting = false
          idx = (idx + 1) % SEARCH_PLACEHOLDERS.length
        }
        timeout = setTimeout(tick, char === 0 ? 300 : 30)
      }
    }
    timeout = setTimeout(tick, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const userName = user?.name || 'User'
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
          <div className="flex items-center">
            <NavLink to="/candidate" className="shrink-0">
              <img src={logoVariant2} alt="ISHLA.UZ" className="h-28" />
            </NavLink>
          </div>

          {/* Center/Right: Nav links + Profile (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.key} to={item.to} end={item.end} className={linkClass}>
                {item.icon}
                <span>{t(`nav.${item.key}`)}</span>
              </NavLink>
            ))}

            <div className="w-px h-6 bg-gray-200 mx-2" />

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
                      <div onClick={() => { setUserMenuOpen(false); navigate('/candidate/profile'); }} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
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
                        to="/candidate/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#004AAD] hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span className="flex-1">{t('nav.profile')}</span>
                      </NavLink>
                      <NavLink
                        to="/candidate/help"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#004AAD] hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        <span className="flex-1">{t('nav.help')}</span>
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
                        <span className="flex-1 text-left">{t('nav.logout')}</span>
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
            <div className="space-y-0.5 px-0 py-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end={item.end}
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  <span>{t(`nav.${item.key}`)}</span>
                </NavLink>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-2 pt-2 mx-2">
              {user ? (
                <>
                  <div onClick={() => { setMobileMenuOpen(false); navigate('/candidate/profile'); }} className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:opacity-80 transition-opacity">
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
                    to="/candidate/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-[#004AAD] hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className="flex-1">{t('nav.profile')}</span>
                  </NavLink>
                  <NavLink
                    to="/candidate/help"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-[#004AAD] hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    <span className="flex-1">{t('nav.help')}</span>
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
                    <span className="flex-1 text-left">{t('nav.logout')}</span>
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

      {/* Work directions row */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex items-center overflow-x-auto no-scrollbar">
            {DIRECTIONS.map((dir, i) => (
              <div key={dir.key} className="relative group flex items-center">
                {i > 0 && <div className="w-px h-4 bg-gray-200 shrink-0" />}
                <NavLink
                  to={`/candidate/jobs?industry=${dir.key}`}
                  className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-600 hover:text-[#004AAD] transition-colors duration-200"
                >
                  {tCommon(`landing.${dir.key}`)}
                </NavLink>
                {/* Dropdown */}
                <div className="absolute top-full left-0 pt-1 hidden group-hover:block z-50">
                  <div className="bg-white rounded-lg shadow-xl shadow-black/8 border border-gray-100 py-1.5 min-w-[200px] animate-[fadeIn_0.12s_ease-out]">
                    {dir.subs.map((sub) => (
                      <NavLink
                        key={sub}
                        to={`/candidate/jobs?profession=${sub}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-[#004AAD] hover:bg-[#e8f0fe]/50 transition-colors"
                      >
                        {tCommon(`home.professions.${sub}`)}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Search bar — only on /candidate */}
      {isDirectionsPage && (
        <div className="max-w-[1280px] mx-auto px-5 pt-5 pb-2">
          <div className="flex gap-2.5 max-w-xl mx-auto">
            <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <div className="px-3.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(searchQuery ? `/candidate/jobs?search=${encodeURIComponent(searchQuery)}` : '/candidate/jobs') }}
                placeholder={typingPlaceholder}
                className="flex-1 py-2.5 text-sm text-gray-900 outline-none bg-transparent"
              />
            </div>
            <button
              onClick={() => navigate(searchQuery ? `/candidate/jobs?search=${encodeURIComponent(searchQuery)}` : '/candidate/jobs')}
              className="px-6 py-2.5 bg-[#004AAD] text-white font-semibold rounded-lg hover:bg-[#003A8A] transition-colors text-sm cursor-pointer"
            >
              {tCommon('home.findWithAI')}
            </button>
          </div>
        </div>
      )}

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
