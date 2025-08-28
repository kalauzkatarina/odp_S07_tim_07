import axios from "axios";
import type { UserDto } from "../../models/users/UserDto";
import type { IUsersApiService } from "./IUsersApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "user";

export const usersApi: IUsersApiService = {
  async getAllUsers(token: string): Promise<UserDto[]> {
    try {
      const res = await axios.get<UserDto[]>(`${API_URL}s`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch {
      return [];
    }
  }
}