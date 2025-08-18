import { Book } from "../models/Book";

export interface IBookRepository {
    create(book: Book): Promise<Book>;
    getByTitle(title: string): Promise<Book>;
    getAll(): Promise<Book[]>;
    update(book: Book): Promise<Book>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}