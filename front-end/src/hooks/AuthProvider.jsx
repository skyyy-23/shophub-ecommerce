import { useEffect, useState } from "react";
import { apiEndpoints } from "../config/api";
import {
  clearAuthSession,
  getAuthSession,
  persistAuthSession,
} from "../services/authStorage";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const AuthContextProvider = AuthContext.Provider;
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const { token, user: storedUser, remember, scope } = getAuthSession();

      if (storedUser && isMounted) {
        setUser(storedUser);
      }

      if (!token) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(apiEndpoints.user, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data?.user) {
          if (isMounted) {
            setUser(data.user);
          }
          persistAuthSession({ token, user: data.user, remember, scope });
        } else if (response.status === 401 || response.status === 419) {
          clearAuthSession(scope);
          if (isMounted) {
            setUser(null);
          }
        }
      } catch {
        // Keep existing session on network/parse errors.
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (session) => {
    if (!session) {
      return;
    }

    if (session.token && session.user) {
      persistAuthSession({
        token: session.token,
        user: session.user,
        remember: session.remember,
        scope: session.scope,
      });
      setUser(session.user);
      return;
    }

    setUser(session);
  };

  const logout = async () => {
    let scope = "user";
    try {
      const session = getAuthSession();
      scope = session.scope || "user";
      const token = session.token;
      if (token) {
        await fetch(apiEndpoints.logout, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthSession(scope);
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
