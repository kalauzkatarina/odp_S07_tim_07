import axios from "axios";
import type { GenreDto } from "../../models/genres/GenreDto";
import type { IGenresApiService } from "./IGenresApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "genre";

const emptyGenre: GenreDto = {
    id: 0,
    name: ""
};

export const genresApi: IGenresApiService = {
    async getAllGenres(): Promise<GenreDto[]> {
        try {
            const res = await axios.get<GenreDto[]>(`${API_URL}s`);
            return res.data;
        }
        catch {
            return [];
        }
    },
    async createGenre(token: string, name: string): Promise<GenreDto> {
        try {
            const res = await axios.post<GenreDto>(
                `${API_URL}`,
                {
                    name
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch {
            return emptyGenre;
        }
    },
    async deleteGenre(token: string, id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return true;
        } catch {
            return false;
        }
    }
}