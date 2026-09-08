import React from 'react';
import AdminNavbar from './adminNavbar';
import AdminSidebar from './adminSidebar';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminNavbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}