import { MOCK_PRODUCTS } from "./mockCatalog";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  images?: string[];

  price: number;
  discount?: number;
  stock?: number;
  brand?: string;

  rating?: number;
  totalReviews?: number;
  soldCount?: number;

  status?: string;

  isFeatured?: boolean;
  isFlashSale?: boolean;

  flashSalePrice?: number;
  flashSaleEndDate?: string;
}

export interface HomeSections {
  featured: Product[];
  flashSale: Product[];
  topRated: Product[];
  mostSelling: Product[];
  newArrivals: Product[];
}

export const getProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) => {
  const fallbackData = {
    products: [],
    totalPages: 1,
    totalProducts: 0,
    categories: [],
  };

  try {
    if (!API) {
      return fallbackData;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(
      `${API}/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    ).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      return fallbackData;
    }

    const response = await res.json();
    const data = response?.data;
    data;

    return {
      totalPages: data?.totalPages || 1,
      products: data?.products || [],
      totalProducts: data?.totalProducts || 0,
      categories: data?.categories || [],
    };
  } catch {
    return fallbackData;
  }
};

export const getHomeSections = async (): Promise<HomeSections> => {
  const fallbackData: HomeSections = {
    featured: MOCK_PRODUCTS.filter((p) => p.isFeatured),
    flashSale: MOCK_PRODUCTS.filter((p) => p.isFlashSale),
    topRated: [...MOCK_PRODUCTS]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4),
    mostSelling: [...MOCK_PRODUCTS]
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 4),
    newArrivals: [...MOCK_PRODUCTS].reverse().slice(0, 4),
  };

  try {
    if (!API) {
      return fallbackData;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout for resilience

    const res = await fetch(`${API}/products/home-sections`, {
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      return fallbackData;
    }

    const response = await res.json();
    const data = response?.data;

    return {
      featured: data?.featured?.length ? data.featured : fallbackData.featured,
      flashSale: data?.flashSale?.length
        ? data.flashSale
        : fallbackData.flashSale,
      topRated: data?.topRated?.length ? data.topRated : fallbackData.topRated,
      mostSelling: data?.mostSelling?.length
        ? data.mostSelling
        : fallbackData.mostSelling,
      newArrivals: data?.newArrivals?.length
        ? data.newArrivals
        : fallbackData.newArrivals,
    };
  } catch {
    // Graceful fallback if backend is offline
    return fallbackData;
  }
};
