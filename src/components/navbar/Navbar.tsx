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
  Heart,
  Sun,
  Moon,
} from "lucide-react";

import { authClient, signOut, useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { SearchBar } from "@/components/SearchBar";
import { useTheme } from "next-themes";

const ADMIN_EMAIL = "fhlimon6@gmail.com";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalItems } = useCart();
  console.log(session);
  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

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
    { name: "Product", href: "/products" },
    { name: "Shop", href: "/shops" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-md shadow-purple-950/5 backdrop-blur-md dark:bg-slate-950/90"
          : "bg-white shadow-sm shadow-purple-950/5 dark:bg-slate-900"
      }`}
    >
      <div className="max-w-[1860px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#7E22CE] rounded-lg p-1"
          >
            <span className="text-2xl font-black tracking-tight text-purple-950 dark:text-white">
              Ven<span className="text-[#7E22CE]">Raz</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-1 md:flex lg:gap-2 mx-auto max-w-7xl">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 lg:text-base ${
                    active
                      ? "bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40"
                      : "text-purple-950/80 hover:bg-[#FAF5FF] hover:text-[#7E22CE] dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{link.name}</span>
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
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="rounded-xl p-2.5 text-purple-950/80 hover:bg-[#FAF5FF] hover:text-[#7E22CE] transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className={`relative rounded-xl p-2.5 transition-all duration-200 ${
                isActive("/cart")
                  ? "bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40"
                  : "text-purple-950/80 hover:bg-[#FAF5FF] hover:text-[#7E22CE] dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#7E22CE] px-1 text-[11px] font-bold text-white shadow-sm">
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
                      ? "bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40"
                      : "text-purple-950/80 hover:bg-[#FAF5FF] hover:text-[#7E22CE] dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-[#7E22CE] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-800 hover:shadow"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-purple-100 p-1.5 pr-3 transition hover:bg-[#FAF5FF] focus:outline-none dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  <Image
                    src={
                      session?.user?.image ||
                      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
                    }
                    width={36}
                    height={36}
                    alt={session?.user?.name || "User avatar"}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[#7E22CE]/20"
                  />
                  <span className="max-w-[120px] truncate text-sm font-semibold text-purple-950 dark:text-white">
                    {session?.user?.name}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-purple-400 dark:text-slate-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* USER DROPDOWN */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-purple-950/5 animate-in fade-in slide-in-from-top-2 duration-150 dark:bg-slate-900 dark:ring-slate-800">
                    <div className="border-b border-purple-50 bg-[#FAF5FF] px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
                      <p className="truncate font-semibold text-purple-950 dark:text-white">
                        {session?.user?.name}
                      </p>
                      <p className="truncate text-xs text-purple-900/60 dark:text-slate-400">
                        {session?.user?.email}
                      </p>
                    </div>

                    <Link
                      href={getDashboardRoute()}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-[#FAF5FF] dark:hover:bg-slate-800 ${
                        isActive(getDashboardRoute())
                          ? "bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40"
                          : "text-purple-950/80 hover:text-[#7E22CE] dark:text-slate-300"
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-[#FAF5FF] dark:hover:bg-slate-800 ${
                        isActive("/profile")
                          ? "bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40"
                          : "text-purple-950/80 hover:text-[#7E22CE] dark:text-slate-300"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>

                    <Link
                      href="/userDashboard/wishList"
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-[#FAF5FF] dark:hover:bg-slate-800 ${
                        isActive("/userDashboard/wishList")
                          ? "bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40"
                          : "text-purple-950/80 hover:text-[#7E22CE] dark:text-slate-300"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 border-t border-purple-50 px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-slate-800 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON & DARK MODE */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="rounded-xl p-2.5 text-purple-950/80 hover:bg-[#FAF5FF] transition dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-xl bg-[#7E22CE] p-2.5 text-white shadow-sm transition hover:bg-purple-800"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="border-t border-purple-100 bg-white md:hidden animate-in slide-in-from-top-2 duration-200 dark:border-slate-800 dark:bg-slate-900">
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
                      ? "bg-purple-100 font-semibold text-[#7E22CE] dark:bg-purple-950/40"
                      : "text-purple-950/80 hover:bg-[#FAF5FF] hover:text-[#7E22CE] dark:text-slate-300 dark:hover:bg-slate-800"
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
                  ? "bg-purple-100 font-semibold text-[#7E22CE] dark:bg-purple-950/40"
                  : "bg-[#FAF5FF] text-purple-950/80 hover:text-[#7E22CE] dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                <span>Shopping Cart</span>
              </div>
              {totalItems > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#7E22CE] px-1.5 text-[11px] font-bold text-white">
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
                      ? "bg-[#7E22CE] text-white"
                      : "bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40"
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
                      ? "bg-purple-100 font-semibold text-[#7E22CE] dark:bg-purple-950/40"
                      : "text-purple-950/80 hover:bg-[#FAF5FF] hover:text-[#7E22CE] dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>

                <Link
                  href="/userDashboard/wishList"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                    isActive("/userDashboard/wishList")
                      ? "bg-purple-100 font-semibold text-[#7E22CE] dark:bg-purple-950/40"
                      : "text-purple-950/80 hover:bg-[#FAF5FF] hover:text-[#7E22CE] dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                </Link>
              </>
            )}

            {/* Mobile Auth Buttons */}
            <div className="border-t border-purple-50 pt-4 dark:border-slate-800">
              {!session ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold transition-all duration-200 ${
                      isActive("/login")
                        ? "border-[#7E22CE] bg-purple-100 text-[#7E22CE] dark:bg-purple-950/40"
                        : "border-purple-200 text-purple-950/80 hover:bg-[#FAF5FF] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-[#7E22CE] px-4 py-3 text-center font-semibold text-white transition hover:bg-purple-800"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-500 transition hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/60"
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
