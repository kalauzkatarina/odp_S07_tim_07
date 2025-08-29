import axios from "axios";
import type { UserDto } from "../../models/users/UserDto";
import type { IUsersApiService } from "./IUsersApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "user";

const emptyUser : UserDto = {
    id: 0,
    username    : "",
    email       : "",
    role        : "",
};

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
  },

  async getUserById(token: string, userId: number): Promise<UserDto> {
    try {
      const res = await axios.get<UserDto>(`${API_URL}s/get/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return emptyUser;
    }
  },

  async updateUser( token: string, userId: number,
    updates: { username?: string; email?: string; password?: string; role?: string }
  ): Promise<UserDto> {
    try {
      const res = await axios.put<UserDto>(`${API_URL}s/update/${userId}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error updating user:", error);
      return emptyUser;
    }
  }
};
