
"use client";

import { FormEvent, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    // TODO:
    // এখানে তোমার contact API connect করতে পারবে

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you! Your message has been sent.");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-white">

      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff5f3] via-white to-[#fff1ef] pb-20 pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ff594d]/10 px-4 py-2 text-sm font-semibold text-[#ff594d]">
              <MessageCircle className="h-4 w-4" />
              Get In Touch
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              We&apos;d Love to
              <span className="block text-[#ff594d]">
                Hear From You
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Have a question, suggestion, or need help with your order?
              Our team is here to help. Send us a message and we&apos;ll
              get back to you as soon as possible.
            </p>

          </div>
        </div>
      </section>

      {/* =========================
          CONTACT SECTION
      ========================== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-5">

            {/* =====================
                CONTACT INFO
            ====================== */}
            <div className="lg:col-span-2">

              <p className="font-semibold uppercase tracking-wider text-[#ff594d]">
                Contact Information
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Let&apos;s Talk
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                Whether you have a question about products, orders,
                delivery, or anything else, feel free to contact us.
              </p>

              {/* Contact Cards */}
              <div className="mt-8 space-y-4">

                {/* Email */}
                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:border-[#ff594d]/30 hover:bg-[#fff8f7]">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff594d]/10">
                    <Mail className="h-6 w-6 text-[#ff594d]" />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Email Us
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      support@venraz.com
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      We&apos;ll reply within 24 hours
                    </p>
                  </div>

                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:border-[#ff594d]/30 hover:bg-[#fff8f7]">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff594d]/10">
                    <Phone className="h-6 w-6 text-[#ff594d]" />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Call Us
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      +880 1234-567890
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Sat - Thu, 9:00 AM - 6:00 PM
                    </p>
                  </div>

                </div>

                {/* Location */}
                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:border-[#ff594d]/30 hover:bg-[#fff8f7]">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff594d]/10">
                    <MapPin className="h-6 w-6 text-[#ff594d]" />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Our Location
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Dhaka, Bangladesh
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Visit us during business hours
                    </p>
                  </div>

                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:border-[#ff594d]/30 hover:bg-[#fff8f7]">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff594d]/10">
                    <Clock className="h-6 w-6 text-[#ff594d]" />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Working Hours
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Saturday - Thursday
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      9:00 AM - 6:00 PM
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* =====================
                CONTACT FORM
            ====================== */}
            <div className="lg:col-span-3">

              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100 sm:p-8">

                <div className="mb-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff594d]/10">
                    <Headphones className="h-7 w-7 text-[#ff594d]" />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-gray-900">
                    Send Us a Message
                  </h2>

                  <p className="mt-2 text-gray-500">
                    Fill out the form below and our team will get back to
                    you shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name + Email */}
                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Your Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ff594d] focus:bg-white focus:ring-2 focus:ring-[#ff594d]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Email Address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ff594d] focus:bg-white focus:ring-2 focus:ring-[#ff594d]/10"
                      />
                    </div>

                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="How can we help you?"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ff594d] focus:bg-white focus:ring-2 focus:ring-[#ff594d]/10"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Write your message here..."
                      required
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ff594d] focus:bg-white focus:ring-2 focus:ring-[#ff594d]/10"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff594d] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#ff594d]/20 transition hover:bg-[#e94d43] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>

                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          FAQ / SUPPORT CTA
      ========================== */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          <div className="rounded-3xl bg-[#ff594d] px-6 py-12 text-center text-white shadow-xl sm:px-12">

            <MessageCircle className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              Need More Help?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/90">
              Our customer support team is always ready to help you with
              your shopping experience, orders, returns, and other
              questions.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-4">

              <a
                href="mailto:support@venraz.com"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#ff594d] transition hover:bg-gray-100"
              >
                <Mail className="h-5 w-5" />
                Email Support
              </a>

              <a
                href="tel:+8801234567890"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                Call Us
              </a>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

