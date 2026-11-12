import React from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import BrandLogo from '../../../components/public/BrandLogo.jsx';

export default function AdminLogin({ auth }) {
  const {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    showPassword,
    setShowPassword,
    loginError,
    loginLoading,
    handleLogin
  } = auth;

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(229,169,36,0.14),_transparent_38%),#fbf8f2] p-4 font-sans">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.3)] sm:p-9">
        <div className="text-center">
          <div className="flex justify-center">
            <BrandLogo variant="dark" showTagline={false} />
          </div>
          <h1 className="mt-5 font-display text-[28px] font-bold leading-tight text-stone-950">Classical Decor ID Admin Portal</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in to manage your product catalog.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-7 space-y-4">
          {loginError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              <span>⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-900">Admin Email</label>
            <div className="relative">
              <Mail aria-hidden="true" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-brand-charcoal shadow-[0_5px_14px_rgba(15,23,42,0.12)] placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-900">Master Password</label>
            <div className="relative">
              <LockKeyhole aria-hidden="true" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-11 text-sm text-brand-charcoal shadow-[0_5px_14px_rgba(15,23,42,0.12)] placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3.5 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center p-1 text-slate-500 transition hover:text-slate-800 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(5,150,105,0.3)] transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight aria-hidden="true" size={17} />
          </button>
        </form>

        <div className="mt-7 border-t border-slate-200 pt-5 text-center text-xs text-stone-400">
          Authorized administrators only
        </div>
      </div>
    </main>
  );
}
