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

/* ================= HOME PRODUCT SECTIONS ================= */

export const getHomeSections = async (): Promise<HomeSections> => {
  const emptyData: HomeSections = {
    featured: [],
    flashSale: [],
    topRated: [],
    mostSelling: [],
    newArrivals: [],
  };

  try {
    if (!API) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return emptyData;
    }

    const res = await fetch(
      `${API}/api/v1/products/home-sections`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(
        `Product API failed: ${res.status} ${res.statusText}`
      );

      return emptyData;
    }

    const response = await res.json();

    console.log("PRODUCT API RESPONSE:", response);

    return {
      featured: response?.data?.featured ?? [],
      flashSale: response?.data?.flashSale ?? [],
      topRated: response?.data?.topRated ?? [],
      mostSelling: response?.data?.mostSelling ?? [],
      newArrivals: response?.data?.newArrivals ?? [],
    };
  } catch (error) {
    console.error("getHomeSections error:", error);

    return emptyData;
  }
};