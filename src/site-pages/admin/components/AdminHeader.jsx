import React from 'react';
import { Camera } from 'lucide-react';

export default function AdminHeader({ auth, productCount, onLogout }) {
  const {
    adminUser,
    adminAvatar,
    avatarInputRef,
    handleAvatarChange,
    removeAvatar
  } = auth;

  return (
    <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
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
            className="relative h-14 w-14 rounded-full border-2 border-amber-500 ring-2 ring-amber-400/30 overflow-hidden shadow-sm flex items-center justify-center bg-stone-100 hover:ring-amber-500 transition active:scale-95 cursor-pointer"
          >
            {adminAvatar ? (
              <img src={adminAvatar} alt="Admin Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#292524] to-[#1c1917] flex items-center justify-center text-[#E5A924] font-bold font-serif text-xl border border-white/10">
                {adminUser ? adminUser[0].toUpperCase() : 'A'}
              </div>
            )}
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold">
              <Camera size={16} />
              <span className="mt-0.5">Upload</span>
            </div>
          </button>

          {/* Online Green Indicator Dot */}
          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Administrator Online" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sans text-[11px] uppercase tracking-widest text-emerald-800 font-bold">Authenticated Admin</span>
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
          <h1 className="font-display text-2xl font-bold text-brand-charcoal mt-0.5">DST Deco Control Center</h1>
          <p className="font-sans text-xs text-brand-muted mt-0.5">
            Logged in as: <strong className="font-mono text-brand-charcoal">{adminUser || 'master_admin'}</strong>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-mono bg-brand-cream border border-brand-sand px-3 py-1.5 rounded-xl">
          Catalog Items: <strong>{productCount}</strong>
        </span>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold font-sans border border-red-200 transition"
        >
          🔒 Sign Out
        </button>
      </div>
    </div>
  );
}
