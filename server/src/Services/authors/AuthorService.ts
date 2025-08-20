import { AuthorDto } from "../../Domain/DTOs/authors/AuthorDto";
import { Author } from "../../Domain/models/Author";
import { IAuthorRepository } from "../../Domain/repositories/IAuthorRepository";
import { IAuthorService } from "../../Domain/services/authors/IAuthorService";

export class AuthorService implements IAuthorService{
    public constructor(private authorRepository: IAuthorRepository) {}
    
    async getAllAuthors(): Promise<AuthorDto[]> {
    
        const authors: Author[] = await this.authorRepository.getAll();
        return authors.map(a => new AuthorDto(a.id, a.first_name, a.last_name));
    }
    
    async getAuthorById(id: number): Promise<AuthorDto> {
        const author = await this.authorRepository.getById(id);
        
        if(author.id !== 0){
            return new AuthorDto(author.id, author.first_name, author.last_name);
        }

        return new AuthorDto();
    }

    async createAuthor(first_name: string, last_name: string): Promise<AuthorDto> {
        const newAuthor = await this.authorRepository.create(new Author(0, first_name, last_name));
        return new AuthorDto(newAuthor.id, newAuthor.first_name, newAuthor.last_name);
    }

    async updateAuthor(id: number, updates: { first_name?: string; last_name?: string; }): Promise<AuthorDto> {
        const existingAuthor = await this.authorRepository.getById(id);

        if (existingAuthor.id === 0) {
            return new AuthorDto();
        }

        const updatedAuthor = new Author(
            existingAuthor.id,
            updates.first_name || existingAuthor.first_name,
            updates.last_name || existingAuthor.last_name
        );

        const saved = await this.authorRepository.update(updatedAuthor);
        return new AuthorDto(saved.id, saved.first_name, saved.last_name);
    }

    async deleteAuthor(id: number): Promise<boolean> {
        return await this.authorRepository.delete(id);
    }

}