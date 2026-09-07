import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug?: string;
  images?: string[];
  price: number;
  discount?: number;
  stock?: number;
  brand?: string;
  rating?: number;
  totalReviews?: number;
  soldCount?: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const image = product.images?.[0] || "/default-product.jpg";

  const hasDiscount =
    typeof product.discount === "number" &&
    product.discount > 0;

  const finalPrice =
    product.isFlashSale &&
    typeof product.flashSalePrice === "number"
      ? product.flashSalePrice
      : product.price;

  const oldPrice = hasDiscount ? product.price : undefined;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block h-full w-full"
    >
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col w-full">

        {/* Product Image */}
        <div className="relative h-64 w-full bg-slate-50 flex-shrink-0 overflow-hidden">
          <Image
            src={image}
            alt={product.name || "Product"}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              -{product.discount}%
            </span>
          )}

          {/* Flash Sale Badge */}
          {product.isFlashSale && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
              Flash Sale
            </span>
          )}

          {/* Featured Badge */}
          {!product.isFlashSale && product.isFeatured && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-[#132573] text-white text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow justify-between gap-4 w-full">

          <div className="space-y-2 w-full">

            {/* Brand + Rating */}
            <div className="flex items-center justify-between w-full">
              {product.brand ? (
                <span className="text-xs font-medium text-[#205A44]">
                  {product.brand}
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  Product
                </span>
              )}

              <span className="font-semibold text-amber-500 text-sm flex items-center gap-1">
                ⭐ {product.rating ?? 0}
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 pt-1">
              {product.name}
            </h3>

            {/* Reviews */}
            {typeof product.totalReviews === "number" && (
              <p className="text-slate-400 text-xs">
                {product.totalReviews} reviews
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 mt-auto w-full">

            <div className="flex items-end justify-between gap-3">

              {/* Price */}
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#205A44]">
                  ৳{finalPrice.toLocaleString()}
                </span>

                {oldPrice !== undefined && (
                  <span className="text-sm text-gray-400 line-through">
                    ৳{oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="text-right">
                {product.stock !== undefined &&
                  (product.stock > 0 ? (
                    <span className="text-xs text-green-600 font-medium">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">
                      Out of Stock
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;