import { Book } from "../models/Book";

export interface IBookRepository {
    create(book: Book): Promise<Book>;
    getByTitle(title: string): Promise<Book>;
    getByAuthor(author: string): Promise<Book>;
    getAll(filters?: {title?: string; author?: string; genre?: string;}): Promise<Book[]>;
    getAllByGenre(genre_id: number): Promise<Book[]>;
    getBookById(id: number): Promise<Book>;
    update(book: Book): Promise<Book>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
    getTopViewed(limit: number): Promise<Book[]>;
}