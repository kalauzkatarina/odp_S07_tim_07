import type { UserDto } from "../../models/users/UserDto";

export interface IUsersApiService {
    getAllUsers(token: string): Promise<UserDto[]>
}