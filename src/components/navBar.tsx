import React from 'react';
import { ShopStatus } from '../types';
import { ShopStatusBadge } from './ShopStatusBadge';
import { 
  Store, 
  User, 
  Cloud, 
  PlusCircle, 
  LayoutDashboard, 
  ShieldCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  currentView: 'user-dashboard' | 'create-shop' | 'seller-dashboard';
  onNavigate: (view: 'user-dashboard' | 'create-shop' | 'seller-dashboard') => void;
  onOpenCloudinarySettings: () => void;
  shopStatus?: ShopStatus;
  shopName?: string;
  hasShop: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCloudinarySettings,
  shopStatus,
  shopName,
  hasShop,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => onNavigate('user-dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Store size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 tracking-tight">
                  Shop & Seller Platform
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Member 2
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Day 1 & Day 2 Completed • Multi-Vendor System
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            <button
              id="nav-user-dashboard-btn"
              onClick={() => onNavigate('user-dashboard')}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                currentView === 'user-dashboard'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User size={14} />
              <span>User Dashboard (My Shop)</span>
            </button>

            <button
              id="nav-create-shop-btn"
              onClick={() => onNavigate('create-shop')}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                currentView === 'create-shop'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlusCircle size={14} />
              <span>Create Shop</span>
            </button>

            {hasShop && (
              <button
                id="nav-seller-dashboard-btn"
                onClick={() => onNavigate('seller-dashboard')}
                className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  currentView === 'seller-dashboard'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard size={14} />
                <span>Seller Dashboard</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right: Cloudinary Settings & Current Shop status */}
        <div className="flex items-center gap-3">
          {shopStatus && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Shop Status:</span>
              <ShopStatusBadge status={shopStatus} size="sm" />
            </div>
          )}

          {/* Cloudinary config button */}
          <button
            type="button"
            id="navbar-cloudinary-settings-btn"
            onClick={onOpenCloudinarySettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/80 transition-colors shadow-2xs"
            title="Configure Cloudinary Image Upload Credentials"
          >
            <Cloud size={15} className="text-sky-600" />
            <span className="hidden sm:inline">Cloudinary</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 text-[11px] font-semibold bg-slate-50/70">
        <button
          onClick={() => onNavigate('user-dashboard')}
          className={`flex-1 py-1 text-center rounded-lg ${
            currentView === 'user-dashboard' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
          }`}
        >
          My Shop
        </button>
        <button
          onClick={() => onNavigate('create-shop')}
          className={`flex-1 py-1 text-center rounded-lg ${
            currentView === 'create-shop' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
          }`}
        >
          Create Shop
        </button>
        {hasShop && (
          <button
            onClick={() => onNavigate('seller-dashboard')}
            className={`flex-1 py-1 text-center rounded-lg ${
              currentView === 'seller-dashboard' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
        )}
      </div>
    </header>
  );
};
