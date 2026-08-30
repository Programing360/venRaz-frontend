"use client";

import Link from "next/link";
import { ShoppingBag, Clock, CheckCircle2, Heart } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();

  const stats = [
    { title: "Total Orders", value: "12", icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { title: "Pending Delivery", value: "2", icon: Clock, color: "bg-amber-50 text-amber-600" },
    { title: "Completed Orders", value: "10", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    { title: "Saved Wishlist", value: "5", icon: Heart, color: "bg-rose-50 text-rose-600" },
  ];

  const recentOrders = [
    { id: "ORD-9482", date: "Aug 28, 2026", total: "$129.00", status: "Delivered" },
    { id: "ORD-8391", date: "Aug 24, 2026", total: "$84.50", status: "Processing" },
    { id: "ORD-7210", date: "Aug 15, 2026", total: "$210.00", status: "Delivered" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#18bbbb]">
          Welcome back, {session?.user?.name || "Customer"} 👋
        </h2>
        <p className="text-sm text-white mt-1">
          Here is an overview of your recent account activity and orders.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-5 bg-white border border-[#DEDACE] rounded-xl shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-[#6B7268]">{stat.title}</p>
                <p className="text-2xl font-bold text-[#0E1B1B] mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[#DEDACE] rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#DEDACE] flex justify-between items-center">
          <h3 className="font-semibold text-[#0E1B1B]">Recent Purchases</h3>
          <Link href="/dashboard/orders" className="text-sm font-medium text-[#C08A3E] hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
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
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-[#0E1B1B]">{order.id}</td>
                  <td className="p-4 text-[#6B7268]">{order.date}</td>
                  <td className="p-4 font-semibold text-[#0E1B1B]">{order.total}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
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