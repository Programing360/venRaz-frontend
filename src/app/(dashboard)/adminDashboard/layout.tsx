import React from 'react';
import AdminNavbar from './_components/AdminNavbar';
import AdminSidebar from './_components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminNavbar />
        <main className="flex-1 bg-slate-50/50 p-6">{children}</main>
      </div>
    </div>
  );
}