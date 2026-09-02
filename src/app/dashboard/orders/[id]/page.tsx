import {
  Truck,
  CreditCard,
  Calendar,
  ArrowLeft,
  Package,
  CheckCircle2,
  MapPin,
  Copy,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = {
    id: params.id || "ORD-94821",
    date: "2026-08-28",
    paymentStatus: "Paid",
    paymentMethod: "SSLCommerz / Stripe",
    orderStatus: "In Transit",
    trackingId: "TRK-88291039",
    items: [
      {
        id: 1,
        name: "Minimalist Wireless Headphone",
        quantity: 1,
        price: 89.0,
      },
      {
        id: 2,
        name: "Mechanical Gaming Keyboard",
        quantity: 1,
        price: 40.0,
      },
    ],
    total: 129.0,
  };

  return (
    <div className="min-h-screen space-y-7 bg-background">
      {/* Back */}
      <Link
        href="/dashboard/orders"
        className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-card transition-all group-hover:-translate-x-1 group-hover:border-primary/40 group-hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </span>
        Back to Orders
      </Link>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" />
              Order Tracking
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Order Details<span className="text-primary">.</span>
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Order ID{" "}
              <span className="font-mono font-bold text-foreground">
                #{order.id}
              </span>
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-500 shadow-sm shadow-blue-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
            </span>
            {order.orderStatus}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold">Delivery Status</h2>
            <p className="text-xs text-muted-foreground">
              Your package is on the way
            </p>
          </div>

          <Package className="h-5 w-5 text-primary" />
        </div>

        <div className="relative grid grid-cols-3 gap-2">
          <div className="absolute left-[16%] right-[16%] top-5 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-muted" />

          {[
            {
              label: "Ordered",
              icon: CheckCircle2,
              active: true,
            },
            {
              label: "In Transit",
              icon: Truck,
              active: true,
            },
            {
              label: "Delivered",
              icon: MapPin,
              active: false,
            },
          ].map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-card shadow-sm ${
                    step.active
                      ? "bg-primary text-primary-foreground shadow-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span
                  className={`text-[11px] font-bold ${
                    step.active
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
            <Calendar className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order Date
          </p>

          <p className="mt-1 font-bold">{order.date}</p>
        </div>

        <div className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CreditCard className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="font-bold">{order.paymentStatus}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {order.paymentMethod}
          </p>
        </div>

        <div className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Truck className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tracking ID
          </p>

          <div className="mt-1 flex items-center gap-2">
            <p className="font-mono text-sm font-bold">{order.trackingId}</p>

            <button
              aria-label="Copy tracking ID"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-1 text-xs text-blue-500">
            Track your package →
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-bold">Products</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {order.items.length} items in this order
            </p>
          </div>

          <Package className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Quantity</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4 text-right">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {order.items.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-muted/20"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                        <Package className="h-5 w-5" />
                      </div>

                      <span className="font-bold">{item.name}</span>
                    </div>
                  </td>

                  <td className="px-5 py-5 font-medium text-muted-foreground">
                    ×{item.quantity}
                  </td>

                  <td className="px-5 py-5 font-medium">
                    ${item.price.toFixed(2)}
                  </td>

                  <td className="px-5 py-5 text-right font-bold">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y md:hidden">
          {order.items.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-tight">{item.name}</p>

                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Qty: ×{item.quantity}
                    </span>

                    <span className="font-bold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="relative overflow-hidden border-t bg-gradient-to-r from-primary/[0.06] via-background to-blue-500/[0.06] p-5 sm:p-6">
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Total Paid
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Including all applicable charges
              </p>
            </div>

            <span className="text-2xl font-black tracking-tight text-primary sm:text-3xl">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
