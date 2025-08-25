import type { BookDto } from "../../models/books/BookDto";

export interface IBooksApiService {
    getAllBooks(): Promise<BookDto[]>;
    getAllBooksByGenre(genre_id: number): Promise<BookDto[]>;
    getBookByTitle(title: string): Promise<BookDto>;
    getBookByAuthor(author: string): Promise<BookDto>;
    getBookById(id: number): Promise<BookDto>;
    createBook(token: string, title: string, author: string, summary: string, format: string, pages: number, script: string,
        binding: string, publish_date: string, isbn: string, cover_image_url: string, genre_ids: number[]): Promise<BookDto>;
    updateBook(token: string, id: number, updates: Partial<BookDto>): Promise<BookDto>;
    deleteBook(token: string, id: number): Promise<boolean>;
    incrementViews(id: number): Promise<BookDto>;
}