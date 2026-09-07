
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  id: number;
  avatar: string;
  name: string;
  designation: string;
  review: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    avatar: "/assets/testimonial/testi_2_1.jpg",
    name: "Michel Smith",
    designation: "CEO Of Company",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
  {
    id: 2,
    avatar: "/assets/testimonial/testi_2_2.jpg",
    name: "Abraham Khalil",
    designation: "Managing Director",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
  {
    id: 3,
    avatar: "/assets/testimonial/testi_2_3.jpg",
    name: "Jenny Wilson",
    designation: "CEO Of Company",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
  {
    id: 4,
    avatar: "/assets/testimonial/testi_2_4.jpg",
    name: "Jackline Techie",
    designation: "Managing Director",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
  {
    id: 5,
    avatar: "/assets/testimonial/testi_2_5.jpg",
    name: "Michel Smith",
    designation: "CEO Of Company",
    review:
      "I just got this high fashion for Beckam and couldn’t be happier with it. It gets amazing reviews and made a total believe out of me. I love the minimal, clean look.",
  },
];

export default function CustomerReviews() {
  return (
    <section
      id="testi-sec"
      className="relative overflow-hidden bg-white py-16 lg:py-20"
    >
      {/* Background Shape */}
      <div className="pointer-events-none absolute left-0 top-0 hidden xl:block">
        <Image
          src="/assets/img/shape/shape-19.png"
          alt="shape"
          width={250}
          height={250}
          className="animate-bounce"
        />
      </div>

      {/* Heading */}
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          {/* Title */}
          <div className="w-full lg:w-auto">
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-left">
              Customers Latest Reviews
            </h2>
          </div>

          {/* Explore */}
          <div className="w-full text-center lg:w-auto lg:text-right">
            <a
              href="/contact"
              className="inline-block border-b border-gray-900 pb-1 text-sm font-medium text-gray-900 transition hover:text-gray-500"
            >
              Explore All
            </a>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="mx-auto mt-6 w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Line */}
        <div className="mb-8 h-px w-full bg-gray-200" />

        <Swiper
          modules={[Pagination]}
          spaceBetween={14}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: ".testimonial-pagination",
          }}
          breakpoints={{
            767: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 2,
            },
            1400: {
              slidesPerView: 3,
            },
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="h-full rounded-xl bg-white p-6 mt-6 mb-6 ml-3 mr-3 shadow-[0_5px_20px_rgba(0,0,0,0.08)] sm:p-8">
                {/* Quote + Rating */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <Image
                      src="/assets/icon/quote2.svg"
                      alt="Quote"
                      width={40}
                      height={40}
                    />
                  </div>

                  <div className="flex gap-1 text-sm">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>

                {/* Review */}
                <p className="mb-6 text-[15px] leading-7 text-gray-600">
                  {testimonial.review}
                </p>

                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {testimonial.designation}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination */}
        <div className="testimonial-pagination mt-4 flex justify-center gap-2" />
      </div>
    </section>
  );
}
