"use client";

import {
  Package,
  Clock3,
  CheckCircle2,
  Truck,
  Eye,
} from "lucide-react";
import Link from "next/link";

const orders = [
  {
    id: "ORD-9482",
    date: "Aug 28, 2026",
    items: 3,
    total: "$129.00",
    status: "Delivered",
  },
  {
    id: "ORD-8391",
    date: "Aug 24, 2026",
    items: 2,
    total: "$84.50",
    status: "Processing",
  },
  {
    id: "ORD-7210",
    date: "Aug 15, 2026",
    items: 5,
    total: "$210.00",
    status: "Delivered",
  },
  {
    id: "ORD-6842",
    date: "Aug 08, 2026",
    items: 1,
    total: "$45.00",
    status: "Shipped",
  },
  {
    id: "ORD-5921",
    date: "Jul 29, 2026",
    items: 4,
    total: "$156.75",
    status: "Cancelled",
  },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const statusIcons: Record<string, React.ElementType> = {
  Delivered: CheckCircle2,
  Processing: Clock3,
  Shipped: Truck,
  Cancelled: Package,
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0E1B1B]">
          My Orders
        </h1>

        <p className="mt-1 text-sm text-[#6B7268]">
          View and track all your recent orders.
        </p>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Total Orders"
          value="12"
          icon={Package}
          color="text-blue-600 bg-blue-50"
        />

        <SummaryCard
          title="Processing"
          value="2"
          icon={Clock3}
          color="text-amber-600 bg-amber-50"
        />

        <SummaryCard
          title="Shipped"
          value="1"
          icon={Truck}
          color="text-indigo-600 bg-indigo-50"
        />

        <SummaryCard
          title="Delivered"
          value="9"
          icon={CheckCircle2}
          color="text-emerald-600 bg-emerald-50"
        />
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-xl border border-[#DEDACE] bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-[#DEDACE] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#0E1B1B]">
              Order History
            </h2>

            <p className="mt-1 text-xs text-[#6B7268]">
              Your latest purchases and order status.
            </p>
          </div>

          <select
            className="rounded-lg border border-[#DEDACE] bg-white px-3 py-2 text-sm text-[#6B7268] outline-none focus:border-[#C08A3E] focus:ring-2 focus:ring-[#C08A3E]/10"
            defaultValue="all"
          >
            <option value="all">All orders</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#DEDACE] bg-[#F4F2EC] text-[#6B7268]">
                <th className="px-5 py-4 font-medium">
                  Order
                </th>

                <th className="px-5 py-4 font-medium">
                  Date
                </th>

                <th className="px-5 py-4 font-medium">
                  Items
                </th>

                <th className="px-5 py-4 font-medium">
                  Total
                </th>

                <th className="px-5 py-4 font-medium">
                  Status
                </th>

                <th className="px-5 py-4 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#DEDACE]">
              {orders.map((order) => {
                const StatusIcon =
                  statusIcons[order.status] || Package;

                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-[#FAF9F6]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0E1B1B]">
                        {order.id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-[#6B7268]">
                      {order.date}
                    </td>

                    <td className="px-5 py-4 text-[#6B7268]">
                      {order.items}{" "}
                      {order.items === 1 ? "item" : "items"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#0E1B1B]">
                      {order.total}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                          statusStyles[order.status]
                        }`}
                      >
                        <StatusIcon size={13} />
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#C08A3E] transition-colors hover:bg-[#F4F2EC]"
                      >
                        <Eye size={15} />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-[#DEDACE] md:hidden">
          {orders.map((order) => {
            const StatusIcon =
              statusIcons[order.status] || Package;

            return (
              <div
                key={order.id}
                className="p-4 transition-colors hover:bg-[#FAF9F6]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#0E1B1B]">
                      {order.id}
                    </p>

                    <p className="mt-1 text-xs text-[#6B7268]">
                      {order.date}
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium ${
                      statusStyles[order.status]
                    }`}
                  >
                    <StatusIcon size={12} />
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#6B7268]">
                      {order.items}{" "}
                      {order.items === 1 ? "item" : "items"}
                    </p>

                    <p className="mt-0.5 font-semibold text-[#0E1B1B]">
                      {order.total}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E1B1B] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1C2929]"
                  >
                    <Eye size={14} />
                    View Order
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back to Dashboard */}
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm font-medium text-[#6B7268] transition-colors hover:text-[#C08A3E]"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#DEDACE] bg-white p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-xs font-medium text-[#6B7268]">
          {title}
        </p>

        <p className="mt-1 text-xl font-bold text-[#0E1B1B] sm:text-2xl">
          {value}
        </p>
      </div>

      <div className={`rounded-lg p-2.5 sm:p-3 ${color}`}>
        <Icon size={19} />
      </div>
    </div>
  );
}