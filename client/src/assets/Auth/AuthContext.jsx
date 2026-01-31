import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import api from "../../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user?.email) {
        const currentUser = {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        };
        api.post("/auth/login", currentUser).catch((err) => console.error(err));
      } else {
        api.post("/auth/logout", {}).catch((err) => console.error(err));
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
