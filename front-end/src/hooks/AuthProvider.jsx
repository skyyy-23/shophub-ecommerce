import { useEffect, useState } from "react";
import {
  clearLegacyAuthStorage,
  persistRememberPreference,
} from "../services/authStorage";
import { fetchCurrentUser, logoutUser } from "../services/shopApi";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const AuthContextProvider = AuthContext.Provider;
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    clearLegacyAuthStorage();

    const initializeAuth = async () => {
      try {
        const data = await fetchCurrentUser();

        if (isMounted && data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        const status = error.response?.status;

        if (status !== 401 && status !== 419) {
          console.error("Failed to restore session:", error);
        }

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (session) => {
    if (!session) {
      return;
    }

    if (session.user) {
      persistRememberPreference({
        remember: session.remember,
        scope: session.scope,
      });
      setUser(session.user);
      return;
    }

    setUser(session);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAdmin,
  };

  return (
    <AuthContextProvider value={value}>
      {children}
    </AuthContextProvider>
  );
}
