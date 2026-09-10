'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ArrowLeft,
  Store,
  ChevronRight,
  Activity,
  ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/adminDashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Products',
    href: '/adminDashboard/products',
    icon: Package,
  },
  {
    label: 'Orders',
    href: '/adminDashboard/orders',
    icon: ShoppingCart,
  },
  {
    label: 'Add Product',
    href: '/adminDashboard/addProduct',
    icon: ShoppingCart,
  },
  {
    label: 'Users & Sellers',
    href: '/adminDashboard/users',
    icon: Users,
  },
  {
    label: 'Verify Shops',
    href: '/adminDashboard/verify-shops',
    icon: ShieldCheck,
  },
  {
    label: 'Settings',
    href: '/adminDashboard/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-300 select-none">
      
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-zinc-800/80 px-6">
        <Link href="/adminDashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
            <Store className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                ven<span className="text-emerald-400">Raz</span>
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">
              Enterprise Control
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Management
          </p>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/adminDashboard'
                  ? pathname === '/adminDashboard'
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                      : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-100'
                  }`}
                >
                  {/* Left Active Line */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-emerald-400" />
                  )}

                  <Icon
                    className={`h-4 w-4 transition-colors duration-200 ${
                      isActive
                        ? 'text-emerald-400'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  />

                  <span className="flex-1">{item.label}</span>

                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Live System Status Widget */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-zinc-200">
                Store Status
              </span>
            </div>
            <Activity className="h-3.5 w-3.5 text-zinc-500" />
          </div>

          <p className="mt-1.5 text-[11px] text-zinc-400">
            All services operating smoothly.
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="border-t border-zinc-800/80 p-4 space-y-3">
        <Link
          href="/userDashboard"
          className="group flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-3.5 py-2.5 text-xs font-semibold text-zinc-400 transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="flex-1">Seller Dashboard</span>
        </Link>

        <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-zinc-600">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="h-3 w-3 text-emerald-500/80" /> v1.0.0
          </span>
          <span>venRaz Platform</span>
        </div>
      </div>

    </aside>
  );
}