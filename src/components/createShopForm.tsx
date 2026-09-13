"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Phone,
  MapPin,
  AlertCircle,
  Send,
  Loader2,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { ImageUploader } from "./imageUploader";
import { useSession } from "@/lib/auth-client";
import { useToast } from "@/context/ToastContext";
import { SHOP_CATEGORIES } from "@/data/mockdata";
import { Shop, ShopCategory } from "@/types";

interface CreateShopFormProps {
  onSaveShop?: (shop: Partial<Shop>, status: string) => void;
  onCancel?: () => void;
}

export const CreateShopForm: React.FC<CreateShopFormProps> = ({
  onSaveShop,
  onCancel,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: SHOP_CATEGORIES[0],
    address: "",
    phone: "",
    photoUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Shop name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.photoUrl.trim()) {
      newErrors.photoUrl = "Shop photo is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ownerId: session?.user?.id || session?.user?.email,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        images: [formData.photoUrl.trim()],
        status: "pending",
      };

      const token = (session as any)?.session?.token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shops/create-shop`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const text = await response.text();

        let errMsg = `API returned status ${response.status}`;

        try {
          const parsed = JSON.parse(text);
          errMsg = parsed.message || parsed.error || errMsg;
        } catch (_) {}

        throw new Error(errMsg);
      }

      const json = await response.json();

      if (json.success === false) {
        throw new Error(json.message || "Failed to create shop");
      }

      onSaveShop?.(payload as unknown as Shop, "Pending");

      success("Your shop has been submitted for approval.");

      router.push("/shop");
    } catch (err: any) {
      console.error("Create Shop Error:", err);

      showError(err.message || "Failed to submit shop for approval.");

      setErrors({
        api: err.message || "An error occurred during submission.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-5xl"
    >
      {/* ───────────────── Header ───────────────── */}
      <header className="mb-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
            <Store className="h-5 w-5" />
          </div>

          <div className="h-px w-10 bg-amber-400" />

          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Merchant Center
          </span>
        </div>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Create your shop
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Tell customers what makes your business special. Once submitted,
              our team will review your application.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Start selling with confidence
          </div>
        </div>
      </header>

      {/* ───────────────── Application ───────────────── */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left Rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="border-l-2 border-slate-200 pl-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-600">
                  Application
                </p>

                <h2 className="mt-2 text-lg font-bold text-slate-950">
                  Shop details
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Complete each section with accurate information so customers
                  can easily understand your business.
                </p>
              </div>

              <div className="mt-8 space-y-5 pl-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-[10px] font-bold text-white">
                    01
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Identity
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-[10px] font-bold text-slate-400">
                    02
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Contact
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-[10px] font-bold text-slate-400">
                    03
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Submit
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Form */}
          <div className="space-y-6">
            {/* Error */}
            {errors.api && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <div>
                  <p className="font-semibold">Something went wrong</p>
                  <p className="mt-0.5 text-xs text-red-600">
                    {errors.api}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ───────── Identity ───────── */}
            <section className="border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-bold text-amber-600">
                    01
                  </span>

                  <div>
                    <h2 className="text-base font-bold text-slate-950">
                      Shop identity
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Give your store a recognizable identity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-7">
                {/* Photo */}
                <div>
                  <ImageUploader
                    label="Shop image"
                    sublabel="Use a clear, professional image that represents your store."
                    value={formData.photoUrl}
                    onChange={(url) => updateField("photoUrl", url)}
                    aspectRatio="square"
                    idPrefix="shop-photo"
                  />

                  {errors.photoUrl && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.photoUrl}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Shop name
                    <span className="ml-1 text-amber-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Apex Supplies"
                    value={formData.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    className={`w-full border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                      errors.name
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Category
                    <span className="ml-1 text-amber-500">*</span>
                  </label>

                  <select
                    value={formData.category}
                    onChange={(e) =>
                      updateField(
                        "category",
                        e.target.value as ShopCategory,
                      )
                    }
                    className="w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                  >
                    {SHOP_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    About your shop
                    <span className="ml-1 text-amber-500">*</span>
                  </label>

                  <textarea
                    rows={5}
                    placeholder="What do you sell? What makes your shop different?"
                    value={formData.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    className={`w-full resize-none border bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                      errors.description
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                    }`}
                  />

                  {errors.description && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ───────── Contact ───────── */}
            <section className="border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-bold text-amber-600">
                    02
                  </span>

                  <div>
                    <h2 className="text-base font-bold text-slate-950">
                      Contact information
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Add reliable contact details for your customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 md:grid-cols-2">
                {/* Address */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Business address
                    <span className="ml-1 text-amber-500">*</span>
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      placeholder="Store address"
                      value={formData.address}
                      onChange={(e) =>
                        updateField("address", e.target.value)
                      }
                      className={`w-full border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                        errors.address
                          ? "border-red-400 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                      }`}
                    />
                  </div>

                  {errors.address && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Phone number
                    <span className="ml-1 text-amber-500">*</span>
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        updateField("phone", e.target.value)
                      }
                      className={`w-full border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                        errors.phone
                          ? "border-red-400 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                      }`}
                    />
                  </div>

                  {errors.phone && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ───────── Review ───────── */}
            <section className="border border-slate-200 bg-slate-50">
              <div className="p-5 sm:p-7">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-950">
                      Ready to submit?
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your shop will be reviewed before it becomes visible to
                      customers. Make sure all information is accurate.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ───────── Actions ───────── */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-1 py-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-950"
                  >
                    Cancel application
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center justify-center gap-3 bg-slate-950 px-6 py-3.5 text-xs font-bold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting application
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit for approval
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
