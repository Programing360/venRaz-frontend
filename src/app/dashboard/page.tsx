"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();

  const stats = [
    {
      title: "Total Orders",
      value: "12",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Delivery",
      value: "2",
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Completed Orders",
      value: "10",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Saved Wishlist",
      value: "5",
      icon: Heart,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-9482",
      date: "Aug 28, 2026",
      total: "$129.00",
      status: "Delivered",
    },
    {
      id: "ORD-8391",
      date: "Aug 24, 2026",
      total: "$84.50",
      status: "Processing",
    },
    {
      id: "ORD-7210",
      date: "Aug 15, 2026",
      total: "$210.00",
      status: "Delivered",
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
        {stats.map((stat) => {
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
                  {stat.value}
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
          <h3 className="font-semibold text-[#0E1B1B]">
            Recent Purchases
          </h3>

          <Link
            href="/dashboard/orders"
            className="text-sm font-medium text-[#C08A3E] hover:underline"
          >
            View all
          </Link>
        </div>

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
                  key={order.id}
                  className="transition-colors hover:bg-[#FAF9F6]"
                >
                  <td className="p-4 font-medium text-[#0E1B1B]">
                    {order.id}
                  </td>

                  <td className="p-4 text-[#6B7268]">
                    {order.date}
                  </td>

                  <td className="p-4 font-semibold text-[#0E1B1B]">
                    {order.total}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}