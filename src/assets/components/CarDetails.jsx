import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Swal from "sweetalert2";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/car/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };
    fetchCar();
  }, [id]);

  const handleBooking = () => {
    Swal.fire({
      title: "Confirm Booking",
      text: `Do you want to confirm the booking for ${car.model} at $${car.price}/day?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Book Now!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Booking Confirmed!",
          text: `Your booking for ${car.model} has been confirmed.`,
          icon: "success",
          confirmButtonColor: "#10B981",
        });
      }
    });
  };

  if (!car) return <div>Loading car details...</div>;

  return (
    <div className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">{car.model}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Swiper spaceBetween={20} slidesPerView={1}>
              {car.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`Car Image ${index + 1}`}
                    className="rounded-lg shadow-lg w-full"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800 mb-4">
              Price Per Day:{" "}
              <span className="text-green-500">${car.price}</span>
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> {car.location}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Availability:</strong> {car.availability ? "Yes" : "No"}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Features:</strong> {car.features}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description:</strong> {car.description}
            </p>
            <button
              onClick={handleBooking}
              className="px-6 py-3 bg-yellowSecondary text-gray-800 rounded-lg hover:bg-yellowPrimary transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
