'use client';

import React from 'react';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronRight,
  Download,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  description: string;
}

function StatCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/50 dark:text-emerald-400">
          <Icon className="h-6 w-6" />
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {change}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <h3 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </h3>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

const recentOrders = [
  {
    id: '#VR-10284',
    customer: 'Alex Morgan',
    email: 'alex.m@example.com',
    product: 'Premium Hoodie',
    amount: '$89.00',
    status: 'Completed',
  },
  {
    id: '#VR-10283',
    customer: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    product: 'Leather Backpack',
    amount: '$124.00',
    status: 'Processing',
  },
  {
    id: '#VR-10282',
    customer: 'Daniel Smith',
    email: 'd.smith@example.com',
    product: 'Smart Watch',
    amount: '$249.00',
    status: 'Completed',
  },
  {
    id: '#VR-10281',
    customer: 'Emma Brown',
    email: 'emma.b@example.com',
    product: 'Running Shoes',
    amount: '$96.00',
    status: 'Pending',
  },
];

const chartData = [
  { month: 'Jan', height: 35, val: '$35k' },
  { month: 'Feb', height: 48, val: '$48k' },
  { month: 'Mar', height: 42, val: '$42k' },
  { month: 'Apr', height: 65, val: '$65k' },
  { month: 'May', height: 52, val: '$52k' },
  { month: 'Jun', height: 72, val: '$72k' },
  { month: 'Jul', height: 58, val: '$58k' },
  { month: 'Aug', height: 80, val: '$80k' },
  { month: 'Sep', height: 68, val: '$68k' },
  { month: 'Oct', height: 91, val: '$91k' },
  { month: 'Nov', height: 76, val: '$76k' },
  { month: 'Dec', height: 96, val: '$96k' },
];

export default function DashboardOverview() {
  const stats: StatCardProps[] = [
    {
      title: 'Total Revenue',
      value: '$124,592',
      change: '+14.2%',
      isPositive: true,
      icon: DollarSign,
      description: 'vs. last month',
    },
    {
      title: 'Active Products',
      value: '1,420',
      change: '+5.4%',
      isPositive: true,
      icon: Package,
      description: 'products listed',
    },
    {
      title: 'Total Orders',
      value: '3,842',
      change: '+8.1%',
      isPositive: true,
      icon: ShoppingCart,
      description: 'orders this month',
    },
    {
      title: 'Registered Sellers',
      value: '284',
      change: '-1.2%',
      isPositive: false,
      icon: Users,
      description: 'active sellers',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Live Overview
              </p>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Store Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Monitor your marketplace performance and active metrics in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <Calendar className="h-4 w-4 text-slate-400" />
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Revenue Chart */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Revenue Overview
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Monthly performance summary
                </p>
              </div>
              <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                $124,592
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" />
                14.2%
              </span>
            </div>

            {/* Interactive Column Visuals */}
            <div className="mt-8 flex h-56 items-end gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              {chartData.map((item, index) => (
                <div key={index} className="group relative flex h-full flex-1 flex-col justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
                    <span className="rounded bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-md dark:bg-slate-100 dark:text-slate-900">
                      {item.val}
                    </span>
                  </div>
                  <div
                    style={{ height: `${item.height}%` }}
                    className="w-full rounded-t-md bg-emerald-100 transition-all duration-300 group-hover:bg-emerald-500 dark:bg-emerald-950/40 dark:group-hover:bg-emerald-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-[11px] font-semibold text-slate-400">
              {chartData.map((item) => (
                <span key={item.month}>{item.month}</span>
              ))}
            </div>
          </div>

          {/* Platform Health Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Platform Health
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                System and operation status
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-emerald-50/60 p-3.5 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Store Status
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-amber-50/60 p-3.5 dark:bg-amber-950/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">
                      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Pending Sellers
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                    4 Action Req.
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-rose-50/60 p-3.5 dark:bg-rose-950/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">
                      <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Flagged Products
                    </span>
                  </div>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                    7 Flagged
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">System Uptime</span>
                <span className="text-slate-900 dark:text-white">99.98%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-[99.98%] rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest transactions completed on your platform
              </p>
            </div>
            <button className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400">
              View all orders <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-900/50">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {order.customer}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {order.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {order.product}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          order.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : order.status === 'Processing'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
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

        {/* Quick Actions */}
        <div>
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Execute critical management workflows
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/50 dark:text-emerald-400">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Export Report
                </p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Download monthly sales metrics CSV
                </p>
              </div>
            </button>

            <button className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-500/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white dark:bg-amber-950/50 dark:text-amber-400">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Approve Sellers
                </p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  4 new seller applications pending
                </p>
              </div>
            </button>

            <button className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-500/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white dark:bg-rose-950/50 dark:text-rose-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Review Products
                </p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  7 items flagged for policy check
                </p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}