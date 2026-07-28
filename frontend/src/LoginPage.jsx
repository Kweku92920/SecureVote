import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { languages, useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';

const SecureVoteLogin = ({ onLogin, mode = 'voter' }) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [secretCode, setSecretCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isAdminMode = mode === 'admin';

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = isAdminMode
        ? await api.post('/auth/admin', { username, password })
        : await api.post('/auth/voter', { secretCode });

      onLogin(response.user);
      toast.success(isAdminMode ? 'Administrator signed in.' : 'Voter access verified.');
      navigate(isAdminMode ? '/admin' : '/voter');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Ambient background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[420px] h-[420px] rounded-full bg-emerald-100/50 blur-[100px]" />
        <div className="absolute -bottom-40 -right-32 w-[420px] h-[420px] rounded-full bg-slate-200/50 blur-[100px]" />
      </div>

      {/* Language selector — top corner, out of the primary flow */}
      <div className="absolute top-5 right-5 z-20" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span>{currentLang?.code ?? language}</span>
          <svg className={`w-2.5 h-2.5 text-slate-400 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isLangMenuOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 max-h-64 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsLangMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-[13.5px] transition-colors flex justify-between items-center ${
                  language === lang.code ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={lang.code === 'AR' ? 'text-right w-full pr-2' : ''}>{lang.name}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider ml-2 shrink-0">{lang.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Brand mark */}
        <div className="mb-5 flex flex-col items-center">
          <div className="mb-3 h-14 w-14 rounded-2xl border border-slate-200 bg-white flex items-center justify-center shadow-sm">
            <img src="/Logo.png" alt="SecureVote" className="h-8 w-auto object-contain" />
          </div>
          <p className="text-[11.5px] text-slate-400 font-semibold tracking-[0.14em] uppercase">
            Secure Digital Election Platform
          </p>
        </div>

        {/* Mode indicator */}
        <div className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {isAdminMode ? 'Administrator access' : 'Voter access'}
        </div>

        {/* Auth card */}
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)] text-left">
          <div className="mb-6">
            <h1 className="text-[21px] font-bold text-slate-900 tracking-tight mb-1.5">
              {isAdminMode ? 'Admin sign in' : 'Voter sign in'}
            </h1>
            <p className="text-[13.5px] text-slate-500 leading-relaxed">
              {isAdminMode
                ? 'Enter your administrator credentials to manage elections.'
                : 'Enter your secret code to access your voting dashboard.'}
            </p>
          </div>

          <form className="w-full text-left" onSubmit={handleSubmit}>
            {isAdminMode ? (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">{t('username')}</label>
                  <input
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] placeholder-slate-400 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">{t('password')}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] placeholder-slate-400 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-[12.5px] font-semibold text-slate-600 mb-1.5">{t('secretCode')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. VOT-7X9K-2M4P"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] placeholder-slate-400 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-colors font-mono tracking-wider"
                  />
                </div>
                <p className="text-[12px] text-slate-500 mt-2 leading-relaxed">
                  Your administrator will provide this code to grant you access.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-[14.5px] shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isSubmitting && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
                {isSubmitting ? t('signingIn') : t('signIn')}
              </span>
            </button>
          </form>
        </div>

        <p className="mt-6 text-[11.5px] text-slate-400 leading-relaxed text-center max-w-[320px]">
          Your session is encrypted end-to-end. Never share your credentials or secret code with anyone.
        </p>
      </div>
    </div>
  );
};

export default SecureVoteLogin;