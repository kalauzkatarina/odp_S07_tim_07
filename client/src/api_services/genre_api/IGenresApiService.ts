import type { GenreDto } from "../../models/genres/GenreDto";

export interface IGenresApiService{
    getAllGenres(): Promise<GenreDto[]>;
    createGenre(token: string, name: string): Promise<GenreDto>;
    deleteGenre(token: string, id: number): Promise<boolean>;
}