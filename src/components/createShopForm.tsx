"use client"
import React, { useState } from 'react';
import { Shop, ShopCategory, ShopStatus } from '../../types';

import { ImageUploader } from '../components/imageUploader';
import { 
  Store, 
  Sparkles, 
  ArrowLeft, 
  Send, 
  Save, 
  HelpCircle, 
  Phone, 
  MapPin, 
  Layers, 
  FileText, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { PRESET_BANNERS, PRESET_LOGOS, SHOP_CATEGORIES } from '@/data/mockdata';

interface CreateShopFormProps {
  onSaveShop?: (shop: Shop, status: ShopStatus) => void;
  onCancel?: () => void;
  onOpenCloudinarySettings?: () => void;
  initialValues?: Partial<Shop>;
}

export const CreateShopForm: React.FC<CreateShopFormProps> = ({
  onSaveShop,
  onCancel,
  onOpenCloudinarySettings,
  initialValues,
}) => {
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    logoUrl: initialValues?.logoUrl || '',
    bannerUrl: initialValues?.bannerUrl || '',
    description: initialValues?.description || '',
    category: (initialValues?.category as ShopCategory) || 'Fashion & Apparel',
    phone: initialValues?.phone || '',
    address: initialValues?.address || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Shop name is required';
    if (!formData.logoUrl.trim()) newErrors.logoUrl = 'Shop logo is required';
    if (!formData.bannerUrl.trim()) newErrors.bannerUrl = 'Shop banner is required';
    if (!formData.description.trim()) newErrors.description = 'Shop description is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Store address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (targetStatus: ShopStatus) => {
    if (targetStatus === 'Pending') {
      if (!validate()) return;
    } else {
      // Draft requires at least a shop name
      if (!formData.name.trim()) {
        setErrors({ name: 'Please enter a shop name to save as draft' });
        return;
      }
    }

    setIsSubmitting(true);

    const newShop: Shop = {
      id: initialValues?.id || `shp_${Date.now().toString().slice(-6)}`,
      name: formData.name.trim(),
      logoUrl: formData.logoUrl.trim() || PRESET_LOGOS[0].url,
      bannerUrl: formData.bannerUrl.trim() || PRESET_BANNERS[0].url,
      description: formData.description.trim() || 'No description provided.',
      category: formData.category,
      phone: formData.phone.trim() || '+880 1700-000000',
      address: formData.address.trim() || 'Not specified',
      status: targetStatus,
      statusReason: targetStatus === 'Pending' 
        ? 'Application submitted on ' + new Date().toLocaleDateString() + ' — pending administrator review.'
        : 'Saved as draft.',
      createdAt: initialValues?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sellerName: 'Shamsul Haque',
      sellerEmail: 'webdevlopershamsul@gmail.com',
      totalProducts: initialValues?.totalProducts || 0,
      totalOrders: initialValues?.totalOrders || 0,
      totalSales: initialValues?.totalSales || 0,
      rating: initialValues?.rating || 5.0,
      reviewCount: initialValues?.reviewCount || 0,
    };

    setTimeout(() => {
      onSaveShop(newShop, targetStatus);
      setIsSubmitting(false);
    }, 400);
  };

  const handleFillDemoData = () => {
    setFormData({
      name: 'Bengal Loom & Craft Studio',
      logoUrl: PRESET_LOGOS[1].url,
      bannerUrl: PRESET_BANNERS[0].url,
      description: 'Exclusive heritage Jamdani sarees, handcrafted ceramic tableware, and sustainably sourced bamboo decor crafted in Bangladesh.',
      category: 'Artisanal & Crafts',
      phone: '+880 1819-234567',
      address: 'Suite 4B, Gulshan Pink City, Road 103, Dhaka 1212',
    });
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            id="back-to-dashboard-btn"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Store size={22} />
            </div>
            <span>Create New Shop</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete the details below to establish your vendor storefront on the marketplace.
          </p>
        </div>

        {/* Quick Demo Pre-fill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="fill-sample-shop-btn"
            onClick={handleFillDemoData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors shadow-2xs"
          >
            <Sparkles size={14} />
            <span>Autofill Sample Shop</span>
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-8">
        {/* Section 1: Basic Information */}
        <section className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Store size={18} className="text-indigo-600" />
              <span>Shop Essentials</span>
            </h2>
            <p className="text-xs text-slate-500">Provide your official store identity and category</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Shop Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Shop Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="shop-name-input"
                placeholder="e.g., Artisan Heritage Studio"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/20'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="shop-category-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ShopCategory })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800"
              >
                {SHOP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Shop Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="shop-description-input"
              rows={3}
              placeholder="Tell buyers what makes your shop unique, products you offer, and brand story..."
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.description
                  ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/20'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.description}
              </p>
            )}
          </div>
        </section>

        {/* Section 2: Visual Branding (Cloudinary Uploads) */}
        <section className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers size={18} className="text-indigo-600" />
                <span>Shop Branding & Media</span>
              </h2>
              <p className="text-xs text-slate-500">
                Uploaded securely via <strong>Cloudinary</strong> for fast global CDN delivery
              </p>
            </div>
            <button
              type="button"
              id="open-cloudinary-settings-from-form"
              onClick={onOpenCloudinarySettings}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium underline"
            >
              Cloudinary Config
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Shop Logo */}
            <div className="md:col-span-1">
              <ImageUploader
                label="Shop Logo"
                sublabel="Square 1:1 format (400x400px recommended)"
                value={formData.logoUrl}
                onChange={(url) => {
                  setFormData({ ...formData, logoUrl: url });
                  if (errors.logoUrl) setErrors({ ...errors, logoUrl: '' });
                }}
                aspectRatio="square"
                presets={PRESET_LOGOS}
                onOpenCloudinarySettings={onOpenCloudinarySettings}
                idPrefix="shop-logo"
              />
              {errors.logoUrl && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.logoUrl}
                </p>
              )}
            </div>

            {/* Shop Banner */}
            <div className="md:col-span-2">
              <ImageUploader
                label="Shop Banner"
                sublabel="Panoramic 3:1 banner for your seller storefront header (1200x400px recommended)"
                value={formData.bannerUrl}
                onChange={(url) => {
                  setFormData({ ...formData, bannerUrl: url });
                  if (errors.bannerUrl) setErrors({ ...errors, bannerUrl: '' });
                }}
                aspectRatio="banner"
                presets={PRESET_BANNERS}
                onOpenCloudinarySettings={onOpenCloudinarySettings}
                idPrefix="shop-banner"
              />
              {errors.bannerUrl && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.bannerUrl}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Contact & Address */}
        <section className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-indigo-600" />
              <span>Contact & Physical Address</span>
            </h2>
            <p className="text-xs text-slate-500">
              Required for compliance, dispatch logistics, and customer support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  id="shop-phone-input"
                  placeholder="+880 1712-345678"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                      : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Shop / Warehouse Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={16} />
                </div>
                <input
                  type="text"
                  id="shop-address-input"
                  placeholder="Street address, City, Postal Code"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.address
                      ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                      : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.address}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>By submitting, you agree to the Seller Terms of Service.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              id="cancel-create-shop-btn"
              onClick={onCancel}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              id="save-draft-btn"
              disabled={isSubmitting}
              onClick={() => handleSubmit('Draft')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Save size={15} />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              id="submit-shop-btn"
              disabled={isSubmitting}
              onClick={() => handleSubmit('Pending')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
            >
              <Send size={15} />
              <span>Submit for Approval</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
