import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Swal from "sweetalert2";
import BookingModal from "./BookingModal";
import ShowReviewsModal from "./ShowReviewsModal";
import { AuthContext } from "../Auth/AuthContext";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const swiperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(
          `https://gari-chai-server.vercel.app/car/${id}`
        );
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };
    fetchCar();
  }, [isModalOpen]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  const handleBooking = () => {
    if (currentUser) {
      setIsModalOpen(true);
    } else {
      Swal.fire("Error", "Login to Book.", "error");
    }
  };

  const handleShowReviews = () => {
    setIsReviewsModalOpen(true);
  };

  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false);
  };

  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner text-warning"></div>
      </div>
    );

  return (
    <div className="py-16 bg-gray-100 min-h-screen px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">{car.model}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              onSlideChange={(swiper) =>
                setSelectedImageIndex(swiper.activeIndex)
              }
              ref={swiperRef}
            >
              {car.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="flex items-center justify-center">
                    <img
                      src={image}
                      alt={`Car Image ${index + 1}`}
                      className="rounded-lg shadow-lg w-full max-w-[650px]"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {car.images.length > 1 && (
              <div className="mt-4 flex space-x-4 mx-2 md:mx-0 items-center justify-center">
                {car.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2   ${
                      selectedImageIndex === index
                        ? "border-yellow-500"
                        : "border-gray-300"
                    } hover:border-yellow-500`}
                    onClick={() => handleImageClick(index)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mx-2 px-4 sm:px-12 md:px-8 ld:px-0 md:mx-0 ">
            <p className="text-xl font-semibold text-gray-800 mb-4">
              Price Per Day:{" "}
              <span className="text-green-500">${car.price}</span>
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> {car.location}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Availability:</strong>{" "}
              {car.availability === "Available" ? "Yes" : "No"}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Features:</strong> {car.features}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description:</strong> {car.description}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Life-time booking count:</strong> {car.bookingCount}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Owner:</strong> {car.user.name || "Owner"}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Reviews:</strong>{" "}
              <button
                className="bg-bluePrimary px-2 rounded"
                onClick={handleShowReviews}
              >
                See Reviews
              </button>
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
      {isModalOpen && (
        <BookingModal car={car} closeModal={() => setIsModalOpen(false)} />
      )}
      {isReviewsModalOpen && (
        <ShowReviewsModal carId={car._id} closeModal={closeReviewsModal} />
      )}
    </div>
  );
};

export default CarDetails;
