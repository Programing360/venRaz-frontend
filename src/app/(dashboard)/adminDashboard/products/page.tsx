'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  ExternalLink,
  DollarSign,
  Store,
  Tag,
  Filter,
} from 'lucide-react';
import {
  getAdminProducts,
  approveProduct,
  rejectProduct,
  toggleProductVisibility,
} from '@/services/adminService';
import { AdminProduct, AdminProductStatus } from '@/types/admin';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(() => getAdminProducts());
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [previewProduct, setPreviewProduct] = useState<AdminProduct | null>(null);
  const [rejectModalProduct, setRejectModalProduct] = useState<AdminProduct | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const handleUpdate = () => setProducts(getAdminProducts());
    window.addEventListener('venraz_admin_data_updated', handleUpdate);
    return () => window.removeEventListener('venraz_admin_data_updated', handleUpdate);
  }, []);

  const handleApprove = (product: AdminProduct) => {
    approveProduct(product.id);
    showToast(`Product "${product.name}" is now APPROVED & visible to buyers!`);
    if (previewProduct?.id === product.id) {
      setPreviewProduct((prev) => (prev ? { ...prev, status: 'Approved' } : null));
    }
  };

  const handleOpenReject = (product: AdminProduct) => {
    setRejectModalProduct(product);
    setRejectionReason('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalProduct) return;
    if (!rejectionReason.trim()) {
      showToast('Please specify a rejection reason.', 'error');
      return;
    }
    rejectProduct(rejectModalProduct.id, rejectionReason.trim());
    showToast(`Product "${rejectModalProduct.name}" has been REJECTED.`);
    setRejectModalProduct(null);
    setRejectionReason('');
    if (previewProduct?.id === rejectModalProduct.id) {
      setPreviewProduct((prev) => (prev ? { ...prev, status: 'Rejected', rejectionReason: rejectionReason.trim() } : null));
    }
  };

  const handleToggleHide = (product: AdminProduct) => {
    toggleProductVisibility(product.id);
    const willBeHidden = product.status !== 'Hidden';
    showToast(
      willBeHidden
        ? `Product "${product.name}" is now HIDDEN from public catalog.`
        : `Product "${product.name}" is now UNHIDDEN and live.`
    );
    if (previewProduct?.id === product.id) {
      setPreviewProduct((prev) =>
        prev ? { ...prev, status: willBeHidden ? 'Hidden' : 'Approved' } : null
      );
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'Pending' && p.status === 'Pending') ||
      (activeTab === 'Approved' && p.status === 'Approved') ||
      (activeTab === 'Rejected' && p.status === 'Rejected') ||
      (activeTab === 'Hidden' && p.status === 'Hidden');

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const pendingCount = products.filter((p) => p.status === 'Pending').length;
  const approvedCount = products.filter((p) => p.status === 'Approved').length;
  const hiddenCount = products.filter((p) => p.status === 'Hidden').length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-emerald-500/20 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-rose-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Product Moderation & Approvals
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Audit newly submitted vendor merchandise, verify pricing & descriptions, approve compliant goods, and hide flagged listings.
          </p>
        </div>

        {pendingCount > 0 && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-400 self-start">
            <Clock className="h-4 w-4" />
            <span>{pendingCount} Awaiting Moderation</span>
          </span>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Products', count: products.length },
            { id: 'Pending', label: 'Pending Approval', count: pendingCount, highlight: true },
            { id: 'Approved', label: 'Approved (Live)', count: approvedCount },
            { id: 'Hidden', label: 'Hidden / Delisted', count: hiddenCount },
            { id: 'Rejected', label: 'Rejected', count: products.filter((p) => p.status === 'Rejected').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-850 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeTab === tab.id
                    ? 'bg-zinc-950/20 text-zinc-950'
                    : tab.highlight && tab.count > 0
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search product, seller, shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Item & Visual</th>
                <th className="py-3.5 px-4">Storefront & Seller</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pricing & Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No products found matching your filter selection.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-800/25 transition-colors">
                    {/* Item */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-cover border border-zinc-800 bg-zinc-950"
                        />
                        <div>
                          <p className="font-bold text-white max-w-xs truncate">{product.name}</p>
                          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Store & Seller */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                        <Store className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{product.shopName}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">By {product.sellerName}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-[11px] font-medium">
                        <Tag className="h-3 w-3 text-zinc-500" />
                        {product.category}
                      </span>
                    </td>

                    {/* Price & Stock */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">Óº│{product.price.toLocaleString()}</div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {product.stock > 0 ? (
                          <span className="text-emerald-400">{product.stock} in stock</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">Out of stock</span>
                        )}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          product.status === 'Approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : product.status === 'Pending'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                            : product.status === 'Hidden'
                            ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {product.status === 'Approved' && <CheckCircle2 className="h-3 w-3" />}
                        {product.status === 'Pending' && <Clock className="h-3 w-3" />}
                        {product.status === 'Hidden' && <EyeOff className="h-3 w-3" />}
                        {product.status === 'Rejected' && <XCircle className="h-3 w-3" />}
                        <span>{product.status}</span>
                      </span>

                      {product.rejectionReason && (
                        <p className="text-[10px] text-rose-400/80 line-clamp-1 mt-1 max-w-[180px]">
                          {product.rejectionReason}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview */}
                        <button
                          onClick={() => setPreviewProduct(product)}
                          className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all"
                          title="View Product Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Pending Approvals */}
                        {product.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleOpenReject(product)}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-semibold transition-all"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(product)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 text-[11px] font-bold transition-all shadow-md shadow-emerald-500/10"
                            >
                              Approve
                            </button>
                          </>
                        )}

                        {/* Approved Items: Hide / Unhide */}
                        {product.status === 'Approved' && (
                          <button
                            onClick={() => handleToggleHide(product)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-[11px] font-semibold transition-all"
                            title="Hide from public buyers"
                          >
                            <EyeOff className="h-3 w-3 text-amber-400" />
                            <span>Hide</span>
                          </button>
                        )}

                        {/* Hidden Items: Unhide */}
                        {product.status === 'Hidden' && (
                          <button
                            onClick={() => handleToggleHide(product)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-semibold transition-all"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Unhide</span>
                          </button>
                        )}

                        {/* Rejected Items: Re-Approve option */}
                        {product.status === 'Rejected' && (
                          <button
                            onClick={() => handleApprove(product)}
                            className="px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-semibold transition-all"
                          >
                            Re-Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Product Modal */}
      {rejectModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reject Product Listing</h3>
                <p className="text-xs text-zinc-400 truncate max-w-[280px]">
                  {rejectModalProduct.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Rejection Reason for Vendor <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this product is rejected (e.g. Counterfeit brand, prohibited supplements, misleading pricing or copyright image)..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalProduct(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-600/20 transition-all"
                >
                  Reject Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Product Moderation Review</h3>
              <button
                onClick={() => setPreviewProduct(null)}
                className="text-zinc-400 hover:text-white"
              >
                Ô£ò
              </button>
            </div>

            <div className="space-y-4">
              <div className="h-56 w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
                <img
                  src={previewProduct.imageUrl}
                  alt={previewProduct.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{previewProduct.name}</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Store: <strong className="text-emerald-400">{previewProduct.shopName}</strong> ÔÇó Seller: {previewProduct.sellerName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                  <span className="text-zinc-500 block text-[11px]">Price:</span>
                  <span className="text-base font-black text-white">
                    Óº│{previewProduct.price.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                  <span className="text-zinc-500 block text-[11px]">Inventory Stock:</span>
                  <span className="text-base font-bold text-emerald-400">
                    {previewProduct.stock} units
                  </span>
                </div>
              </div>

              {previewProduct.rejectionReason && (
                <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-xs text-rose-300">
                  <strong>Rejection Reason: </strong>
                  {previewProduct.rejectionReason}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
                >
                  Close
                </button>
                {previewProduct.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => {
                        setPreviewProduct(null);
                        handleOpenReject(previewProduct);
                      }}
                      className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(previewProduct)}
                      className="px-5 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
                    >
                      Approve Product
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
