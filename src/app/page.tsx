import BestSellers from "@/components/home/BestSellerss";
import Category from "@/components/home/Category";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FlashSale from "@/components/home/FlashSale";
import Hero from "@/components/home/hero";
import TrendingProducts from "@/components/home/TrendingProducts";
import ShopBySmartWatchest from "@/components/home/ShopBySmartWatches";
import ShopByBrand from "@/components/home/ShopByBrand";
import LatestNews from "@/components/home/LatestNew";
import CustomerReviews from "@/components/home/CustomersLatestReviews";

export default function Home() {
  return (
    <>
      <Hero />
      <FlashSale></FlashSale>
      <Category />
      <TrendingProducts />
      <FeaturedProducts></FeaturedProducts>
      <BestSellers></BestSellers>
      <ShopBySmartWatchest></ShopBySmartWatchest>
      <ShopByBrand></ShopByBrand>
      <CustomerReviews></CustomerReviews>
      <LatestNews></LatestNews>
      
      
    </>
  );
}