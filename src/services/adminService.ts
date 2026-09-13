'use client';

import {
  AdminUser,
  AdminShop,
  AdminProduct,
  AdminOrder,
  UserRole,
  AdminOrderStatus,
} from '@/types/admin';

const STORAGE_KEY = 'venraz_admin_dashboard_data_v1';

// Seed Initial Users
const SEED_USERS: AdminUser[] = [
  {
    id: 'USR-101',
    name: 'Rahim Chowdhury',
    email: 'rahim.c@example.com',
    phone: '+880 1711-234567',
    role: 'USER',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-01-15',
    ordersCount: 8,
  },
  {
    id: 'USR-102',
    name: 'Tasmia Sultana',
    email: 'tasmia.s@example.com',
    phone: '+880 1819-876543',
    role: 'MODERATOR',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-02-01',
    ordersCount: 14,
  },
  {
    id: 'USR-103',
    name: 'Sabbir Ahmed',
    email: 'sabbir.ahmed@example.com',
    phone: '+880 1912-345678',
    role: 'SELLER',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-02-18',
    ordersCount: 4,
    shopsCount: 1,
  },
  {
    id: 'USR-104',
    name: 'Farzana Haque',
    email: 'farzana.h@example.com',
    phone: '+880 1610-987654',
    role: 'USER',
    status: 'BLOCKED',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-03-05',
    ordersCount: 1,
  },
  {
    id: 'USR-105',
    name: 'Tanvir Hossain',
    email: 'tanvir.h@example.com',
    phone: '+880 1722-456789',
    role: 'MODERATOR',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-01-20',
    ordersCount: 22,
  },
  {
    id: 'USR-106',
    name: 'Nusrat Jahan',
    email: 'nusrat.j@example.com',
    phone: '+880 1515-678901',
    role: 'USER',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-04-12',
    ordersCount: 5,
  },
  {
    id: 'USR-107',
    name: 'Kamrul Hasan',
    email: 'kamrul.h@example.com',
    phone: '+880 1823-789012',
    role: 'SELLER',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-03-22',
    ordersCount: 0,
    shopsCount: 1,
  },
  {
    id: 'USR-108',
    name: 'Admin Supervisor',
    email: 'admin@venraz.com',
    phone: '+880 1999-000111',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-12-01',
    ordersCount: 45,
  },
];

// Seed Initial Shops
const SEED_SHOPS: AdminShop[] = [
  {
    id: 'SHP-201',
    name: 'Bengal Loom & Craft',
    sellerName: 'Sabbir Ahmed',
    sellerEmail: 'sabbir.ahmed@example.com',
    phone: '+880 1912-345678',
    category: 'Artisanal & Crafts',
    address: 'Suite 4B, Gulshan Pink City, Dhaka',
    logoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    description: 'Heritage handloom cotton & silk sarees crafted by traditional weavers.',
    status: 'Approved',
    appliedDate: '2026-02-18',
    totalProducts: 18,
    totalSales: 245000,
    rating: 4.8,
  },
  {
    id: 'SHP-202',
    name: 'NextGen Gadgets Hub',
    sellerName: 'Kamrul Hasan',
    sellerEmail: 'kamrul.h@example.com',
    phone: '+880 1823-789012',
    category: 'Electronics & Gadgets',
    address: 'Level 4, Multiplan Center, Elephant Road, Dhaka',
    logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    description: 'Direct importer of certified smart wearables, audio monitors & phone accessories.',
    status: 'Pending',
    statusReason: 'Pending business trade license verification and import permit.',
    appliedDate: '2026-03-22',
    totalProducts: 8,
    totalSales: 0,
    rating: 5.0,
  },
  {
    id: 'SHP-203',
    name: 'Organic Harvest BD',
    sellerName: 'Mahmudur Rahman',
    sellerEmail: 'mahmud.organic@example.com',
    phone: '+880 1712-998877',
    category: 'Groceries & Gourmet',
    address: 'Plot 12, Sector 7, Uttara, Dhaka',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
    description: '100% organic Sundarban wild honey, mustard oil, and naturally grown chia seeds.',
    status: 'Pending',
    statusReason: 'Awaiting BSTI organic food certification documents.',
    appliedDate: '2026-03-24',
    totalProducts: 12,
    totalSales: 0,
    rating: 4.9,
  },
  {
    id: 'SHP-204',
    name: 'Urban Vogue Fashion',
    sellerName: 'Fahim Shahriar',
    sellerEmail: 'fahim.vogue@example.com',
    phone: '+880 1611-332211',
    category: 'Fashion & Apparel',
    address: 'Shop 21, Shimanto Square, Dhanmondi, Dhaka',
    logoUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    description: 'Contemporary streetwear, oversized drops, and minimalist denim collection.',
    status: 'Suspended',
    statusReason: 'Suspended temporarily due to multiple delayed shipments reported by buyers.',
    appliedDate: '2026-01-10',
    totalProducts: 34,
    totalSales: 412000,
    rating: 3.6,
  },
  {
    id: 'SHP-205',
    name: 'Aroma Botanica Beauty',
    sellerName: 'Sabrina Karim',
    sellerEmail: 'sabrina.k@example.com',
    phone: '+880 1918-776655',
    category: 'Health & Beauty',
    address: 'Block C, Bashundhara R/A, Dhaka',
    logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    description: 'Chemical-free botanical skincare, cold-pressed facial serums and hair mists.',
    status: 'Approved',
    appliedDate: '2026-02-05',
    totalProducts: 14,
    totalSales: 165000,
    rating: 4.7,
  },
  {
    id: 'SHP-206',
    name: 'Replica Sneaker Zone',
    sellerName: 'Anik Roy',
    sellerEmail: 'anik.shoes@example.com',
    phone: '+880 1311-224466',
    category: 'Fashion & Apparel',
    address: 'New Market, Dhaka',
    logoUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&auto=format&fit=crop&q=80',
    description: 'Unauthorized copy of brand sneakers.',
    status: 'Rejected',
    statusReason: 'Violates VenRaz Trademark & Counterfeit Policy (Unauthorized replica footwear).',
    appliedDate: '2026-03-01',
    totalProducts: 0,
    totalSales: 0,
    rating: 1.0,
  },
];

