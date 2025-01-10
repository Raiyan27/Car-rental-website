import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCar, FaDollarSign, FaRegClock, FaHeadset } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import "animate.css";
import { Helmet } from "react-helmet";
import { Autoplay } from "swiper/modules";

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    axios
      .get("https://gari-chai-server.vercel.app/cars")
      .then((response) => {
        const sortedCars = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setCars(sortedCars);
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
      });
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://gari-chai-server.vercel.app/reviews`
        );
        setReviews(response.data.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Gari Chai - Home</title>
      </Helmet>
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-gray-900"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/LxrDb9y/2025-G-SUV-HERO-DR.webp')",
        }}
      >
        <div className="bg-black bg-opacity-70 p-10 text-center rounded-md shadow-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">
            Drive Your Dreams Today! <br />
            <span className="text-2xl text-stone-500">Take it for a spin</span>
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
            {cars.length > 0 ? (
              cars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl hover:translate-y-1 transition-shadow  mx-2 md:mx-0"
                >
                  <Link to={`/car/${car._id}`} className="block">
                    <img
                      src={car.images[0]}
                      alt={car.model}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold">{car.model}</h3>
                      <p className="text-green-500">${car.price}/day</p>
                      <p
                        className={`text-sm ${
                          car.availability === "Available"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {car.availability === "Available"
                          ? "Available"
                          : "Not Available"}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Added {new Date(car.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="h-72 flex items-center justify-center flex-col gap-2 col-span-3">
                <p>LOADING</p>
                <div className="loading loading-spinner text-warning"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center ">
            What Our Users Say
          </h2>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="w-32 flex flex-col items-center justify-center">
                    <img
                      className="w-24 h-24 rounded-full border border-yellowSecondary"
                      src={review.reviewerPhoto || "https://placehold.co/400"}
                      alt={review.reviewer}
                    />
                  </div>
                  <p className="mt-4 text-lg font-semibold">
                    {review.reviewer}
                  </p>
                  <p className="mt-4 text-sm">Reviewed: {review.model}</p>
                  <p className="mt-2 text-yellow-500 text-5xl animate__animated animate__heartBeat">
                    {Array.from({ length: 5 }, (_, index) => {
                      return index < review.rating ? "★" : "☆";
                    })}
                  </p>
                  <p className="text-gray-600 mt-4">{review.comment}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8  mx-2 md:mx-0">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transform group bounce-on-hover">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-green-500 ">
                  BMW MX-3 for $70/day!
                </h3>
                <p className="mt-4">Get it booked right now!</p>
                <div className="mt-6">
                  <Link
                    to="/available-cars"
                    className="px-4 py-2 bg-yellowSecondary text-gray-700 rounded hover:bg-yellowPrimary"
                  >
                    Watch More Offers Like This!
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transform group bounce-on-hover">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-green-500 ">
                  Audi A4 for $65/day!
                </h3>
                <p className="mt-4">Plan your trip today!</p>
                <div className="mt-6">
                  <Link
                    to="/available-cars"
                    className="px-4 py-2 bg-yellowSecondary text-gray-700 rounded hover:bg-yellowPrimary"
                  >
                    Watch More Offers Like this!
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transform group bounce-on-hover">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-green-500 ">
                  Tesla Model Y for $90/day!
                </h3>
                <p className="mt-4">Drive the future today!</p>
                <div className="mt-6">
                  <Link
                    to="/available-cars"
                    className="px-4 py-2 bg-yellowSecondary text-gray-700 rounded hover:bg-yellowPrimary"
                  >
                    Watch More Offers Like this!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Top Car Maintenance Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-2">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-green-500 mb-4">
                Regular Oil Changes
              </h3>
              <p>
                Keep your engine healthy by changing the oil every 5,000-7,500
                miles, or as recommended by your car's manufacturer.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-green-500 mb-4">
                Check Tire Pressure
              </h3>
              <p>
                Properly inflated tires improve fuel efficiency and prevent
                uneven wear. Check your tire pressure monthly.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-green-500 mb-4">
                Replace Air Filters
              </h3>
              <p>
                A clean air filter ensures optimal engine performance. Replace
                it every 12,000-15,000 miles or as needed.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-green-500 mb-4">
                Inspect Brakes
              </h3>
              <p>
                Listen for unusual sounds or vibrations when braking. Have your
                brakes checked at least once a year.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-green-500 mb-4">
                Keep It Clean
              </h3>
              <p>
                Regular washes and waxing not only keep your car looking great
                but also protect it from rust and damage.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-green-500 mb-4">
                Monitor Fluid Levels
              </h3>
              <p>
                Regularly check your coolant, transmission, and brake fluid
                levels to ensure a smooth and safe ride.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                What documents do I need to rent a car?
              </h3>
              <p className="text-gray-600">
                You will need a valid driver’s license, proof of identity, and a
                credit card in the name of the primary driver. Additional
                requirements may apply based on location.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Is there an age limit for renting a car?
              </h3>
              <p className="text-gray-600">
                Yes, the minimum age to rent a car is typically 21 years. Some
                vehicle categories may have higher age requirements, and renters
                under 25 may incur a young driver fee.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Do you offer insurance for rentals?
              </h3>
              <p className="text-gray-600">
                Yes, we offer optional insurance coverage, including collision
                damage waivers and theft protection. You can choose your
                coverage during the booking process.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Can I return the car to a different location?
              </h3>
              <p className="text-gray-600">
                Yes, we offer one-way rentals between selected locations.
                Additional fees may apply. Please confirm availability when
                booking.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                What happens if I return the car late?
              </h3>
              <p className="text-gray-600">
                Late returns may incur additional charges. It’s best to notify
                us in advance if you anticipate a delay to discuss possible
                options.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Are there mileage restrictions on rentals?
              </h3>
              <p className="text-gray-600">
                Some vehicles come with unlimited mileage, while others may have
                daily or weekly mileage limits. Check your rental agreement for
                details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
