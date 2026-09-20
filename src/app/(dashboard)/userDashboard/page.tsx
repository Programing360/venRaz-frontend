"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Heart,
  Store,
  Phone,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface OverviewStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  wishlistCount: number;
}

interface MyShop {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  phone: string;
  status: string;
  rating?: number;
}

interface RecentOrder {
  _id: string;
  trackingId: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
}

const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const formatDate = (dateValue?: string): string => {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "out_for_delivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status || "Pending";
  }
};

const statusBadge = (status: string): string => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-rose-100 text-rose-700";
    case "confirmed":
    case "processing":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const token = session?.session?.token;

  const [stats, setStats] = useState<OverviewStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    wishlistCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<MyShop | null>(null);
  const [shopLoading, setShopLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) return;

    const controllers = [new AbortController(), new AbortController()];

    async function loadDashboard() {
      try {
        const overviewRes = await fetch(`${API_URL}/users/dashboard-overview`, {
          headers: getAuthHeaders(token),
          credentials: "include",
          signal: controllers[0].signal,
        });
        if (overviewRes.ok) {
          const overviewJson = await overviewRes.json();
          const overview = overviewJson?.data;

          if (overview) {
            setStats({
              totalOrders: Number(overview.totalOrders ?? 0),
              pendingOrders: Number(overview.pendingOrders ?? 0),
              completedOrders: Number(overview.completedOrders ?? 0),
              wishlistCount: Number(overview.wishlistCount ?? 0),
            });
          }
        }

        const ordersRes = await fetch(`${API_URL}/orders/my-orders`, {
          headers: getAuthHeaders(token),
          credentials: "include",
          signal: controllers[1].signal,
        });

        if (ordersRes.ok) {
          const ordersJson = await ordersRes.json();
          const orders = Array.isArray(ordersJson?.data) ? ordersJson.data : [];
          setRecentOrders(orders.slice(0, 5));
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Dashboard loading failed:", err);
        }
      } finally {
        if (!controllers[0].signal.aborted && !controllers[1].signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      controllers.forEach((controller) => controller.abort());
    };
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!token || !session?.user?.id || !API_URL) {
        if (!cancelled) setShopLoading(false);
        return;
      }

      const controller = new AbortController();

      try {
        const res = await fetch(`${API_URL}/shops/my-shop/${session.user.id}`, {
          headers: getAuthHeaders(token),
          credentials: "include",
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (res.status === 404) {
          setShop(null);
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to load shop: ${res.status}`);
        }

        const json = await res.json();
        setShop(json?.data ?? null);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to load my shop:", err);
        }
      } finally {
        if (!cancelled && !controller.signal.aborted) {
          setShopLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, session?.user?.id]);

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-purple-50 text-purple-600 border border-purple-100",
    },
    {
      title: "Pending Delivery",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border border-amber-100",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    },
    {
      title: "Saved Wishlist",
      value: stats.wishlistCount,
      icon: Heart,
      color: "bg-rose-50 text-rose-600 border border-rose-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name || "Customer"} 👋
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Here is an overview of your recent account activity and orders.
        </p>
      </div>

      {/* My Shop Panel */}
      <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-purple-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-600/30">
              <Store size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Shop</h3>
              <p className="text-xs text-gray-500">
                Your vendor storefront and its current status
              </p>
            </div>
          </div>

          <Link
            href="/userDashboard/createShop"
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-purple-700 shadow-sm shadow-purple-600/20"
          >
            <PlusCircle size={14} />
            <span>Create Shop</span>
          </Link>
        </div>

        <div className="p-5">
          {shopLoading ? (
            <p className="py-4 text-center text-sm text-gray-500">
              Loading your shop...
            </p>
          ) : shop ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {shop.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shop.images[0]}
                  alt={shop.name}
                  className="h-20 w-20 shrink-0 rounded-xl border border-purple-100 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <Store size={28} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold text-gray-900">
                    {shop.name}
                  </h4>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                      shop.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : shop.status === "approved" || shop.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : shop.status === "rejected" ||
                              shop.status === "suspended"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {shop.status}
                  </span>
                </div>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {shop.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>
                    Category:{" "}
                    <strong className="text-gray-900">{shop.category}</strong>
                  </span>
                  <span>•</span>
                  {shop.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone size={12} /> {shop.phone}
                    </span>
                  )}
                  {shop.rating != null && shop.rating > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        Rating:{" "}
                        <strong className="text-gray-900">{shop.rating}</strong>
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Link
                href="/userDashboard"
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline"
              >
                View dashboard <ExternalLink size={13} />
              </Link>
            </div>
          ) : (
            <div className="py-6 text-center">
              <Store className="mx-auto text-purple-600" size={32} />
              <p className="mt-2 text-sm font-medium text-gray-900">
                You don&apos;t have a shop yet
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Create your vendor storefront and start selling on the
                marketplace.
              </p>
              <Link
                href="/userDashboard/createShop"
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-purple-700 shadow-sm shadow-purple-600/20"
              >
                <PlusCircle size={14} />
                Create My Shop
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="flex items-center justify-between rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {loading ? "..." : stat.value}
                </p>
              </div>

              <div className={`rounded-xl p-3 ${stat.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-purple-100 p-5">
          <h3 className="font-semibold text-gray-900">Recent Purchases</h3>

          <Link
            href="/userDashboard/orders"
            className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-gray-500">
            Loading your recent orders...
          </p>
        ) : recentOrders.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-purple-700 shadow-sm shadow-purple-600/20"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-purple-50/60 text-purple-900">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition-colors hover:bg-purple-50/30"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      <Link
                        href={`/userDashboard/orders/${order._id}`}
                        className="font-mono hover:text-purple-600"
                      >
                        {order.trackingId}
                      </Link>
                    </td>

                    <td className="p-4 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="p-4 font-semibold text-gray-900">
                      ${Number(order.totalAmount ?? 0).toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(
                          order.status,
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
