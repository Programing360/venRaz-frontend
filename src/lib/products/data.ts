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

export const getHomeSections = async (): Promise<HomeSections> => {
  const fallbackData: HomeSections = {
    featured: MOCK_PRODUCTS.filter((p) => p.isFeatured),
    flashSale: MOCK_PRODUCTS.filter((p) => p.isFlashSale),
    topRated: [...MOCK_PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4),
    mostSelling: [...MOCK_PRODUCTS].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4),
    newArrivals: [...MOCK_PRODUCTS].reverse().slice(0, 4),
  };

  try {
    if (!API) {
      return fallbackData;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout for resilience

    const res = await fetch(`${API}/api/v1/products/home-sections`, {
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
      flashSale: data?.flashSale?.length ? data.flashSale : fallbackData.flashSale,
      topRated: data?.topRated?.length ? data.topRated : fallbackData.topRated,
      mostSelling: data?.mostSelling?.length ? data.mostSelling : fallbackData.mostSelling,
      newArrivals: data?.newArrivals?.length ? data.newArrivals : fallbackData.newArrivals,
    };
  } catch (error) {
    // Graceful fallback if backend is offline
    return fallbackData;
  }
};