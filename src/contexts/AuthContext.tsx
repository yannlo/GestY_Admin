import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, logout as apiLogout, getCurrentUser as apiGetCurrentUser } from "@/services/authApi";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("auth_token");
      if (storedToken) {
        const currentUser = await apiGetCurrentUser(storedToken);
        if (currentUser) {
          setUser(currentUser);
          setToken(storedToken);
        } else {
          await AsyncStorage.removeItem("auth_token");
        }
      }
    } catch (error) {
      console.error("Error loading auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);
    
    if (response.success && response.user && response.token) {
      setUser(response.user);
      setToken(response.token);
      await AsyncStorage.setItem("auth_token", response.token);
      return { success: true };
    }
    
    return { success: false, error: response.error };
  }, []);


  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("auth_token");
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, token, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
