import type { AuthResponse } from "../../types/auth/AuthResponse";

export interface IAuthAPIService {
    logIn(username: string, password: string): Promise<AuthResponse>;
    signUp(username: string, password: string, email: string, role: string): Promise<AuthResponse>;
}