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
    const nextRole: UserRole = user.role === 'MODERATOR' ? 'USER' : 'MODERATOR';
    setSelectedUserForAction({
      user,
      type: 'ROLE',
      targetRole: nextRole,
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-emerald-500/20 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              User & Staff Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Control platform permissions, switch User Ôåö Moderator roles, and enforce account suspensions.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-[11px] font-medium text-zinc-400">Total Accounts</p>
          <p className="text-xl font-black text-white mt-1">{users.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-[11px] font-medium text-emerald-400">Active Users</p>
          <p className="text-xl font-black text-emerald-400 mt-1">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-[11px] font-medium text-blue-400">Platform Moderators</p>
          <p className="text-xl font-black text-blue-400 mt-1">{moderatorCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-[11px] font-medium text-rose-400">Suspended / Blocked</p>
          <p className="text-xl font-black text-rose-400 mt-1">{blockedCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-1.5">
            <Filter className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-[11px] text-zinc-400">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none"
            >
              <option value="ALL" className="bg-zinc-900">All Roles</option>
              <option value="USER" className="bg-zinc-900">Users</option>
              <option value="MODERATOR" className="bg-zinc-900">Moderators</option>
              <option value="SELLER" className="bg-zinc-900">Sellers</option>
              <option value="ADMIN" className="bg-zinc-900">Admins</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-1.5">
            <span className="text-[11px] text-zinc-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none"
            >
              <option value="ALL" className="bg-zinc-900">All Status</option>
              <option value="ACTIVE" className="bg-zinc-900">Active</option>
              <option value="BLOCKED" className="bg-zinc-900">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/25 transition-colors">
                    {/* Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover border border-zinc-800"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white">{user.name}</p>
                          <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
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
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : user.role === 'MODERATOR'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : user.role === 'SELLER'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {user.role === 'ADMIN' && <ShieldCheck className="h-3 w-3" />}
                        {user.role === 'MODERATOR' && <Shield className="h-3 w-3" />}
                        <span>{user.role}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-zinc-500" />
                        <span>{user.joinedDate}</span>
                      </div>
                    </td>

                    {/* Activity */}
                    <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                      {user.ordersCount} Orders
                      {user.shopsCount !== undefined && ` ÔÇó ${user.shopsCount} Shop`}
                    </td>

                    {/* Action Controls */}
                    <td className="py-3.5 px-4 text-right">
                      {user.role === 'ADMIN' ? (
                        <span className="text-[11px] text-zinc-500 font-medium">
                          Protected Account
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {/* Role Switch Button (User <-> Moderator) */}
                          <button
                            onClick={() => handleRoleToggle(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold transition-all"
                            title={
                              user.role === 'MODERATOR'
                                ? 'Demote to regular User'
                                : 'Promote to Moderator'
                            }
                          >
                            <ArrowUpDown className="h-3 w-3 text-blue-400" />
                            <span>
                              {user.role === 'MODERATOR' ? 'Make User' : 'Make Mod'}
                            </span>
                          </button>

                          {/* Block / Unblock Toggle Button */}
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                              user.status === 'ACTIVE'
                                ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? (
                              <>
                                <UserX className="h-3 w-3" />
                                <span>Block</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3 w-3" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  selectedUserForAction.type === 'STATUS'
                    ? 'bg-rose-500/15 text-rose-400'
                    : 'bg-blue-500/15 text-blue-400'
                }`}
              >
                {selectedUserForAction.type === 'STATUS' ? (
                  <ShieldAlert className="h-6 w-6" />
                ) : (
                  <Shield className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedUserForAction.type === 'ROLE'
                    ? 'Confirm Role Switch'
                    : selectedUserForAction.user.status === 'ACTIVE'
                    ? 'Confirm Account Block'
                    : 'Confirm Account Unblock'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Target Account: {selectedUserForAction.user.name} ({selectedUserForAction.user.email})
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-zinc-300">
              {selectedUserForAction.type === 'ROLE' ? (
                <>
                  Are you sure you want to change this account&apos;s role from{' '}
                  <strong className="text-white">{selectedUserForAction.user.role}</strong> to{' '}
                  <strong className="text-blue-400">{selectedUserForAction.targetRole}</strong>? Moderators have permission to review listings and handle dispute requests.
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
                className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all ${
                  selectedUserForAction.type === 'STATUS' && selectedUserForAction.user.status === 'ACTIVE'
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                }`}
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
