
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [role, setRole] = useState("");

  const router = useRouter();
  const { data: session, isPending } = useSession();

  // ==============================
  // Get User Role
  // ==============================
  useEffect(() => {
    const getRole = async () => {
      try {
        if (!session?.user?.email) {
          setRole("");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.email}`
        );

        if (!res.ok) return;

        const data = await res.json();

        setRole(data?.role?.toLowerCase() || "");
      } catch (error) {
        console.error("Failed to get user role:", error);
      }
    };

    getRole();
  }, [session]);

  // ==============================
  // Navbar Scroll Effect
  // ==============================
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ==============================
  // Logout
  // ==============================
  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
    router.push("/");
  };

  // ==============================
  // Dashboard Route
  // ==============================
  const getDashboardRoute = () => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "seller") return "/dashboard/seller";

    return "/dashboard";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 z-[9999] w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-md backdrop-blur-md"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* =========================
              LOGO
          ========================== */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
          
            <span className="text-2xl font-extrabold tracking-tight text-[#ff594d]">
              VenRaz
            </span>
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================== */}
          <div className="hidden items-center gap-5 md:flex lg:gap-7">

            <Link
              href="/"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff594d] lg:text-base"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff594d] lg:text-base"
            >
              Product
            </Link>

            <Link
              href="/shop"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff594d] lg:text-base"
            >
              Shop
            </Link>

            <Link
              href="/categories"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff594d] lg:text-base"
            >
              Categories
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff594d] lg:text-base"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff594d] lg:text-base"
            >
              Contact
            </Link>
          </div>

          {/* =========================
              RIGHT SIDE / AUTH
          ========================== */}
          <div className="hidden items-center gap-3 md:flex">

            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-xl p-2.5 text-gray-700 transition hover:bg-gray-100 hover:text-[#ff594d]"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {!isPending && !session ? (
              <>
                {/* LOGIN */}
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-[#ff594d]"
                >
                  <User className="h-5 w-5" />
                  Login
                </Link>

                {/* REGISTER */}
                <Link
                  href="/register"
                  className="rounded-xl bg-[#ff594d] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e94d43]"
                >
                  Register
                </Link>
              </>
            ) : (
              /* =========================
                 LOGGED IN USER
              ========================== */
              <div className="group relative">

                <div className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100">

                  <Image
                    src={
                      session?.user?.image ||
                      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
                    }
                    width={38}
                    height={38}
                    alt="User"
                    className="h-9 w-9 rounded-full object-cover"
                  />

                  <span className="max-w-[120px] truncate text-sm font-semibold text-gray-700">
                    {session?.user?.name}
                  </span>
                </div>

                {/* USER DROPDOWN */}
                <div className="invisible absolute right-0 top-12 w-56 translate-y-2 overflow-hidden rounded-2xl bg-white opacity-0 shadow-xl ring-1 ring-black/5 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                  {/* User Info */}
                  <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="truncate font-semibold text-gray-900">
                      {session?.user?.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>

                  {/* Dashboard */}
                  <Link
                    href={getDashboardRoute()}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  {/* Profile */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =========================
              MOBILE MENU BUTTON
          ========================== */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-xl bg-[#ff594d] p-2.5 text-white shadow-sm transition hover:bg-[#e94d43] md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE MENU
      ========================== */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white shadow-xl md:hidden">

          {/* User Info */}
          {session && (
            <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
              <div className="flex items-center gap-3">

                <Image
                  src={
                    session?.user?.image ||
                    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
                  }
                  width={48}
                  height={48}
                  alt="User"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[#ff594d]"
                />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {session?.user?.name}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-1 px-4 py-4">

            <Link
              href="/"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
            >
              Home
            </Link>

            <Link
              href="/product"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
            >
              Product
            </Link>

            <Link
              href="/shop"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
            >
              Shop
            </Link>

            <Link
              href="/categories"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
            >
              Categories
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
            >
              Contact
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700 transition hover:text-[#ff594d]"
            >
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </Link>

            {/* Logged in links */}
            {session && (
              <>
                <Link
                  href={getDashboardRoute()}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl bg-[#ff594d]/10 px-4 py-3 font-semibold text-[#ff594d]"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* =========================
              MOBILE AUTH
          ========================== */}
          <div className="border-t border-gray-100 p-4">

            {!session ? (
              <div className="grid grid-cols-2 gap-3">

                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
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
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-500 transition hover:bg-red-100"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

