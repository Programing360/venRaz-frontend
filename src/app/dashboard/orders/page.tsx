import Link from "next/link";
import {
  Eye,
  Package,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";

const mockOrders = [
  {
    id: "ORD-94821",
    date: "2026-08-28",
    total: "$129.00",
    status: "Delivered",
    items: 3,
  },
  {
    id: "ORD-94822",
    date: "2026-09-01",
    total: "$45.50",
    status: "Pending",
    items: 1,
  },
];

export default function MyOrdersPage() {
  const delivered = mockOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const pending = mockOrders.filter(
    (order) => order.status === "Pending"
  ).length;

  return (
    <div className="min-h-screen space-y-7 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            <ShoppingBag className="h-3.5 w-3.5" />
            Purchase History
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            My Orders<span className="text-primary">.</span>
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage all your purchases.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Package className="h-4 w-4 text-primary" />
          {mockOrders.length} total orders
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total */}
        <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Total Orders
              </p>
              <p className="mt-2 text-3xl font-black">{mockOrders.length}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5">
          <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Delivered
              </p>
              <p className="mt-2 text-3xl font-black">{delivered}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
          <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-amber-500/10 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Pending
              </p>
              <p className="mt-2 text-3xl font-black">{pending}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b p-5 sm:p-6">
          <div>
            <h2 className="font-bold">Recent Orders</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your latest purchases
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {mockOrders.map((order) => {
                const delivered = order.status === "Delivered";

                return (
                  <tr
                    key={order.id}
                    className="group transition-all duration-200 hover:bg-muted/20"
                  >
                    {/* Order */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                          <Package className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="font-mono text-sm font-bold">
                            {order.id}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Purchase
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5 text-muted-foreground">
                      {order.date}
                    </td>

                    {/* Items */}
                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold">
                        {order.items}{" "}
                        {order.items === 1 ? "Item" : "Items"}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-5 font-black">
                      {order.total}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                          delivered
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            delivered
                              ? "bg-emerald-500"
                              : "bg-amber-500 animate-pulse"
                          }`}
                        />
                        {order.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="group/link inline-flex items-center gap-2 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                        <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y md:hidden">
          {mockOrders.map((order) => {
            const delivered = order.status === "Delivered";

            return (
              <div
                key={order.id}
                className="p-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Package className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm font-black">
                          {order.id}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {order.date}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          delivered
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Total
                        </p>
                        <p className="font-black">{order.total}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Items
                        </p>
                        <p className="font-bold">{order.items}</p>
                      </div>

                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t bg-muted/20 px-5 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-foreground">
              {mockOrders.length}
            </span>{" "}
            recent orders
          </p>
        </div>
      </div>
    </div>
  );
}
