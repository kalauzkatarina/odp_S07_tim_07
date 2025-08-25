import { BookDto } from "../../DTOs/books/BookDto";

export interface IBookService {
    getAllBooks(): Promise<BookDto[]>;
    getAllBooksByGenre(genre_id: number): Promise<BookDto[]>;
    getBookByTitle(title: string): Promise<BookDto>;
    getBookByAuthor(author: string): Promise<BookDto>
    getBookById(id: number): Promise<BookDto>;
    createBook(title: string, author: string, summary: string, format: string, pages: number, script: string, binding: string, publish_date: string, isbn: string, cover_image_url: string, genres: number[]): Promise<BookDto>;
    updateBook(id: number, updates: Partial<BookDto>): Promise<BookDto>;
    deleteBook(id: number): Promise<boolean>;
    incrementViewsById(id: number): Promise<BookDto>;
    getTopViewedBooks(limit: number): Promise<BookDto[]>;
}