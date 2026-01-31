import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";
import { toast } from "react-toastify";
import { signOut, getAuth } from "firebase/auth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("You have logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-bluePrimary text-white sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="h-16 mr-3" />
          </Link>
          <h1 className="text-xl font-bold">Gari Chai</h1>
        </div>

        <div className="hidden md:flex space-x-6 justify-center items-center">
          <Link
            to="/"
            className={`hover:text-yellowPrimary ${
              isActive("/") ? "text-yellowPrimary font-bold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/available-cars"
            className={`hover:text-yellowPrimary ${
              isActive("/available-cars") ? "text-yellowPrimary font-bold" : ""
            }`}
          >
            Available Cars
          </Link>
          {currentUser ? (
            <>
              <Link
                to="/add-car"
                className={`hover:text-yellowPrimary ${
                  isActive("/add-car") ? "text-yellowPrimary font-bold" : ""
                }`}
              >
                Add Car
              </Link>
              <Link
                to="/my-cars"
                className={`hover:text-yellowPrimary ${
                  isActive("/my-cars") ? "text-yellowPrimary font-bold" : ""
                }`}
              >
                My Cars
              </Link>
              <Link
                to="/my-bookings"
                className={`hover:text-yellowPrimary ${
                  isActive("/my-bookings") ? "text-yellowPrimary font-bold" : ""
                }`}
              >
                My Bookings
              </Link>
              <button
                className="text-red-600 hover:text-red-400"
                onClick={handleLogout}
              >
                Logout
              </button>
              <div>
                <img
                  className="w-12 h-12 rounded-full"
                  title={currentUser.displayName || "User"}
                  src={currentUser.photoURL}
                  alt=""
                />
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`hover:text-yellowPrimary ${
                  isActive("/login") ? "text-yellowPrimary font-bold" : ""
                }`}
              >
                Log-in
              </Link>
              <Link
                to="/register"
                className={`hover:text-yellowPrimary ${
                  isActive("/register") ? "text-yellowPrimary font-bold" : ""
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          &#9776;
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 bg-bluePrimary w-full md:hidden flex flex-col items-center space-y-4 py-4">
            <Link
              to="/"
              className={`hover:text-yellowPrimary ${
                isActive("/") ? "text-yellowPrimary font-bold" : ""
              }`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/available-cars"
              className={`hover:text-yellowPrimary ${
                isActive("/available-cars")
                  ? "text-yellowPrimary font-bold"
                  : ""
              }`}
              onClick={toggleMenu}
            >
              Available Cars
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/add-car"
                  className={`hover:text-yellowPrimary ${
                    isActive("/add-car") ? "text-yellowPrimary font-bold" : ""
                  }`}
                  onClick={toggleMenu}
                >
                  Add Car
                </Link>
                <Link
                  to="/my-cars"
                  className={`hover:text-yellowPrimary ${
                    isActive("/my-cars") ? "text-yellowPrimary font-bold" : ""
                  }`}
                  onClick={toggleMenu}
                >
                  My Cars
                </Link>
                <Link
                  to="/my-bookings"
                  className={`hover:text-yellowPrimary ${
                    isActive("/my-bookings")
                      ? "text-yellowPrimary font-bold"
                      : ""
                  }`}
                  onClick={toggleMenu}
                >
                  My Bookings
                </Link>
                <button className="hover:text-red-500" onClick={handleLogout}>
                  Logout
                </button>
                <div>
                  <img src="" alt="" />
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`hover:text-yellowPrimary ${
                  isActive("/login") ? "text-yellowPrimary font-bold" : ""
                }`}
                onClick={toggleMenu}
              >
                Log-in
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
