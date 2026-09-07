"use client";

import Link from "next/link";
import { Menu, X, User as UserIcon, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Navbar Main */}
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="shrink-0 text-xl font-bold text-[#ff594d] sm:text-2xl"
          >
            VenRaz
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex lg:gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff594d] lg:text-base"
            >
              Home
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

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex lg:gap-4">

            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 hover:text-[#ff594d]"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-[#ff594d]"
            >
              <UserIcon className="h-5 w-5" />
              <span>Login</span>
            </Link>

            {/* Register */}
            <Link
              href="/register"
              className="rounded-lg bg-[#ff594d] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#ff594d]"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">

            {/* Mobile Links */}
            <Link
              href="/"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-[#ff594d]"
            >
              Home
            </Link>

            <Link
              href="/shop"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-[#ff594d]"
            >
              Shop
            </Link>

            <Link
              href="/categories"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-[#ff594d]"
            >
              Categories
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-[#ff594d]"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-[#ff594d]"
            >
              Contact
            </Link>

            {/* Mobile Actions */}
            <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">

              <Link
                href="/cart"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
              >
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart
              </Link>

              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#ff594d]"
              >
                <UserIcon className="h-5 w-5" />
                Login
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="block rounded-lg bg-[#ff594d] px-4 py-3 text-center text-base font-medium text-white transition hover:bg-[#ff594d]"
              >
                Register
              </Link>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}