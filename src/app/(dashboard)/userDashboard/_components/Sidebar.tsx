"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  Store,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  role?: "user" | "admin";
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  role = "user",
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  // Mobile drawer open thakle body scroll prevent hobe
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key press korle mobile drawer close hobe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const links = [
    {
      name: "Overview",
      href: "/userDashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Profile",
      href: "/userDashboard/profile",
      icon: User,
    },
    {
      name: "My Orders",
      href: "/userDashboard/orders",
      icon: ShoppingBag,
    },
    {
      name: "My WishList",
      href: "/userDashboard/wishList",
      icon: Heart,
    },
    {
      name: "Create Shop",
      href: "/userDashboard/createShop",
      icon: Store,
    },
  ];

  if (role === "admin") {
    links.push({
      name: "Admin Panel",
      href: "/adminDashboard",
      icon: Settings,
    });
    links.push({
      name: "Verify Shops",
      href: "/adminDashboard/verify-shops",
      icon: ShieldCheck,
    });
  }

  async function handleSignOut() {
    await authClient.signOut();
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-[#DEDACE] bg-white
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#DEDACE] px-5">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E1B1B] text-sm font-bold text-white shadow-sm">
              D
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-[#0E1B1B]">
                Dashboard
              </p>

              <p className="text-[11px] font-medium text-[#6B7268]">
                {role === "admin" ? "Administrator" : "Customer"}
              </p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7268] transition-colors hover:bg-[#F4F2EC] hover:text-[#0E1B1B] lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A9E96]">
            Menu
          </p>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;

              const isActive =
                link.href === "/userDashboard"
                  ? pathname === "/userDashboard"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center gap-3 rounded-xl
                    px-3 py-2.5 text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#0E1B1B] text-white shadow-sm font-semibold"
                        : "text-[#6B7268] hover:bg-[#F4F2EC] hover:text-[#0E1B1B]"
                    }
                  `}
                >
                  {/* Left Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 h-5 w-1 rounded-r-full bg-[#C08A3E]" />
                  )}

                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={
                      isActive
                        ? "text-[#C08A3E]"
                        : "text-[#7B8178] group-hover:text-[#0E1B1B]"
                    }
                  />

                  <span className="flex-1">{link.name}</span>

                  {isActive && (
                    <ChevronRight size={15} className="text-white/60" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section / User Controls */}
        <div className="border-t border-[#DEDACE] p-4 space-y-3">
          {/* Account Details Widget */}
          <div className="rounded-xl bg-[#F8F7F3] p-3 border border-[#EBE8DF]">
            <p className="text-[11px] font-medium text-[#6B7268]">
              Signed in as
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-[#0E1B1B]">
              {role === "admin" ? "Administrator Account" : "Customer Account"}
            </p>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="
              group flex w-full items-center gap-3 rounded-xl
              px-3 py-2.5 text-sm font-semibold
              text-rose-600 border border-transparent
              transition-all duration-200
              hover:border-rose-200 hover:bg-rose-50
              focus:outline-none focus:ring-2 focus:ring-rose-500/20
            "
          >
            <LogOut
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
