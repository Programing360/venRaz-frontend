
"use client";

import { authClient } from "@/lib/auth-client";
import { Bell, ChevronDown, Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = authClient.useSession();

  const name = session?.user?.name || "User";
  const email = session?.user?.email || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-[#DEDACE] bg-white/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu button */}
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7268] transition-colors hover:bg-[#F4F2EC] hover:text-[#0E1B1B] lg:hidden"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#6B7268]">
              Dashboard
            </p>

            <h1 className="truncate text-sm font-semibold text-[#0E1B1B] sm:text-base">
              Welcome back, {name}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#6B7268] transition-all hover:bg-[#F4F2EC] hover:text-[#0E1B1B] focus:outline-none focus:ring-2 focus:ring-[#C08A3E]/40"
          >
            <Bell size={18} strokeWidth={1.8} />

            {/* Notification indicator */}
            <span
              aria-hidden="true"
              className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-[#C08A3E]"
            />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#DEDACE] sm:block" />

          {/* Profile */}
          <button
            type="button"
            className="group flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-[#F4F2EC] focus:outline-none focus:ring-2 focus:ring-[#C08A3E]/40 sm:gap-3 sm:pr-2"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0E1B1B] text-sm font-semibold text-white shadow-sm">
              {initial}
            </div>

            {/* User information */}
            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-[150px] truncate text-sm font-semibold leading-tight text-[#0E1B1B]">
                {name}
              </p>

              {email && (
                <p className="mt-0.5 max-w-[180px] truncate text-xs leading-tight text-[#6B7268]">
                  {email}
                </p>
              )}
            </div>

            {/* Dropdown indicator */}
            <ChevronDown
              size={16}
              className="hidden text-[#6B7268] transition-transform group-hover:text-[#0E1B1B] sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