// Seed Initial Products
const SEED_PRODUCTS: AdminProduct[] = [
  {
    id: 'PRD-301',
    name: 'Royal Heritage Dhakai Jamdani Saree',
    sellerName: 'Sabbir Ahmed',
    shopName: 'Bengal Loom & Craft',
    category: 'Artisanal & Crafts',
    price: 8500,
    originalPrice: 10500,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80',
    status: 'Approved',
    createdAt: '2026-03-10',
  },
  {
    id: 'PRD-302',
    name: 'Wireless Noise Canceling Earbuds Pro',
    sellerName: 'Kamrul Hasan',
    shopName: 'NextGen Gadgets Hub',
    category: 'Electronics & Gadgets',
    price: 3200,
    originalPrice: 4500,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
    status: 'Pending',
    createdAt: '2026-03-23',
  },
  {
    id: 'PRD-303',
    name: 'Sundarban Raw Organic Wild Honey (500g)',
    sellerName: 'Mahmudur Rahman',
    shopName: 'Organic Harvest BD',
    category: 'Groceries & Gourmet',
    price: 850,
    originalPrice: 1000,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80',
    status: 'Pending',
    createdAt: '2026-03-24',
  },
  {
    id: 'PRD-304',
    name: 'Pure Moroccan Argan Glow Hair Elixir',
    sellerName: 'Sabrina Karim',
    shopName: 'Aroma Botanica Beauty',
    category: 'Health & Beauty',
    price: 1650,
    originalPrice: 1950,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-2169b183616b?w=500&auto=format&fit=crop&q=80',
    status: 'Approved',
    createdAt: '2026-03-15',
  },
  {
    id: 'PRD-305',
    name: 'Pro Heavy Duty Gaming Mechanical Keyboard',
    sellerName: 'Kamrul Hasan',
    shopName: 'NextGen Gadgets Hub',
    category: 'Electronics & Gadgets',
    price: 4800,
    originalPrice: 5600,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=80',
    status: 'Approved',
    createdAt: '2026-03-18',
  },
  {
    id: 'PRD-306',
    name: 'Oversized Japanese Graphic Hoodie',
    sellerName: 'Fahim Shahriar',
    shopName: 'Urban Vogue Fashion',
    category: 'Fashion & Apparel',
    price: 2200,
    originalPrice: 2800,
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80',
    status: 'Hidden',
    createdAt: '2026-02-12',
  },
  {
    id: 'PRD-307',
    name: 'Unregulated Herbal Fat Burner Capsules',
    sellerName: 'Anonymous Seller',
    shopName: 'Quick Diet Care',
    category: 'Health & Beauty',
    price: 3500,
    originalPrice: 4200,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    status: 'Rejected',
    rejectionReason: 'Health hazard warning: Unlicensed medicinal substance without DGDA approval.',
    createdAt: '2026-03-20',
  },
];

