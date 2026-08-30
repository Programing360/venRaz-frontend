
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Settings,
  LogOut,
  X,
  ChevronRight,
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

  const links = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      name: "My Orders",
      href: "/dashboard/orders",
      icon: ShoppingBag,
    },
  ];

  if (role === "admin") {
    links.push({
      name: "Admin Panel",
      href: "/dashboard/admin",
      icon: Settings,
    });
  }

  async function handleSignOut() {
    await authClient.signOut();
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-[#DEDACE] bg-white
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:w-64 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#DEDACE] px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E1B1B] text-sm font-bold text-white">
              D
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-[#0E1B1B]">
                Dashboard
              </p>

              <p className="text-[11px] text-[#6B7268]">
                {role === "admin" ? "Administrator" : "Customer"}
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7268] transition-colors hover:bg-[#F4F2EC] hover:text-[#0E1B1B] lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A9E96]">
            Menu
          </p>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;

              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" &&
                  pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center gap-3 rounded-xl
                    px-3 py-3 text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#0E1B1B] text-white shadow-sm"
                        : "text-[#6B7268] hover:bg-[#F4F2EC] hover:text-[#0E1B1B]"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#C08A3E]" />
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
                    <ChevronRight
                      size={15}
                      className="text-white/60"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="border-t border-[#DEDACE] p-4">
          {/* Account label */}
          <div className="mb-3 rounded-xl bg-[#F8F7F3] p-3">
            <p className="text-xs font-medium text-[#6B7268]">
              Signed in as
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#0E1B1B]">
              {role === "admin" ? "Administrator" : "Customer"}
            </p>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="
              group flex w-full items-center gap-3 rounded-xl
              px-3 py-3 text-sm font-medium
              text-rose-600
              transition-all duration-200
              hover:bg-rose-50
              focus:outline-none
              focus:ring-2
              focus:ring-rose-500/20
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

