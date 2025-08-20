import { AuthorDto } from "../../DTOs/authors/AuthorDto";

export interface IAuthorService {
    getAllAuthors(): Promise<AuthorDto[]>;
    getAuthorById(id: number): Promise<AuthorDto>;
    createAuthor(first_name: string, last_name: string): Promise<AuthorDto>;
    updateAuthor(id: number, updates: {first_name?: string; last_name?: string; }): Promise<AuthorDto>;
    deleteAuthor(id: number): Promise<boolean>;
}