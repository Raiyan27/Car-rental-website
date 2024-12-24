import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user?.email) {
        const currentUser = { email: user.email };
        axios
          .post("http://localhost:5000/jwt", currentUser, {
            withCredentials: true,
          })
          .catch((err) => console.error(err));
      } else {
        axios.post(
          "http://localhost:5000/logout",
          {},
          { withCredentials: true }
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
