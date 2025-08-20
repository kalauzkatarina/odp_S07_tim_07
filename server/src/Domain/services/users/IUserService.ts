import { UserDto } from "../../DTOs/users/UserDto";
import { UserRole } from "../../enums/UserRole";

export interface IUserService {
    getAllUsers(): Promise<UserDto[]>;
    getUserById(id: number): Promise<UserDto>;
    updateUser(id: number, updates: {username?: string; email?: string; password?: string; role?: UserRole}): Promise<UserDto>;
}