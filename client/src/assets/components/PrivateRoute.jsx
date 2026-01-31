import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
