
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

type Brand = {
  id: number;
  image: string;
  name: string;
};

const brands: Brand[] = [
  {
    id: 1,
    image: "/assets/brand/brand_2_1.svg",
    name: "Brand 1",
  },
  {
    id: 2,
    image: "/assets/brand/brand_2_2.svg",
    name: "Brand 2",
  },
  {
    id: 3,
    image: "/assets/brand/brand_2_3.svg",
    name: "Brand 3",
  },
  {
    id: 4,
    image: "/assets/brand/brand_2_4.svg",
    name: "Brand 4",
  },
  {
    id: 5,
    image: "/assets/brand/brand_2_5.svg",
    name: "Brand 5",
  },
  {
    id: 6,
    image: "/assets/brand/brand_2_6.svg",
    name: "Brand 6",
  },
  {
    id: 7,
    image: "/assets/brand/brand_2_1.svg",
    name: "Brand 1",
  },
  {
    id: 8,
    image: "/assets/brand/brand_2_2.svg",
    name: "Brand 2",
  },
  {
    id: 9,
    image: "/assets/brand/brand_2_3.svg",
    name: "Brand 3",
  },
  {
    id: 10,
    image: "/assets/img/brand/brand_2_4.svg",
    name: "Brand 4",
  },
  {
    id: 11,
    image: "/assets/img/brand/brand_2_5.svg",
    name: "Brand 5",
  },
  {
    id: 12,
    image: "/assets/img/brand/brand_2_6.svg",
    name: "Brand 6",
  },
];

const ShopByBrand = () => {
  return (
    <section className="overflow-hidden py-10">
      <div className="mx-auto w-full max-w-[1800px] px-4"> 
        {/* Header */}
        <div className="mb-6 flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-900 lg:text-left">
              Shop By Brand
            </h2>
          </div>

          <div className="w-full text-center lg:w-auto lg:text-right">
            <a
              href="/contact"
              className="inline-flex items-center border-b border-gray-900 pb-1 text-sm font-medium text-gray-900 transition hover:opacity-70"
            >
              Explore All
            </a>
          </div>
        </div>

        {/* Brand Slider */}
        <Swiper
          spaceBetween={0}
          slidesPerView={2}
          breakpoints={{
            576: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            992: {
              slidesPerView: 4,
            },
            1200: {
              slidesPerView: 4,
            },
            1300: {
              slidesPerView: 5,
            },
            1500: {
              slidesPerView: 6,
            },
          }}
          className="w-full"
        >
          {brands.map((brand: Brand) => (
            <SwiperSlide key={brand.id}>
              <div className="flex h-[135px] items-center justify-center px-4">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={280} 
                  height={130}
                  className="h-auto max-h-[130px] w-auto max-w-[280px] object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ShopByBrand;

