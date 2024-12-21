import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";
import { toast } from "react-toastify";
import { signOut, getAuth } from "firebase/auth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const auth = getAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    console.log("clicked");
    try {
      await signOut(auth);
      toast.success("You have logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="bg-bluePrimary text-white sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-16 mr-3" />
          <h1 className="text-xl font-bold">Gari Chai</h1>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-yellowPrimary">
            Home
          </Link>
          <Link to="/available-cars" className="hover:text-yellowPrimary">
            Available Cars
          </Link>
          {currentUser ? (
            <>
              <Link to="/add-car" className="hover:text-yellowPrimary">
                Add Car
              </Link>
              <Link to="/my-cars" className="hover:text-yellowPrimary">
                My Cars
              </Link>
              <Link to="/my-bookings" className="hover:text-yellowPrimary">
                My Bookings
              </Link>
              <button className="hover:text-red-500" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-yellowPrimary">
              Log-in
            </Link>
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
              className="hover:text-yellowPrimary"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/available-cars"
              className="hover:text-yellowPrimary"
              onClick={toggleMenu}
            >
              Available Cars
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/add-car"
                  className="hover:text-yellowPrimary"
                  onClick={toggleMenu}
                >
                  Add Car
                </Link>
                <Link
                  to="/my-cars"
                  className="hover:text-yellowPrimary"
                  onClick={toggleMenu}
                >
                  My Cars
                </Link>
                <Link
                  to="/my-bookings"
                  className="hover:text-yellowPrimary"
                  onClick={toggleMenu}
                >
                  My Bookings
                </Link>
                <button className="hover:text-red-500" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hover:text-yellowPrimary"
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
