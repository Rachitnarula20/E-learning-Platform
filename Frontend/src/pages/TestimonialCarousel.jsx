import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "John Doe",
    role: "Software Engineer",
    testimonial: "This plugin transformed my workflow. Highly recommended!",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Sarah Smith",
    role: "Product Manager",
    testimonial: "Absolutely love the ease of use and the seamless integration.",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Michael Johnson",
    role: "Freelancer",
    testimonial: "A must-have plugin for anyone in the industry!",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const TestimonialCarousel = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">What Our Users Say</h2>
        <p className="text-gray-600 mb-10">Hear from our happy customers</p>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="w-full max-w-3xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 mx-auto rounded-full mb-4"
                />
                <p className="text-lg font-medium text-gray-900">"{testimonial.testimonial}"</p>
                <p className="mt-4 text-sm text-gray-600">
                  — {testimonial.name}, {testimonial.role}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
