'use client';

import React from 'react';
import { Bell, ExternalLink, Store } from 'lucide-react';

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-6">

        {/* Left Side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
              <Store size={18} className="text-zinc-950" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Venraz Store
              </h2>
              <p className="text-[11px] text-zinc-500">
                Admin Dashboard
              </p>
            </div>
          </div>

          <div className="hidden h-6 w-px bg-zinc-800 sm:block" />

         
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* View Store */}
          <button
            className="
              hidden sm:flex items-center gap-2
              rounded-lg border border-zinc-800
              bg-zinc-900 px-3 py-2
              text-xs font-medium text-zinc-300
              transition hover:border-zinc-700
              hover:bg-zinc-800 hover:text-white
            "
          >
            <ExternalLink size={14} />
            View Store
          </button>

          {/* Notification */}
          <button
            className="
              relative flex h-9 w-9 items-center justify-center
              rounded-lg border border-zinc-800
              bg-zinc-900 text-zinc-400
              transition hover:bg-zinc-800 hover:text-white
            "
          >
            <Bell size={17} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-8 w-px bg-zinc-800 sm:block" />

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full bg-gradient-to-br
                from-emerald-400 to-emerald-700
                text-xs font-bold text-white
                ring-2 ring-zinc-900
              "
            >
              AD
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-zinc-200">
                System Admin
              </p>

              <p className="text-[11px] text-zinc-500">
                admin@venraz.com
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}