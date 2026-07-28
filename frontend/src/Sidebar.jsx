import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 'dashboard', path: '/admin', label: t('dashboard'), icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
    { id: 'elections', path: '/admin/elections', label: t('elections'), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'candidates', path: '/admin/candidates', label: t('candidates'), icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'voters', path: '/admin/voters', label: t('voters'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'cards', path: '/admin/cards', label: t('voterCards'), icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'results', path: '/admin/results', label: t('results'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'settings', path: '/admin/settings', label: t('settings'), icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <aside 
      className={`
        fixed top-0 bottom-0 left-0 w-64 bg-[var(--app-surface)] border-r border-[#e2e8f0] flex flex-col h-screen z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:z-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#e2e8f0]/60 shrink-0">
        <div className="flex items-center min-w-0">
          <div className="w-25 h-25 flex items-center justify-center shrink-0 rounded-xl p-1.5]/80">
            <img 
              src="/Logo.png" 
              alt="SecureVote Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        {/* Mobile close trigger (X Button) */}
        <button 
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => {
                  navigate(item.path);
                  if (onClose) onClose(); // Auto-close drawer on mobile link execution
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-[14px] font-medium transition-all transform duration-150 ease-out hover:-translate-y-0.5 hover:scale-[1.01] ${
                  isActive
                    ? 'bg-[#ecfdf5] text-[#15803d]'
                    : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                }`}
              >
                <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#15803d]' : 'text-[#94a3b8]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  {item.id === 'settings' && <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />}
                </svg>
                <span className="truncate">{item.label}</span>
              </button>
              
              {/* Transparent separator line between items (skips the last item) */}
              {index < menuItems.length - 1 && (
                <div className="mx-4 my-1 border-b border-[#e2e8f0]/40" />
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Sign Out */}
      <div className="p-3 border-t border-[#e2e8f0]/60 shrink-0">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-[14px] font-medium text-[#475569] hover:bg-[#fef2f2] hover:text-[#991b1b] transition-all transform duration-150 ease-out hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5 text-[#94a3b8] transition-colors group-hover:text-[#991b1b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{t('signOut')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;