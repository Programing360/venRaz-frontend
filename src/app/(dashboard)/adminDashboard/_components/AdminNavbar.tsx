'use client';

import React from 'react';
import { Bell, ExternalLink, Store } from 'lucide-react';
import Link from 'next/link';

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="flex h-full items-center justify-between px-6">

        {/* Left Side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 shadow-sm shadow-red-500/20">
              <Store size={18} className="text-white" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Venraz Store
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Admin Dashboard
              </p>
            </div>
          </div>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* View Store */}
          <Link
            href="/"
            className="
              hidden sm:flex items-center gap-2
              rounded-lg border border-slate-200
              bg-slate-50 px-3 py-2
              text-xs font-semibold text-slate-700
              transition hover:border-red-200
              hover:bg-red-50 hover:text-red-600
            "
          >
            <ExternalLink size={14} />
            View Store
          </Link>

          {/* Notification */}
          <button
            className="
              relative flex h-9 w-9 items-center justify-center
              rounded-lg border border-slate-200
              bg-slate-50 text-slate-600
              transition hover:border-red-200 hover:bg-red-50 hover:text-red-600
            "
          >
            <Bell size={17} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full bg-gradient-to-br
                from-red-600 to-rose-700
                text-xs font-bold text-white
                ring-2 ring-red-100 shadow-sm
              "
            >
              AD
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-800">
                System Admin
              </p>

              <p className="text-[11px] text-slate-400">
                admin@venraz.com
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}