// Seed Initial Orders
const SEED_ORDERS: AdminOrder[] = [
  {
    id: 'ORD-401',
    orderNumber: '#VR-10284',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.m@example.com',
    customerPhone: '+880 1711-998877',
    shippingAddress: 'House 14, Road 5, Dhanmondi, Dhaka',
    shopName: 'Bengal Loom & Craft',
    itemsCount: 1,
    totalAmount: 8500,
    paymentMethod: 'bKash Online',
    paymentStatus: 'PAID',
    orderStatus: 'Delivered',
    courier: 'Pathao Courier',
    trackingId: 'PTH-8849120',
    estimatedDelivery: '2026-03-14',
    orderDate: '2026-03-11',
  },
  {
    id: 'ORD-402',
    orderNumber: '#VR-10283',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.w@example.com',
    customerPhone: '+880 1819-223344',
    shippingAddress: 'Flat 3B, Concord Tower, Banani, Dhaka',
    shopName: 'Aroma Botanica Beauty',
    itemsCount: 2,
    totalAmount: 3300,
    paymentMethod: 'Credit Card',
    paymentStatus: 'PAID',
    orderStatus: 'Shipped',
    courier: 'Steadfast Courier',
    trackingId: 'STF-440192',
    estimatedDelivery: '2026-03-28',
    orderDate: '2026-03-25',
  },
  {
    id: 'ORD-403',
    orderNumber: '#VR-10282',
    customerName: 'Daniel Smith',
    customerEmail: 'd.smith@example.com',
    customerPhone: '+880 1910-556677',
    shippingAddress: 'Sector 4, Uttara Model Town, Dhaka',
    shopName: 'NextGen Gadgets Hub',
    itemsCount: 1,
    totalAmount: 4800,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'PENDING',
    orderStatus: 'Processing',
    orderDate: '2026-03-26',
  },
  {
    id: 'ORD-404',
    orderNumber: '#VR-10281',
    customerName: 'Mahir Faysal',
    customerEmail: 'mahir.f@example.com',
    customerPhone: '+880 1612-448800',
    shippingAddress: 'Chawkbazar, Chittagong',
    shopName: 'Bengal Loom & Craft',
    itemsCount: 3,
    totalAmount: 17000,
    paymentMethod: 'Nagad Pay',
    paymentStatus: 'PAID',
    orderStatus: 'Processing',
    orderDate: '2026-03-27',
  },
  {
    id: 'ORD-405',
    orderNumber: '#VR-10280',
    customerName: 'Sadia Rahman',
    customerEmail: 'sadia.r@example.com',
    customerPhone: '+880 1511-778899',
    shippingAddress: 'Zindabazar, Sylhet',
    shopName: 'Aroma Botanica Beauty',
    itemsCount: 1,
    totalAmount: 1650,
    paymentMethod: 'bKash Online',
    paymentStatus: 'PAID',
    orderStatus: 'Cancelled',
    orderDate: '2026-03-22',
  },
];

interface AdminStoreState {
  users: AdminUser[];
  shops: AdminShop[];
  products: AdminProduct[];
  orders: AdminOrder[];
}

function loadState(): AdminStoreState {
  if (typeof window === 'undefined') {
    return {
      users: SEED_USERS,
      shops: SEED_SHOPS,
      products: SEED_PRODUCTS,
      orders: SEED_ORDERS,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load admin data from localStorage:', e);
  }

  const initial = {
    users: SEED_USERS,
    shops: SEED_SHOPS,
    products: SEED_PRODUCTS,
    orders: SEED_ORDERS,
  };
  saveState(initial);
  return initial;
}

function saveState(state: AdminStoreState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('venraz_admin_data_updated'));
  } catch (e) {
    console.error('Failed to save admin state:', e);
  }
}

