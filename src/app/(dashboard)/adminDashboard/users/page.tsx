'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserX,
  UserCheck,
  CheckCircle2,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import {
  getAdminUsers,
  switchUserRole,
  toggleUserStatus,
} from '@/services/adminService';
import { AdminUser, UserRole } from '@/types/admin';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(() => getAdminUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Confirmation modal state for Block/Unblock
  const [selectedUserForAction, setSelectedUserForAction] = useState<{
    user: AdminUser;
    type: 'ROLE' | 'STATUS';
    targetRole?: UserRole;
  } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = () => {
    setUsers(getAdminUsers());
  };

  useEffect(() => {
    window.addEventListener('venraz_admin_data_updated', handleRefresh);
    return () => window.removeEventListener('venraz_admin_data_updated', handleRefresh);
  }, []);

  const handleRoleToggle = (user: AdminUser) => {
    if (user.role === 'ADMIN') {
      showToast('Master Admin role cannot be modified.', 'error');
      return;
    }

    const targetRole: UserRole = user.role === 'MODERATOR' ? 'USER' : 'MODERATOR';
    setSelectedUserForAction({
      user,
      type: 'ROLE',
      targetRole,
    });
  };

  const handleStatusToggle = (user: AdminUser) => {
    if (user.role === 'ADMIN') {
      showToast('Master Admin cannot be blocked.', 'error');
      return;
    }

    setSelectedUserForAction({
      user,
      type: 'STATUS',
    });
  };

  const confirmAction = () => {
    if (!selectedUserForAction) return;
    const { user, type, targetRole } = selectedUserForAction;

    if (type === 'ROLE' && targetRole) {
      switchUserRole(user.id, targetRole);
      showToast(`Updated role for ${user.name} to ${targetRole}.`);
    } else if (type === 'STATUS') {
      const updatedList = toggleUserStatus(user.id);
      const updatedUser = updatedList.find((u) => u.id === user.id);
      const isBlocked = updatedUser?.status === 'BLOCKED';
      showToast(
        isBlocked
          ? `User ${user.name} has been BLOCKED.`
          : `User ${user.name} has been UNBLOCKED & Activated.`
      );
    }
    setSelectedUserForAction(null);
  };

  // Filtered Users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;
  const blockedCount = users.filter((u) => u.status === 'BLOCKED').length;
  const moderatorCount = users.filter((u) => u.role === 'MODERATOR').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-2xl shadow-red-500/10 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-red-600" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              User & Staff Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Control platform permissions, switch User ↔ Moderator roles, and enforce account suspensions.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-slate-500">Total Accounts</p>
          <p className="text-xl font-black text-slate-900 mt-1">{users.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-red-600">Active Users</p>
          <p className="text-xl font-black text-red-600 mt-1">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-rose-600">Platform Moderators</p>
          <p className="text-xl font-black text-rose-600 mt-1">{moderatorCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-amber-600">Suspended / Blocked</p>
          <p className="text-xl font-black text-amber-600 mt-1">{blockedCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-500">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Users</option>
              <option value="MODERATOR">Moderators</option>
              <option value="SELLER">Sellers</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className="text-[11px] text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {user.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : user.role === 'MODERATOR'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : user.role === 'SELLER'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {user.role === 'ADMIN' && <ShieldCheck className="h-3 w-3 text-red-600" />}
                        {user.role === 'MODERATOR' && <Shield className="h-3 w-3 text-rose-600" />}
                        <span>{user.role}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>{user.joinedDate}</span>
                      </div>
                    </td>

                    {/* Activity */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {user.ordersCount} Orders
                      {user.shopsCount !== undefined && ` • ${user.shopsCount} Shop`}
                    </td>

                    {/* Action Controls */}
                    <td className="py-3.5 px-4 text-right">
                      {user.role === 'ADMIN' ? (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Protected Account
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {/* Role Switch Button (User <-> Moderator) */}
                          <button
                            onClick={() => handleRoleToggle(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-700 text-[11px] font-semibold transition-all shadow-sm"
                            title={
                              user.role === 'MODERATOR'
                                ? 'Demote to regular User'
                                : 'Promote to Moderator'
                            }
                          >
                            <ArrowUpDown className="h-3 w-3 text-red-500" />
                            <span>
                              {user.role === 'MODERATOR' ? 'Make User' : 'Make Mod'}
                            </span>
                          </button>

                          {/* Block / Unblock Toggle Button */}
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                              user.status === 'ACTIVE'
                                ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? (
                              <>
                                <UserX className="h-3 w-3 text-red-600" />
                                <span>Block</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3 w-3 text-slate-600" />
                                <span>Unblock</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedUserForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  selectedUserForAction.type === 'STATUS'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {selectedUserForAction.type === 'STATUS' ? (
                  <ShieldAlert className="h-6 w-6" />
                ) : (
                  <Shield className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedUserForAction.type === 'ROLE'
                    ? 'Confirm Role Switch'
                    : selectedUserForAction.user.status === 'ACTIVE'
                    ? 'Confirm Account Block'
                    : 'Confirm Account Unblock'}
                </h3>
                <p className="text-xs text-slate-500">
                  Target Account: {selectedUserForAction.user.name} ({selectedUserForAction.user.email})
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              {selectedUserForAction.type === 'ROLE' ? (
                <>
                  Are you sure you want to change this account&apos;s role from{' '}
                  <strong className="text-slate-900">{selectedUserForAction.user.role}</strong> to{' '}
                  <strong className="text-red-600">{selectedUserForAction.targetRole}</strong>? Moderators have permission to review listings and handle dispute requests.
                </>
              ) : selectedUserForAction.user.status === 'ACTIVE' ? (
                <>
                  Blocking this account will immediately revoke login sessions and restrict them from placing orders or managing stores until manually unblocked.
                </>
              ) : (
                <>
                  Unblocking this user will restore their active member status and allow them to resume platform interactions.
                </>
              )}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedUserForAction(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20 transition-all"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
