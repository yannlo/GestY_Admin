import { mockUsers } from "@/mockup/users";

// Simulation de délai API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Service d'authentification API

// Login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(200); // Simuler délai réseau

  const user = mockUsers.find(
    (u) => u.email.value === credentials.email && u.password === credentials.password,
  );

  if (user) {
    const token = `mock-token-${user.id}-${Date.now()}`;
    return {
      success: true,
      user: { ...user },
      token,
    };
  }

  return {
    success: false,
    error: "Email ou mot de passe incorrect",
  };
};

// Logout
export const logout = async (): Promise<void> => {
  await delay(200); // Simuler délai réseau
};

// Get current user (simulation)
export const getCurrentUser = async (token: string): Promise<User | null> => {
  await delay(300);

  if (!token || !token.startsWith("mock-token-")) {
    return null;
  }

  const userId = token.split("-")[2];
  const user = mockUsers.find((u) => u.id === userId);
  return user ? { ...user } : null;
};
