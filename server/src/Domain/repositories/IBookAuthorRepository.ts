import { BookAuthor } from "../models/BookAuthor";

export interface IBookAuthorRepository {
    create(book_author: BookAuthor): Promise<BookAuthor>;
    getByBookId(id: number): Promise<BookAuthor>;
    getByAuthorId(id: number): Promise<BookAuthor>;
    getAll(): Promise<BookAuthor[]>;
    update(book_author: BookAuthor): Promise<BookAuthor>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}