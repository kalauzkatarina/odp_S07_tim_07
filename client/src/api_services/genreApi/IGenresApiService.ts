import type { GenreDto } from "../../models/genres/GenreDto";

export interface IGenresApiService {
    getAllGenres(): Promise<GenreDto[]>;
    deleteGenre(token: string, id: number): Promise<boolean>;
}