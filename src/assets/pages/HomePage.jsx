import { Link } from "react-router-dom";
import { FaCar, FaDollarSign, FaRegClock, FaHeadset } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const HomePage = () => {
  return (
    <div>
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-gray-900"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/LxrDb9y/2025-G-SUV-HERO-DR.webp')",
        }}
      >
        <div className="bg-black bg-opacity-70 p-10 text-center rounded-md shadow-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">
            Drive Your Dreams Today!
          </h1>
          <Link
            to="/available-cars"
            className="px-8 py-4 bg-yellowSecondary text-gray-900 font-semibold rounded-lg hover:bg-yellowPrimary transition-all duration-300 shadow-md focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          >
            View Available Cars
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <FaCar className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">Wide Variety of Cars</h3>
              <p>From budget-friendly options to luxury vehicles.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaDollarSign className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">Affordable Prices</h3>
              <p>Competitive daily rates you can count on.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaRegClock className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">Easy Booking Process</h3>
              <p>Seamlessly book your ride in just a few clicks.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaHeadset className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">Customer Support</h3>
              <p>24/7 assistance for all your queries.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Recent Listings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={`/car-${index + 1}.jpg`}
                    alt="Car"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">Toyota Camry 2023</h3>
                    <p className="text-green-500">$45/day</p>
                    <p className="text-gray-600 text-sm">Available</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Added 2 days ago
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What Our Users Say
          </h2>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000 }}
          >
            {Array(3)
              .fill()
              .map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="text-center">
                    <img
                      src={`/user-${index + 1}.jpg`}
                      alt="User"
                      className="w-16 h-16 rounded-full mx-auto"
                    />
                    <p className="mt-4 text-lg font-semibold">John Doe</p>
                    <p className="text-yellowPrimary-500 mt-2">★★★★★</p>
                    <p className="text-gray-600 mt-4">
                      "Amazing service and great cars. Highly recommend!"
                    </p>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Special Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-green-500">
                  Get 15% Off for Weekend Rentals!
                </h3>
                <p className="mt-4">
                  Plan your weekend trip and save big on rentals.
                </p>
                <button className="mt-6 px-4 py-2 bg-yellowSecondary text-gray-700 rounded hover:bg-yellowPrimary">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
