import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Lottie from "lottie-react";
import LoginAnimationData from "../Lottie/login-animation.json";
const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Error - Page Not Found</title>
      </Helmet>
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-8 py-4 bg-yellowSecondary text-gray-900 font-semibold rounded-lg hover:bg-yellowPrimary transition-all duration-300 shadow-md focus:ring-2 focus:ring-yellow-300 focus:outline-none"
        >
          Back to Home
        </Link>
      </div>
      <div className="w-72">
        <Lottie animationData={LoginAnimationData} />
      </div>
    </div>
  );
};

export default ErrorPage;
