import { BookDto } from "../../DTOs/books/BookDto";
import { Book } from "../../models/Book";

export interface IBookService {
    getAllBooks(filters?: { title?: string; author?: string; genre?: string }): Promise<BookDto[]>;
    getBookByTitle(title: string): Promise<BookDto>;
    createBook(book: Book): Promise<BookDto>;
    updateBook(title: string, updates: Partial<BookDto>): Promise<BookDto>;
    deleteBook(id: number): Promise<boolean>;
    incrementViews(title: string): Promise<BookDto>;
}