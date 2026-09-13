'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  getAdminOrders,
  updateOrderStatus,
  assignOrderTracking,
} from '@/services/adminService';
import { AdminOrder, AdminOrderStatus } from '@/types/admin';

const COURIER_PROVIDERS = [
  'Pathao Courier',
  'Steadfast Courier',
  'RedX Logistics',
  'Paperfly Delivery',
  'eCourier Express',
  'SA Paribahan',
];

function generateTrackingId(): string {
  return `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`;
}

function getDefaultDeliveryDate(): string {
  return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(() => getAdminOrders());
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Tracking Assignment Modal
  const [trackingModalOrder, setTrackingModalOrder] = useState<AdminOrder | null>(null);
  const [selectedCourier, setSelectedCourier] = useState(COURIER_PROVIDERS[0]);
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [estimatedDeliveryInput, setEstimatedDeliveryInput] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const handleUpdate = () => setOrders(getAdminOrders());
    window.addEventListener('venraz_admin_data_updated', handleUpdate);
    return () => window.removeEventListener('venraz_admin_data_updated', handleUpdate);
  }, []);

  // Quick Status Transition
  const handleQuickStatusChange = (orderId: string, status: AdminOrderStatus) => {
    updateOrderStatus(orderId, status);
    showToast(`Order ${orderId} updated to ${status}.`);
  };

  const handleOpenTrackingModal = (order: AdminOrder) => {
    setTrackingModalOrder(order);
    setSelectedCourier(order.courier || COURIER_PROVIDERS[0]);
    setTrackingIdInput(order.trackingId || generateTrackingId());
    setEstimatedDeliveryInput(order.estimatedDelivery || getDefaultDeliveryDate());
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    if (!trackingIdInput.trim()) {
      showToast('Please enter a valid tracking number.', 'error');
      return;
    }

    assignOrderTracking(
      trackingModalOrder.id,
      selectedCourier,
      trackingIdInput.trim(),
      estimatedDeliveryInput
    );

    showToast(
      `Assigned ${selectedCourier} tracking ID ${trackingIdInput.trim()} to order ${trackingModalOrder.orderNumber}!`
    );
    setTrackingModalOrder(null);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'Processing' && order.orderStatus === 'Processing') ||
      (activeTab === 'Shipped' && order.orderStatus === 'Shipped') ||
      (activeTab === 'Delivered' && order.orderStatus === 'Delivered') ||
      (activeTab === 'Cancelled' && order.orderStatus === 'Cancelled');

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.trackingId && order.trackingId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const processingCount = orders.filter((o) => o.orderStatus === 'Processing').length;
  const shippedCount = orders.filter((o) => o.orderStatus === 'Shipped').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
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
            <ShoppingCart className="h-5 w-5 text-purple-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Global Order Logistics & Fulfillment
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Monitor central platform orders across all vendor storefronts, update delivery stages, and attach third-party courier tracking.
          </p>
        </div>

        {processingCount > 0 && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-400 self-start">
            <Clock className="h-4 w-4" />
            <span>{processingCount} Orders Awaiting Dispatch</span>
          </span>
        )}
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Orders', count: orders.length },
            { id: 'Processing', label: 'Processing', count: processingCount, highlight: true },
            { id: 'Shipped', label: 'In Transit (Shipped)', count: shippedCount },
            { id: 'Delivered', label: 'Delivered', count: deliveredCount },
            { id: 'Cancelled', label: 'Cancelled', count: orders.filter((o) => o.orderStatus === 'Cancelled').length },
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

        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search order #, customer, phone, tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Global Orders Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order & Date</th>
                <th className="py-3.5 px-4">Customer Info</th>
                <th className="py-3.5 px-4">Vendor Store</th>
                <th className="py-3.5 px-4">Amount & Payment</th>
                <th className="py-3.5 px-4">Courier & Tracking</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Logistics Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/25 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white text-xs">
                        {order.orderNumber}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                        <Calendar className="h-3 w-3 text-zinc-500" />
                        <span>{order.orderDate}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-zinc-200">{order.customerName}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                        <Phone className="h-3 w-3 text-zinc-500" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[180px] mt-0.5">
                        {order.shippingAddress}
                      </p>
                    </td>

                    {/* Vendor */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-zinc-300 block">{order.shopName}</span>
                      <span className="text-[11px] text-zinc-500">{order.itemsCount} Items</span>
                    </td>

                    {/* Amount & Payment */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">Óº│{order.totalAmount.toLocaleString()}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] text-zinc-400">{order.paymentMethod}</span>
                      </div>
                    </td>

                    {/* Courier & Tracking */}
                    <td className="py-3.5 px-4">
                      {order.trackingId ? (
                        <div>
                          <div className="flex items-center gap-1 font-semibold text-zinc-200 text-[11px]">
                            <Truck className="h-3 w-3 text-emerald-400" />
                            <span>{order.courier}</span>
                          </div>
                          <p className="font-mono text-[10px] text-emerald-400 mt-0.5 font-bold">
                            {order.trackingId}
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenTrackingModal(order)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <Truck className="h-3 w-3" />
                          <span>+ Assign Courier</span>
                        </button>
                      )}
                    </td>

                    {/* Status Select */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleQuickStatusChange(order.id, e.target.value as AdminOrderStatus)
                        }
                        className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none transition-all ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : order.orderStatus === 'Processing'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <option value="Processing" className="bg-zinc-900 text-amber-400">
                          Processing
                        </option>
                        <option value="Shipped" className="bg-zinc-900 text-blue-400">
                          Shipped
                        </option>
                        <option value="Delivered" className="bg-zinc-900 text-emerald-400">
                          Delivered
                        </option>
                        <option value="Cancelled" className="bg-zinc-900 text-rose-400">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenTrackingModal(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white text-[11px] font-semibold transition-all"
                      >
                        <Truck className="h-3 w-3 text-blue-400" />
                        <span>{order.trackingId ? 'Edit Courier' : 'Dispatch'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier & Tracking Assignment Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Courier Tracking Assignment</h3>
                <p className="text-xs text-zinc-400">
                  Order: <strong className="text-emerald-400">{trackingModalOrder.orderNumber}</strong> ({trackingModalOrder.customerName})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Courier Partner
                </label>
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  {COURIER_PROVIDERS.map((c) => (
                    <option key={c} value={c} className="bg-zinc-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Tracking Code / Consignment ID <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PTH-8849120, STF-440192"
                  value={trackingIdInput}
                  onChange={(e) => setTrackingIdInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-xs font-mono text-emerald-400 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={estimatedDeliveryInput}
                  onChange={(e) => setEstimatedDeliveryInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-300">Auto-Transition: </span>
                Assigning tracking will automatically transition order status from <strong>Processing</strong> to <strong>Shipped</strong>.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Save & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
