import { BookDto } from "../../DTOs/books/BookDto";

export interface IBookService {
    getAllBooks(filters?: { title?: string; author?: string; genre?: string }): Promise<BookDto[]>;
    getBookByTitle(title: string): Promise<BookDto>;
    createBook(book: BookDto): Promise<BookDto>;
    updateBook(title: string, updates: Partial<BookDto>): Promise<BookDto>;
    deleteBook(id: number): Promise<boolean>;
    incrementViews(title: string): Promise<BookDto>;
}