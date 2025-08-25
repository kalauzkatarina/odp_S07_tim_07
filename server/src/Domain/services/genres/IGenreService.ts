import { GenreDto } from "../../DTOs/genres/GenreDto";

export interface IGenreService{
    getAllGenres(filters?: {id?: number, name?: string}): Promise<GenreDto[]>;
    createGenre(name: string): Promise<GenreDto>;
    deleteGenre(id: number): Promise<boolean>;
}