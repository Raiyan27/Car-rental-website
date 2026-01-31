require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@practisecluster.7glnk.mongodb.net/?retryWrites=true&w=majority&appName=PractiseCluster`;

// Middleware
app.use(
  cors({
    origin: [
      "https://gari-chai-27.web.app",
      "https://gari-chai.surge.sh",
      "http://localhost:5173",
      "https://gari-chai.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.post("/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
});

app.post("/logout", (req, res) => {
  res
    .clearCookie("token", { httpOnly: true, secure: true })
    .send({ success: true });
});

// Verify Middleware
const verify = (req, res, next) => {
  const token = req.cookies?.token;
  console.log("token:", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token Missing" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ message: "Unauthorized access Token Invalid" });
    }
    req.user = decoded;
    next();
  });
};

async function run() {
  try {
    const database = client.db("GariChai");
    const cars = database.collection("Cars");
    const bookings = database.collection("Bookings");
    const reviews = database.collection("Reviews");

    console.log("Connected to MongoDB!");

    app.get("/cars", async (req, res) => {
      try {
        const carList = await cars.find({}).toArray();
        res.status(200).json(carList);
      } catch (error) {
        res.status(500).json({ message: "Error fetching cars" });
      }
    });

    app.get("/car", verify, async (req, res) => {
      const email = req.query.email;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const searchQuery = req.query.searchQuery || "";

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      if (req.query.email !== req.user.email) {
        return res
          .status(403)
          .json({ message: "Email mismatch, Forbidden access" });
      }

      try {
        const query = { "user.email": email };

        if (searchQuery) {
          const priceQuery = parseFloat(searchQuery);
          query.$or = [
            { model: { $regex: searchQuery, $options: "i" } },
            { availability: { $regex: searchQuery, $options: "i" } },
          ];
          if (!isNaN(priceQuery)) query.$or.push({ price: priceQuery });
        }

        const skip = (page - 1) * limit;
        const total = await cars.countDocuments(query);
        const result = await cars.find(query).skip(skip).limit(limit).toArray();

        res.status(200).send({
          cars: result,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        });
      } catch (error) {
        res.status(500).send({ message: "Error retrieving cars by email" });
      }
    });

    app.get("/car/:id", async (req, res) => {
      const carId = req.params.id;

      try {
        const car = await cars.findOne({ _id: new ObjectId(carId) });
        if (!car) {
          return res.send({ message: "car not found" });
        }

        res.send(car);
      } catch (error) {
        console.log(error);
        res.send({ error: "Error fetching car" });
      }
    });

    //add car api
    app.post("/add-car", verify, async (req, res) => {
      try {
        const {
          model,
          price,
          availability,
          registration,
          features,
          description,
          location,
          images,
          user,
        } = req.body;

        if (
          !model ||
          !price ||
          !registration ||
          !description ||
          !images ||
          images.length === 0
        ) {
          return res
            .status(400)
            .json({ message: "Required fields are missing" });
        }

        const carData = {
          model,
          price: parseFloat(price),
          availability,
          registration,
          features,
          description,
          location,
          user,
          images,
          bookingCount: 0,
          createdAt: new Date(),
        };

        const result = await cars.insertOne(carData);

        res.status(201).json({
          message: "Car added successfully",
          carId: result.insertedId,
        });
      } catch (error) {
        console.error("Error adding car:", error);
        res.status(500).json({ message: "Error adding car" });
      }
    });

    app.patch("/update-car/:id", verify, async (req, res) => {
      const carId = req.params.id;
      const {
        model,
        price,
        availability,
        registration,
        features,
        description,
        location,
        images,
      } = req.body;

      try {
        const updatedCar = {
          ...(model && { model }),
          ...(price && { price: parseFloat(price) }),
          ...(availability && { availability }),
          ...(registration && { registration }),
          ...(features && { features }),
          ...(description && { description }),
          ...(location && { location }),
          ...(images && { images }),
          updatedAt: new Date(),
        };

        const result = await cars.updateOne(
          { _id: new ObjectId(carId) },
          { $set: updatedCar }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json({ message: "Car updated successfully" });
      } catch (e) {
        res.status(500).json({ message: `Error updating car: ${e.message}` });
      }
    });

    app.delete("/delete-car/:id", async (req, res) => {
      const carId = req.params.id;

      try {
        const result = await cars.deleteOne({ _id: new ObjectId(carId) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json({ message: "Car deleted successfully" });
      } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ message: "Error deleting car" });
      }
    });

    app.post("/add-booking", async (req, res) => {
      try {
        const { carId, startDate, endDate, totalPrice, email } = req.body;

        if (!carId || !startDate || !endDate || !totalPrice || !email) {
          return res.status(400).json({ message: "All fields are required" });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
          return res
            .status(400)
            .json({ message: "Start date must be before end date" });
        }

        const conflict = await bookings.findOne({
          carId: new ObjectId(carId),
          $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
        });

        if (conflict) {
          return res
            .status(409)
            .json({ message: "Car is already booked for the specified dates" });
        }

        const bookingData = {
          carId: new ObjectId(carId),
          clientEmail: email,
          startDate: start,
          endDate: end,
          totalPrice,
          status: "Pending",
          createdAt: new Date(),
        };

        const result = await bookings.insertOne(bookingData);

        await cars.updateOne(
          { _id: new ObjectId(carId) },
          { $inc: { bookingCount: 1 } }
        );

        res.status(201).json({
          message: "Booking added successfully",
          bookingId: result.insertedId,
        });
      } catch (e) {
        res
          .status(500)
          .json({ message: `Failed to add booking: ${e.message}` });
      }
    });

    app.get("/my-bookings", verify, async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      if (email !== req.user.email) {
        return res
          .status(403)
          .json({ message: "Email mismatch, Forbidden access" });
      }
      const query = { clientEmail: email };
      try {
        const result = await bookings.find(query).toArray();
        if (result.length === 0) {
          return res
            .status(404)
            .json({ message: "No bookings found for this email" });
        }
        res.status(200).json(result);
      } catch (error) {
        res
          .status(500)
          .json({ message: `Error retrieving bookings: ${error.message}` });
      }
    });

    app.patch("/booking-confirmation/:id", async (req, res) => {
      try {
        const bookingId = req.params.id;
        const { action } = req.body;

        if (!ObjectId.isValid(bookingId)) {
          return res.status(400).json({ message: "Invalid booking ID format" });
        }

        if (!["confirm", "cancel"].includes(action)) {
          return res.status(400).json({ message: "Invalid action" });
        }

        const booking = await bookings.findOne({
          _id: new ObjectId(bookingId),
        });
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }

        if (action === "confirm") {
          await bookings.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { status: "Confirmed", updatedAt: new Date() } }
          );
          return res.status(200).json({ message: "Booking confirmed" });
        } else if (action === "cancel") {
          await bookings.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { status: "Canceled", updatedAt: new Date() } }
          );
          return res.status(200).json({ message: "Booking canceled" });
        }
      } catch (error) {
        console.error("Error handling booking confirmation:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.delete("/booking-delete/:id", async (req, res) => {
      try {
        const deleteId = req.params.id;
        const result = await bookings.deleteOne({
          _id: new ObjectId(deleteId),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ message: "Booking Deleted Successfully" });
      } catch (e) {
        res.status(500).json({ message: "Failed to Delete Booking" });
      }
    });

    app.get("/owner-bookings", async (req, res) => {
      try {
        const carId = req.query.carId;

        if (!carId) {
          return res.status(400).json({ message: "carId is required" });
        }

        const ownerBookings = await bookings
          .find({ carId: new ObjectId(carId) })
          .toArray();

        res.status(200).json(ownerBookings);
      } catch (error) {
        console.error("Error fetching owner bookings:", error);
        res.status(500).json({ message: "Error fetching owner bookings" });
      }
    });

    app.patch("/update-booking/:id", async (req, res) => {
      try {
        const bookingId = req.params.id;

        if (!ObjectId.isValid(bookingId)) {
          return res.status(400).json({ message: "Invalid booking ID format" });
        }

        const { startDate, endDate, totalPrice } = req.body;

        if (!startDate || !endDate) {
          return res
            .status(400)
            .json({ message: "Start and end dates are required" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
          return res
            .status(400)
            .json({ message: "Start date must be before end date" });
        }

        const booking = await bookings.findOne({
          _id: new ObjectId(bookingId),
        });

        if (!booking) {
          return res
            .status(404)
            .json({ message: "Booking not found or unauthorized" });
        }

        const conflict = await bookings.findOne({
          carId: booking.carId,
          _id: { $ne: new ObjectId(bookingId) },
          $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
        });

        if (conflict) {
          return res
            .status(409)
            .json({ message: "Car is already booked for the specified dates" });
        }

        const result = await bookings.updateOne(
          { _id: new ObjectId(bookingId) },
          {
            $set: {
              startDate: start,
              endDate: end,
              totalPrice: totalPrice,
              updatedAt: new Date(),
            },
          }
        );
        console.log(result);
        res.status(200).json({ message: "Booking updated successfully" });
      } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ message: "Error updating booking" });
      }
    });

    const handleBookingAction = async (bookingId, action) => {
      try {
        const response = await axios.patch(
          `http://localhost:5000/booking-confirmation/${bookingId}`,
          { action }
        );

        Swal.fire("Success", `Booking ${action}ed successfully.`, "success");

        setBookingInfo((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? {
                  ...booking,
                  status: action === "confirm" ? "confirmed" : "canceled",
                }
              : booking
          )
        );
      } catch (error) {
        console.error("Error updating booking:", error);
        Swal.fire("Error", "Failed to update booking status.", "error");
      }
    };

    app.get("/car-bookings/:carId", async (req, res) => {
      const carId = req.params.carId;

      try {
        const carBookings = await bookings
          .find({ carId: new ObjectId(carId) })
          .toArray();

        res.status(200).json(carBookings);
      } catch (error) {
        console.error("Error fetching car bookings:", error);
        res.status(500).json({ message: "Error fetching car bookings" });
      }
    });

    app.post("/add-review", async (req, res) => {
      try {
        const {
          carId,
          rating,
          comment,
          model,
          owner,
          reviewer,
          reviewerPhoto,
        } = req.body;

        if (!carId || !rating || !comment || !model || !owner || !reviewer) {
          return res.status(400).json({ message: "All fields are required" });
        }

        const reviewData = {
          carId: new ObjectId(carId),
          model: model,
          owner: owner,
          reviewer: reviewer,
          reviewerPhoto: reviewerPhoto,
          rating: parseInt(rating),
          comment,
          createdAt: new Date(),
        };

        const result = await reviews.insertOne(reviewData);

        res.status(201).json({
          message: "Review added successfully",
          reviewId: result.insertedId,
        });
      } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Error adding review" });
      }
    });
    app.get("/reviews", async (req, res) => {
      try {
        const carReviews = await reviews.find({}).toArray();

        res.status(200).json(carReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Error fetching reviews" });
      }
    });

    app.get("/reviews/:carId", async (req, res) => {
      try {
        const carId = req.params.carId;
        const carReviews = await reviews
          .find({ carId: new ObjectId(carId) })
          .toArray();

        res.status(200).json(carReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Error fetching reviews" });
      }
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.status(200).send("Server is running YAY!");
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