// User Management Methods
export function getAdminUsers(): AdminUser[] {
  return loadState().users;
}

export function switchUserRole(userId: string, newRole: UserRole): AdminUser[] {
  const state = loadState();
  state.users = state.users.map((u) =>
    u.id === userId ? { ...u, role: newRole } : u
  );
  saveState(state);
  return state.users;
}

export function toggleUserStatus(userId: string): AdminUser[] {
  const state = loadState();
  state.users = state.users.map((u) => {
    if (u.id === userId) {
      return {
        ...u,
        status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
      };
    }
    return u;
  });
  saveState(state);
  return state.users;
}

// Shop Moderation Methods
export function getAdminShops(): AdminShop[] {
  return loadState().shops;
}

export function approveShop(shopId: string): AdminShop[] {
  const state = loadState();
  state.shops = state.shops.map((s) =>
    s.id === shopId ? { ...s, status: 'Approved', statusReason: undefined } : s
  );
  saveState(state);
  return state.shops;
}

export function rejectShop(shopId: string, reason: string): AdminShop[] {
  const state = loadState();
  state.shops = state.shops.map((s) =>
    s.id === shopId ? { ...s, status: 'Rejected', statusReason: reason } : s
  );
  saveState(state);
  return state.shops;
}

export function toggleShopSuspension(shopId: string, reason?: string): AdminShop[] {
  const state = loadState();
  state.shops = state.shops.map((s) => {
    if (s.id === shopId) {
      if (s.status === 'Suspended') {
        return { ...s, status: 'Approved', statusReason: undefined };
      }
      return {
        ...s,
        status: 'Suspended',
        statusReason: reason || 'Suspended by system administrator.',
      };
    }
    return s;
  });
  saveState(state);
  return state.shops;
}

// Product Moderation Methods
export function getAdminProducts(): AdminProduct[] {
  return loadState().products;
}

export function approveProduct(productId: string): AdminProduct[] {
  const state = loadState();
  state.products = state.products.map((p) =>
    p.id === productId ? { ...p, status: 'Approved', rejectionReason: undefined } : p
  );
  saveState(state);
  return state.products;
}

export function rejectProduct(productId: string, reason: string): AdminProduct[] {
  const state = loadState();
  state.products = state.products.map((p) =>
    p.id === productId ? { ...p, status: 'Rejected', rejectionReason: reason } : p
  );
  saveState(state);
  return state.products;
}

export function toggleProductVisibility(productId: string): AdminProduct[] {
  const state = loadState();
  state.products = state.products.map((p) => {
    if (p.id === productId) {
      return {
        ...p,
        status: p.status === 'Hidden' ? 'Approved' : 'Hidden',
      };
    }
    return p;
  });
  saveState(state);
  return state.products;
}

// Order Management Methods
export function getAdminOrders(): AdminOrder[] {
  return loadState().orders;
}

export function updateOrderStatus(orderId: string, newStatus: AdminOrderStatus): AdminOrder[] {
  const state = loadState();
  state.orders = state.orders.map((o) =>
    o.id === orderId ? { ...o, orderStatus: newStatus } : o
  );
  saveState(state);
  return state.orders;
}

export function assignOrderTracking(
  orderId: string,
  courier: string,
  trackingId: string,
  estimatedDelivery?: string
): AdminOrder[] {
  const state = loadState();
  state.orders = state.orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        courier,
        trackingId,
        estimatedDelivery: estimatedDelivery || o.estimatedDelivery,
        orderStatus: o.orderStatus === 'Processing' ? 'Shipped' : o.orderStatus,
      };
    }
    return o;
  });
  saveState(state);
  return state.orders;
}

// Global Summary Stats for Overview
export function getAdminDashboardStats() {
  const state = loadState();
  const totalRevenue = state.orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingShopsCount = state.shops.filter((s) => s.status === 'Pending').length;
  const pendingProductsCount = state.products.filter((p) => p.status === 'Pending').length;
  const processingOrdersCount = state.orders.filter((o) => o.orderStatus === 'Processing').length;

  return {
    totalRevenue,
    totalUsers: state.users.length,
    totalShops: state.shops.length,
    pendingShopsCount,
    totalProducts: state.products.length,
    pendingProductsCount,
    totalOrders: state.orders.length,
    processingOrdersCount,
  };
}
