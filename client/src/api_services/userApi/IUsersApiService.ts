import type { UserDto } from "../../models/users/UserDto";

export interface IUsersApiService {
    getAllUsers(token: string): Promise<UserDto[]>;
    updateUser( token: string, userId: number,
        updates: { username?: string; email?: string; password?: string; role?: string }
      ): Promise<UserDto>;
    getUserById(token: string, userId: number): Promise<UserDto>;
}