import type { AuthUser } from "./AuthUser";

export type AuthResponse = {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: AuthUser;
  };
}