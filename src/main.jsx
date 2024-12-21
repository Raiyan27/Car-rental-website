import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./assets/pages/Root.jsx";
import Login from "./assets/pages/Login.jsx";
import ErrorPage from "./assets/pages/ErrorPage.jsx";
import HomePage from "./assets/pages/HomePage.jsx";
import AddCarPage from "./assets/pages/AddCarPage.jsx";
import { AuthProvider } from "./assets/Auth/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import Register from "./assets/pages/Register.jsx";
import PrivateRoute from "./assets/components/PrivateRoute.jsx";
import AvailableCars from "./assets/components/AvailableCars.jsx";
import MyCars from "./assets/components/MyCars.jsx";
import MyBookings from "./assets/components/MyBookings.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/available-cars",
        element: <AvailableCars />,
      },
      {
        path: "/add-car",
        element: (
          <PrivateRoute>
            <AddCarPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-cars",
        element: (
          <PrivateRoute>
            <MyCars />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-bookings",
        element: (
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        ),
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </AuthProvider>
  </StrictMode>
);
