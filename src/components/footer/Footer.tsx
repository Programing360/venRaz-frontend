"use client";

import Link from "next/link";
import {  Mail, MapPin, Phone } from "lucide-react";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { title: "Home", href: "/" },
      { title: "Shop", href: "/shop" },
      { title: "Categories", href: "/categories" },
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { title: "My Account", href: "/account" },
      { title: "Shopping Cart", href: "/cart" },
      { title: "Wishlist", href: "/wishlist" },
      { title: "Track Order", href: "/track-order" },
      { title: "FAQ", href: "/faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold text-indigo-400"
            >
              VenRaz
            </Link>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Your trusted destination for quality electronics,
              smart devices, and modern tech accessories.
            </p>

            {/* Contact */}
            <div className="mt-5 space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@venraz.com</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+880 1234-567890</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Rajshahi, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold">
                {section.title}
              </h3>

              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition hover:text-indigo-400"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold">
              Newsletter
            </h3>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Subscribe to get the latest products, offers and
              exclusive deals.
            </p>

            <form className="mt-5 flex">
              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-l-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-indigo-500"
              />

              <button
                type="submit"
                className="rounded-r-lg bg-indigo-600 px-4 py-2 text-sm font-medium transition hover:bg-indigo-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="my-8 border-t border-gray-800" />

        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} VenRaz. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              aria-label="Facebook"
              className="text-gray-400 transition hover:text-indigo-400"
            >
              
            </Link>

            <Link
              href="#"
              aria-label="Instagram"
              className="text-gray-400 transition hover:text-indigo-400"
            >
              
            </Link>

            <Link
              href="#"
              aria-label="LinkedIn"
              className="text-gray-400 transition hover:text-indigo-400"
            >
            
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}