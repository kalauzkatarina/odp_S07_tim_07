import { Author } from "../models/Author";

export interface IAuthorRepository {
    create(author: Author): Promise<Author>;
    getById(id: number): Promise<Author>;
    getByFirstName(first_name: string): Promise<Author>;
    getByLastName(last_name: string): Promise<Author>;
    getAll(): Promise<Author[]>;
    update(author: Author): Promise<Author>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}