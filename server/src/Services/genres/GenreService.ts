import { GenreDto } from "../../Domain/DTOs/genres/GenreDto";
import { Genre } from "../../Domain/models/Genre";
import { IGenreRepository } from "../../Domain/repositories/IGenreRepository";
import { IGenreService } from "../../Domain/services/genres/IGenreService";

export class GenreService implements IGenreService{
    public constructor(private genreRepository: IGenreRepository){}

    async getAllGenres(filters?: { id?: number; name?: string; }): Promise<GenreDto[]> {
        const genres: Genre[] = await this.genreRepository.getAll(filters);
        return genres.map(g => new GenreDto(
            g.id, g.name
        ));
    }
    async createGenre(genre: GenreDto): Promise<GenreDto> {
        const newGenre = await this.genreRepository.create(
            new Genre(0, genre.name)
        );
        return new GenreDto(
            newGenre.id, newGenre.name
        );
    }
    
}