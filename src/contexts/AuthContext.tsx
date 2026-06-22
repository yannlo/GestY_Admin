import React, { createContext, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login as apiLogin, logout as apiLogout, getCurrentUser as apiGetCurrentUser } from "@/services/authApi";

const TOKEN_KEY = "auth_token";

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
  const queryClient = useQueryClient();

  const { data: token, isLoading: isLoadingToken } = useQuery<string | null>({
    queryKey: ["authToken"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(TOKEN_KEY);
      return stored;
    },
    staleTime: Infinity,
  });

  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      if (!token) return null;
      const currentUser = await apiGetCurrentUser(token);
      if (!currentUser) {
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
      return currentUser;
    },
    enabled: !!token,
    staleTime: Infinity,
  });

  const { mutateAsync: loginMutate } = useMutation({
    mutationFn: apiLogin,
    onSuccess: async (response) => {
      if (response.success && response.token) {
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        queryClient.setQueryData(["authToken"], response.token);
        queryClient.setQueryData(["currentUser", response.token], response.user ?? null);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    },
  });

  const { mutateAsync: logoutMutate } = useMutation({
    mutationFn: apiLogout,
    onSuccess: async () => {
      await AsyncStorage.removeItem(TOKEN_KEY);
      queryClient.setQueryData(["authToken"], null);
      queryClient.setQueryData(["currentUser"], null);
    },
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginMutate(credentials);

    if (response.success) return { success: true };
    return { success: false, error: response.error };
  }, [loginMutate]);

  const logout = useCallback(async () => {
    await logoutMutate();
  }, [logoutMutate]);

  const isLoading = isLoadingToken || (isLoadingUser && !user);

  const value = useMemo<AuthContextType>(() => ({
    user: user ?? null,
    token: token ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, token, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
