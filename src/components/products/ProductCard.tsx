"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
// import img from '../../../public/assets/collection_1_4.jpg'
export interface Product {
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
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);
  // (product);
  const image = product.images?.[0] || "/placeholder.svg";

  const hasDiscount =
    typeof product.discount === "number" && product.discount > 0;

  const finalPrice =
    product.isFlashSale && typeof product.flashSalePrice === "number"
      ? product.flashSalePrice
      : product.price;

  const oldPrice = hasDiscount ? product.price : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 h-full flex flex-col w-full">
      <Link
        href={`/products/${product._id}`}
        className="block flex-1 flex flex-col"
      >
        {/* Product Image */}
        <div className="relative h-64 w-full bg-slate-50 flex-shrink-0 overflow-hidden">
          <Image
            src={image}
            alt={product.name || "Product"}
            fill
            className="object-contain p-4 group-hover:scale-105 transition duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-[#ff594d] text-white text-xs font-semibold rounded-full shadow-sm">
              -{product.discount}%
            </span>
          )}

          {/* Flash Sale Badge */}
          {product.isFlashSale && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm">
              Flash Sale
            </span>
          )}

          {/* Featured Badge */}
          {!product.isFlashSale && product.isFeatured && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-[#132573] text-white text-xs font-semibold rounded-full shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow justify-between gap-4 w-full">
          <div className="space-y-2 w-full">
            {/* Brand + Rating */}
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {product.brand || "VenRaz"}
              </span>

              <span className="font-semibold text-amber-500 text-xs flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating ?? 4.8}
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-base font-bold text-slate-900 line-clamp-2 pt-1 group-hover:text-[#ff594d] transition-colors">
              {product.name}
            </h3>

            {/* Reviews */}
            {typeof product.totalReviews === "number" && (
              <p className="text-slate-400 text-xs">
                {product.totalReviews} reviews
              </p>
            )}
          </div>

          {/* Footer & Add to Cart */}
          <div className="pt-4 border-t border-slate-100 mt-auto w-full">
            <div className="flex items-center justify-between gap-3">
              {/* Price */}
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900">
                  ${finalPrice.toFixed(2)}
                </span>
                {oldPrice !== undefined && (
                  <span className="text-xs text-gray-400 line-through">
                    ${oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 shadow-sm ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-[#ff594d] hover:bg-black text-white"
                } disabled:bg-gray-200 disabled:cursor-not-allowed`}
                aria-label="Add to cart"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
