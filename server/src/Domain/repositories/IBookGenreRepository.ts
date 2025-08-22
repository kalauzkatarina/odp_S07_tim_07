import { Book } from "../models/Book";
import { BookGenre } from "../models/BookGenre";

export interface IBookGenreRepository {
    create(book_genre: BookGenre): Promise<BookGenre>;
    getByBookId(id: number): Promise<BookGenre[]>;
    getByGenreId(id: number): Promise<BookGenre>;
    getAll(): Promise<BookGenre[]>;
    update(book_genre: BookGenre): Promise<BookGenre>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}