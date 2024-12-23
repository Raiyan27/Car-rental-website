import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaTh, FaList } from "react-icons/fa";

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cars");
        setLoading(false);
        const availableCars = response.data.filter(
          (car) => car.availability === "Available"
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
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <p>LOADING..</p>
        <div className="loading loading-spinner text-warning"></div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Available Cars</h2>
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
          <div className="flex items-center gap-4">
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
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              : "grid-cols-1 gap-4"
          }`}
        >
          {filteredCars.map((car) => (
            <div
              key={car._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={car.images[0]}
                alt={car.model}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{car.model}</h3>
                <p className="text-green-500">${car.price}/day</p>
                <p className="text-gray-600 text-sm">{car.location}</p>
                <p className="text-gray-500 text-xs mt-2">
                  Available: {car.availability === "Available" ? "Yes" : "No"}
                </p>
                <Link
                  to={`/car/${car._id}`}
                  className="block text-gray-800 mt-4 px-4 py-2 text-center bg-yellowSecondary text-gray-800 rounded-lg hover:bg-yellowPrimary transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableCars;
