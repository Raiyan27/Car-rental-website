import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddCarPage = () => {
  const [formData, setFormData] = useState({
    model: "",
    price: "",
    availability: "Available",
    registration: "",
    features: "",
    description: "",
    location: "",
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { email, displayName } = currentUser;

  const onDrop = (acceptedFiles) => {
    setImages(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    images.forEach((image) => data.append("images", image));

    data.append("bookingCount", 0);
    data.append("email", email);
    data.append("name", displayName);

    try {
      const response = await axios.post("http://localhost:5000/add-car", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Car added successfully!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
    navigate("/home");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-yellowPrimary rounded-lg shadow-md my-8">
      <h2 className="text-2xl font-bold text-center text-bluePrimary">
        Add a New Car
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label htmlFor="model" className="block text-bluePrimary font-medium">
            Car Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-bluePrimary font-medium">
            Daily Rental Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
          />
        </div>

        <div>
          <label
            htmlFor="availability"
            className="block text-bluePrimary font-medium"
          >
            Availability
          </label>
          <select
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="registration"
            className="block text-bluePrimary font-medium"
          >
            Vehicle Registration Number
          </label>
          <input
            type="text"
            id="registration"
            name="registration"
            value={formData.registration}
            onChange={handleChange}
            required
            className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
          />
        </div>

        <div>
          <label
            htmlFor="features"
            className="block text-bluePrimary font-medium"
          >
            Features
          </label>
          <input
            type="text"
            id="features"
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="E.g., GPS, AC, etc."
            className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-bluePrimary font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-bluePrimary font-medium"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
          />
        </div>

        <div>
          <label className="block text-bluePrimary font-medium">Images</label>
          <div
            {...getRootProps({
              className:
                "w-full p-4 border-2 border-dashed border-bluePrimary rounded bg-[#FADA7A] text-center cursor-pointer",
            })}
          >
            <input {...getInputProps()} />
            <p>Drag & drop images here, or click to select files</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-bluePrimary text-accent font-bold py-2 px-4 rounded hover:bg-blueSecondary focus:outline-none focus:ring focus:ring-blueSecondary"
        >
          Add Car
        </button>
      </form>
    </div>
  );
};

export default AddCarPage;
