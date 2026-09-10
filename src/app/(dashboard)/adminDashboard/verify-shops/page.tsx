"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Store,
  Phone,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ShopData {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  phone: string;
  status: string;
  rejectionReason?: string;
  rating?: number;
  createdAt: string;
}

interface VerificationResult {
  status: "approved" | "rejected" | "needs_review";
  trustScore: number;
  enhancedData: { shopName: string; description: string; tags: string[] };
  feedback: { reason: string; issuesFound: string[] };
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; icon: React.ElementType }
> = {
  pending: { bg: "bg-amber-500/10", text: "text-amber-400", icon: ShieldAlert },
  approved: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    icon: ShieldCheck,
  },
  active: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    icon: ShieldCheck,
  },
  rejected: { bg: "bg-rose-500/10", text: "text-rose-400", icon: ShieldX },
  draft: { bg: "bg-zinc-500/10", text: "text-zinc-400", icon: ShieldAlert },
  suspended: { bg: "bg-red-500/10", text: "text-red-400", icon: ShieldX },
};

export default function VerifyShopsPage() {
  const [shops, setShops] = useState<ShopData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<ShopData | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(
    null,
  );
  const [verifying, setVerifying] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/shops`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (Array.isArray(data)) {
          setShops(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const runVerification = async (shop: ShopData) => {
    setSelectedShop(shop);
    setVerifying(true);
    setVerification(null);
    try {
      const res = await fetch(`${API_URL}/shops/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName: shop.name,
          description: shop.description,
          address: shop.phone || "",
          phone: shop.phone,
          ownerName: shop.ownerId,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setVerification(json.data);
      }
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setVerifying(false);
    }
  };

  const updateShopStatus = async (
    shopId: string,
    status: string,
    reason?: string,
  ) => {
    setActionLoading(shopId);
    try {
      const res = await fetch(`${API_URL}/shops/update/my-shop/${shopId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason: reason || "" }),
      });
      if (res.ok) {
        setShops((prev) =>
          prev.map((s) =>
            s._id === shopId
              ? { ...s, status, rejectionReason: reason || "" }
              : s,
          ),
        );
        if (selectedShop?._id === shopId) {
          setSelectedShop((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update shop:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingShops = shops.filter((s) => s.status === "pending");
  const allShops = shops;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Shop Verification
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review and verify seller shop registration requests
          </p>
        </div>
        <button
          type="button"
          onClick={fetchShops}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Pending Review
          </p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">
            {pendingShops.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Total Shops
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">
            {allShops.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Active Shops
          </p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
            {
              allShops.filter(
                (s) => s.status === "active" || s.status === "approved",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shop List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-1">
            All Shops ({allShops.length})
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
            </div>
          ) : allShops.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No shops found
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {allShops.map((shop) => {
                const style = STATUS_STYLES[shop.status] || STATUS_STYLES.draft;
                const StatusIcon = style.icon;
                const isSelected = selectedShop?._id === shop._id;

                return (
                  <button
                    key={shop._id}
                    type="button"
                    onClick={() => runVerification(shop)}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {shop.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                          {shop.category}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${style.bg} ${style.text}`}
                      >
                        <StatusIcon size={10} />
                        {shop.status}
                      </span>
                    </div>
                    {shop.status === "pending" && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                        <Eye size={10} />
                        Click to verify
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Verification Detail Panel */}
        <div className="lg:col-span-2">
          {!selectedShop ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center">
              <Store className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-400">
                Select a shop to verify
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                Click any shop from the list to run AI verification
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-5">
              {/* Shop Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedShop.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {selectedShop.category} &middot; Owner:{" "}
                    {selectedShop.ownerId}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    STATUS_STYLES[selectedShop.status]?.bg || ""
                  } ${STATUS_STYLES[selectedShop.status]?.text || ""}`}
                >
                  {selectedShop.status}
                </span>
              </div>

              {/* Shop Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-3">
                  <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    Phone
                  </p>
                  <p className="text-xs text-zinc-200 flex items-center gap-1.5">
                    <Phone size={12} className="text-zinc-500" />
                    {selectedShop.phone || "Not provided"}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-3">
                  <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    Created
                  </p>
                  <p className="text-xs text-zinc-200">
                    {new Date(selectedShop.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-3">
                <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">
                  Description
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedShop.description || "No description provided."}
                </p>
              </div>

              {/* Verification Loading */}
              {verifying && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                    <span className="text-xs font-semibold">
                      Running AI verification...
                    </span>
                  </div>
                </div>
              )}

              {/* Verification Result */}
              {verification && !verifying && (
                <div className="space-y-4">
                  {/* Trust Score */}
                  <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase text-zinc-500">
                        Trust Score
                      </p>
                      <span
                        className={`text-lg font-extrabold ${
                          verification.trustScore >= 80
                            ? "text-emerald-400"
                            : verification.trustScore >= 50
                              ? "text-amber-400"
                              : "text-rose-400"
                        }`}
                      >
                        {verification.trustScore}/100
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          verification.trustScore >= 80
                            ? "bg-emerald-500"
                            : verification.trustScore >= 50
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                        style={{ width: `${verification.trustScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">
                      {verification.feedback.reason}
                    </p>
                  </div>

                  {/* Issues */}
                  {verification.feedback.issuesFound.length > 0 && (
                    <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-4">
                      <p className="text-xs font-bold text-rose-400 uppercase mb-2">
                        Issues Found
                      </p>
                      <ul className="space-y-1.5">
                        {verification.feedback.issuesFound.map((issue, i) => (
                          <li
                            key={i}
                            className="text-xs text-rose-300 flex items-start gap-2"
                          >
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Enhanced Data */}
                  <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase text-zinc-500">
                      Enhanced Data
                    </p>
                    <div>
                      <p className="text-[10px] text-zinc-500 mb-0.5">
                        Shop Name
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {verification.enhancedData.shopName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 mb-0.5">
                        Optimized Description
                      </p>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {verification.enhancedData.description}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {verification.enhancedData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedShop.status === "pending" && (
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        disabled={actionLoading === selectedShop._id}
                        onClick={() =>
                          updateShopStatus(selectedShop._id, "approved")
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === selectedShop._id}
                        onClick={() =>
                          updateShopStatus(
                            selectedShop._id,
                            "rejected",
                            "Failed verification checks",
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
