import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Header = ({ title = "Dashboard", user, onLogout, onMenuToggle }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200/70 fixed top-0 right-0 left-0 lg:left-72 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8">

      {/* LEFT SECTION: Menu toggle + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          aria-label="Open navigation menu"
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 truncate tracking-tight">
          {title}
        </h1>
      </div>

      {/* RIGHT SECTION: Profile control */}
      <div className="flex items-center shrink-0">
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none rounded-full sm:rounded-xl py-1 pl-1 pr-1 sm:pr-2.5 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold text-[13px] shrink-0 ring-2 ring-white shadow-sm transition-transform duration-150 group-hover:scale-105">
              {(user?.name || 'Election Administrator').charAt(0).toUpperCase()}
            </div>

            <div className="text-left hidden sm:block max-w-[120px] lg:max-w-[180px]">
              <p className="text-[13px] font-semibold text-slate-900 leading-none truncate mb-0.5">
                {user?.name || 'Election Administrator'}
              </p>
              <p className="text-[11px] font-medium text-slate-400 leading-none truncate">
                @{user?.username || 'system_admin'}
              </p>
            </div>

            <svg className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-150 shrink-0 ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {profileOpen && (
            <>
              {/* Click-away layer */}
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />

              <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 border-b border-slate-100 bg-slate-50/60">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{t('profile')}</p>
                  <p className="text-[14px] font-semibold text-slate-900 mt-1 truncate">{user?.name || 'Election Administrator'}</p>
                  <p className="text-[12px] font-medium text-slate-400 truncate">@{user?.username || 'system_admin'}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 text-[13px] font-semibold text-red-700 bg-white hover:bg-red-50 transition-colors"
                >
                  {t('signOut')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;