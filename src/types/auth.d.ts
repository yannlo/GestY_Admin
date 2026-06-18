
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
