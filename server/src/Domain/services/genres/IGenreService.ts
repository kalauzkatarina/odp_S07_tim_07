import { GenreDto } from "../../DTOs/genres/GenreDto";

export interface IGenreService{
    getAllGenres(filters?: {id?: number, name?: string}): Promise<GenreDto[]>;
    createGenre(genre: GenreDto): Promise<GenreDto>;
}