import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { FaSearch, FaTh, FaList } from "react-icons/fa";
import { Helmet } from "react-helmet";

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/cars");
        setLoading(false);
        const availableCars = response.data.data.filter(
          (car) => car.availability === "Available",
        );
        setCars(availableCars);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = cars
    .filter((car) => car.model.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  if (loading) {
    return (
      <div className="py-16 p-4 bg-gray-100 min-h-screen">
        <div className="container mx-auto">
          <div className="text-3xl font-bold mb-8 text-center h-8 bg-gray-300 rounded animate-pulse mx-auto w-48"></div>
          <div className="flex flex-col space-y-1 md:flex-row items-center justify-between mb-8">
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-64"></div>
            <div className="flex items-center gap-4 pt-4 md:pt-0">
              <div className="hidden gap-2 sm:flex">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-48"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden mx-2 md:mx-0"
              >
                <div className="h-52 bg-gray-300 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-1 w-16"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-24"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-20"></div>
                  <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Available Cars - Gari Chai</title>
        <meta
          name="description"
          content="Browse our collection of available cars for rent. Find the perfect vehicle for your needs with our easy booking system."
        />
        <meta
          name="keywords"
          content="available cars, car rental, rent cars, vehicle booking"
        />
      </Helmet>
      <div className="py-16 p-4 bg-gray-100 min-h-screen">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Available Cars
          </h2>
          <div className="flex flex-col space-y-1 md:flex-row items-center justify-between mb-8">
            <div className="relative">
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by car model..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-yellowSecondary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 pt-4 md:pt-0">
              <div className="hidden gap-2 sm:flex">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-full ${
                    view === "grid"
                      ? "bg-yellowSecondary text-gray-800"
                      : "bg-gray-200"
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-full ${
                    view === "list"
                      ? "bg-yellowSecondary text-gray-800"
                      : "bg-gray-200"
                  }`}
                >
                  <FaList />
                </button>
              </div>
              <button
                onClick={toggleSortOrder}
                className="px-4 py-2 bg-yellowSecondary text-gray-800 rounded-lg hover:bg-yellowPrimary transition"
              >
                Sort by Price (
                {sortOrder === "asc" ? "Low to High" : "High to Low"})
              </button>
            </div>
          </div>
          <div
            className={`grid ${
              view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                : "grid-cols-1 gap-4"
            }`}
          >
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow mx-2 md:mx-0"
                >
                  <img
                    src={car.images?.[0]?.url || "https://placehold.co/400"}
                    alt={car.model}
                    className={`w-full  object-cover ${
                      view === "list" ? "h-96" : "h-52"
                    }`}
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {car.model}
                    </h3>
                    <p className="text-green-500">${car.price}/day</p>
                    <p className="text-gray-600 text-sm">{car.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-500">
                        {car.rating > 0
                          ? `${"★".repeat(Math.round(car.rating))} (${car.rating})`
                          : "No ratings"}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({car.reviewCount} reviews)
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      Available:{" "}
                      {car.availability === "Available" ? "Yes" : "No"}
                    </p>
                    <Link
                      to={`/car/${car._id}`}
                      className="block text-gray-800 mt-4 px-4 py-2 text-center bg-yellowSecondary rounded-lg hover:bg-yellowPrimary transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 col-span-4  ">
                <p className="text-2xl font-semibold text-gray-500 ">
                  No cars match your search for &quot;
                  <span className="font-bold">{search}</span>&quot;.
                </p>
                <p className="text-gray-400">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableCars;
