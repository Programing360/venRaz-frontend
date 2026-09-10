"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { authClient, signOut, useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { SearchBar } from "@/components/SearchBar";

const ADMIN_EMAIL = "fhlimon6@gmail.com";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalItems } = useCart();

  // Active route checking helper
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      await authClient.signOut();
    }
    closeMenu();
    router.push("/");
  };

  const getDashboardRoute = () => {
    if (
      session?.user?.email === ADMIN_EMAIL ||
      session?.user?.role === "admin"
    ) {
      return "/adminDashboard";
    }
    return "/userDashboard";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-md backdrop-blur-md"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#ff594d] rounded-lg p-1"
          >
            <span className="text-2xl font-black tracking-tight text-[#ff594d]">
              VenRaz
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-1 md:flex lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 lg:text-base ${
                    active
                      ? "bg-[#ff594d]/10 text-[#ff594d]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#ff594d]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden w-full max-w-xs flex-1 px-4 lg:block xl:max-w-md">
            <SearchBar />
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            <Link
              href="/cart"
              className={`relative rounded-xl p-2.5 transition-all duration-200 ${
                isActive("/cart")
                  ? "bg-[#ff594d]/10 text-[#ff594d]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#ff594d]"
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff594d] px-1 text-[11px] font-bold text-white shadow-sm">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {!session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive("/login")
                      ? "bg-[#ff594d]/10 text-[#ff594d]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#ff594d]"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-[#ff594d] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e94d43] hover:shadow"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-gray-100 p-1.5 pr-3 transition hover:bg-gray-50 focus:outline-none"
                >
                  <Image
                    src={
                      session?.user?.image ||
                      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
                    }
                    width={36}
                    height={36}
                    alt={session?.user?.name || "User avatar"}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[#ff594d]/20"
                  />
                  <span className="max-w-[120px] truncate text-sm font-semibold text-gray-700">
                    {session?.user?.name}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* USER DROPDOWN */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                      <p className="truncate font-semibold text-gray-900">
                        {session?.user?.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {session?.user?.email}
                      </p>
                    </div>

                    <Link
                      href={getDashboardRoute()}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-gray-50 ${
                        isActive(getDashboardRoute())
                          ? "bg-[#ff594d]/10 text-[#ff594d]"
                          : "text-gray-700 hover:text-[#ff594d]"
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-gray-50 ${
                        isActive("/profile")
                          ? "bg-[#ff594d]/10 text-[#ff594d]"
                          : "text-gray-700 hover:text-[#ff594d]"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-xl bg-[#ff594d] p-2.5 text-white shadow-sm transition hover:bg-[#e94d43] md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl space-y-1.5 px-4 py-4 sm:px-6">
            {/* Mobile Search */}
            <div className="pb-3">
              <SearchBar />
            </div>

            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#ff594d]/10 font-semibold text-[#ff594d]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#ff594d]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile Cart */}
            <Link
              href="/cart"
              onClick={closeMenu}
              className={`flex items-center justify-between rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                isActive("/cart")
                  ? "bg-[#ff594d]/10 font-semibold text-[#ff594d]"
                  : "bg-gray-50 text-gray-700 hover:text-[#ff594d]"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                <span>Shopping Cart</span>
              </div>
              {totalItems > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff594d] px-1.5 text-[11px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Logged-In User Mobile Links */}
            {session && (
              <>
                <Link
                  href={getDashboardRoute()}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-200 ${
                    isActive(getDashboardRoute())
                      ? "bg-[#ff594d] text-white"
                      : "bg-[#ff594d]/10 text-[#ff594d]"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                    isActive("/profile")
                      ? "bg-[#ff594d]/10 font-semibold text-[#ff594d]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#ff594d]"
                  }`}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
              </>
            )}

            {/* Mobile Auth Buttons */}
            <div className="border-t border-gray-100 pt-4">
              {!session ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold transition-all duration-200 ${
                      isActive("/login")
                        ? "border-[#ff594d] bg-[#ff594d]/10 text-[#ff594d]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-[#ff594d] px-4 py-3 text-center font-semibold text-white transition hover:bg-[#e94d43]"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-500 transition hover:bg-red-100"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
