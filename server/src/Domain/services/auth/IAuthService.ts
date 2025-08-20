import { UserAuthDataDto } from "../../DTOs/auth/UserAuthDataDto";
import { UserRole } from "../../enums/UserRole";

export interface IAuthService {
    logIn(username: string, password: string): Promise<UserAuthDataDto>;
    signUp(username: string, password: string, email: string, role: UserRole): Promise<UserAuthDataDto>;
    getMe(id: number): Promise<UserAuthDataDto>
}