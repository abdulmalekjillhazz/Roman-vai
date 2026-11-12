import React from 'react';
import Link from 'next/link';
import { Camera, ExternalLink, PackageCheck } from 'lucide-react';
import { HouseMonogram } from '../../../components/public/BrandLogo.jsx';

export default function AdminHeader({ auth, productCount, onLogout }) {
  const {
    adminUser,
    adminAvatar,
    avatarInputRef,
    handleAvatarChange,
    removeAvatar
  } = auth;

  return (
    <header className="mb-5 flex flex-col items-start justify-between gap-5 rounded-3xl border border-stone-200/80 bg-white/95 p-4 shadow-[0_18px_45px_-24px_rgba(28,25,23,0.5)] sm:mb-6 sm:flex-row sm:items-center sm:p-6">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Corner Admin Avatar Photo with Live Upload */}
        <div className="relative group shrink-0">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            aria-label="Upload Admin Profile Photo"
          />
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            title="Click to upload or change administrator profile picture"
            className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-amber-500 ring-2 ring-amber-400/30 overflow-hidden shadow-sm flex items-center justify-center bg-stone-100 hover:ring-amber-500 transition active:scale-95 cursor-pointer"
          >
            {adminAvatar ? (
              <img src={adminAvatar} alt="Admin Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-stone-900 flex items-center justify-center p-2.5 border border-white/10">
                <HouseMonogram className="w-full h-full" color="#E5A924" />
              </div>
            )}
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold">
              <Camera size={14} />
              <span className="mt-0.5">Upload</span>
            </div>
          </button>

          {/* Online Green Indicator Dot */}
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Administrator Online" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-emerald-800 font-bold">Authenticated Admin</span>
            {adminAvatar && (
              <button
                type="button"
                onClick={removeAvatar}
                className="text-[10px] text-stone-400 hover:text-red-600 underline ml-1 cursor-pointer"
                title="Remove custom photo"
              >
                remove photo
              </button>
            )}
          </div>
          <h1 className="font-display text-lg sm:text-2xl font-bold text-brand-charcoal mt-0.5 truncate">Classical Decor ID Control Center</h1>
          <p className="font-sans text-[11px] sm:text-xs text-brand-muted mt-0.5 truncate">
            Logged in as: <strong className="font-mono text-brand-charcoal">{adminUser || 'master_admin'}</strong>
          </p>
        </div>
      </div>

      <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
        <Link
          href="/"
          target="_blank"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold font-sans text-stone-700 transition hover:bg-stone-200 active:scale-95"
          title="Open live public catalog in new tab"
        >
          <span>Live Site</span>
          <ExternalLink size={12} />
        </Link>
        <span className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-brand-sand bg-brand-cream px-2.5 font-mono text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-3 sm:text-xs">
          <PackageCheck size={14} className="text-brand-gold" aria-hidden="true" />
          Items: <strong>{productCount}</strong>
        </span>
        <button
          onClick={onLogout}
          className="inline-flex min-h-11 items-center rounded-xl border border-red-200 bg-red-50 px-3.5 text-xs font-bold font-sans text-red-700 transition hover:bg-red-100 active:scale-95 sm:px-4"
        >
          🔒 Sign Out
        </button>
      </div>
    </header>
  );
}
