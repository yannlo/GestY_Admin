// Types pour l'authentification
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  sexe: "M" | "F" | "O";
  email: string;
  phone: string; // 10 digits
  password: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Base de données fictive d'utilisateurs
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@yannlo.com",
    password: "yannlo",
    firstname: "Yann-Loïc",
    lastname: "Ehui",
    birthdate: new Date("1990-01-01"),
    sexe: "M",
    phone: "0612345678",
    createdAt: new Date().toISOString(),
  },
];

// Simulation de délai API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Service d'authentification API

// Login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(500); // Simuler délai réseau

  const user = mockUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password,
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
