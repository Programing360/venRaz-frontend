"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Clock, CheckCircle2, Heart } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface OverviewStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  wishlistCount: number;
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
      return "bg-amber-100 text-amber-800";
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
          console.log(overviewJson);
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

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Delivery",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Saved Wishlist",
      value: stats.wishlistCount,
      icon: Heart,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0E1B1B]">
          Welcome back, {session?.user?.name || "Customer"} 👋
        </h2>

        <p className="mt-1 text-sm text-[#6B7268]">
          Here is an overview of your recent account activity and orders.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="flex items-center justify-between rounded-xl border border-[#DEDACE] bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-xs font-medium text-[#6B7268]">
                  {stat.title}
                </p>

                <p className="mt-1 text-2xl font-bold text-[#0E1B1B]">
                  {loading ? "..." : stat.value}
                </p>
              </div>

              <div className={`rounded-lg p-3 ${stat.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="overflow-hidden rounded-xl border border-[#DEDACE] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DEDACE] p-5">
          <h3 className="font-semibold text-[#0E1B1B]">Recent Purchases</h3>

          <Link
            href="/userDashboard/orders"
            className="text-sm font-medium text-[#C08A3E] hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-[#6B7268]">
            Loading your recent orders...
          </p>
        ) : recentOrders.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-[#6B7268]">
              You haven't placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block rounded-lg bg-[#C08A3E] px-4 py-2 text-xs font-semibold text-white"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#F4F2EC] text-[#6B7268]">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DEDACE]">
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition-colors hover:bg-[#FAF9F6]"
                  >
                    <td className="p-4 font-medium text-[#0E1B1B]">
                      <Link
                        href={`/userDashboard/orders/${order._id}`}
                        className="font-mono hover:text-[#C08A3E]"
                      >
                        {order.trackingId}
                      </Link>
                    </td>

                    <td className="p-4 text-[#6B7268]">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="p-4 font-semibold text-[#0E1B1B]">
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
