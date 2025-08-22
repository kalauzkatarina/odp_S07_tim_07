import { BookDto } from "../../DTOs/books/BookDto";
import { Book } from "../../models/Book";

export interface IBookService {
    getAllBooks(): Promise<BookDto[]>;
    getAllBooksByGenre(genre_id: number): Promise<BookDto[]>;
    getBookByTitle(title: string): Promise<BookDto>;
    getBookByAuthor(author: string): Promise<BookDto>
    createBook(title: string, author: string, summary: string, format: string, pages: number, script: string, binding: string, publish_date: string, isbn: string, cover_image_url: string, genres: number[]): Promise<BookDto>;
    updateBook(title: string, updates: Partial<BookDto>): Promise<BookDto>;
    deleteBook(id: number): Promise<boolean>;
    incrementViews(title: string): Promise<BookDto>;
}