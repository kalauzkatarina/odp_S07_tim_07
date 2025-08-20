import { BookDto } from "../../Domain/DTOs/books/BookDto";
import { Book } from "../../Domain/models/Book";
import { IBookRepository } from "../../Domain/repositories/IBooksRepository";
import { IBookService } from "../../Domain/services/books/IBookService";

export class BookService implements IBookService {
    public constructor(private bookRepository: IBookRepository) { }

    async getAllBooks(filters?: { title?: string; author?: string; genre?: string; }): Promise<BookDto[]> {
        const books: Book[] = await this.bookRepository.getAll(filters);
        return books.map(b => new BookDto(
            b.id, b.title, b.summary, b.format, b.pages, b.script, b.binding,
            b.publish_date, b.isbn, b.cover_image_url, b.created_at, b.views
        ));
    }

    async getBookByTitle(title: string): Promise<BookDto> {
        const book = await this.bookRepository.getByTitle(title);
        if (book.id !== 0) {
            return new BookDto(
                book.id, book.title, book.summary, book.format, book.pages, book.script, book.binding,
                book.publish_date, book.isbn, book.cover_image_url, book.created_at, book.views
            );
        }
        return new BookDto();
    }

    async createBook(book: BookDto): Promise<BookDto> {
        const newBook = await this.bookRepository.create(
            new Book(
                0, book.title, book.summary, book.format, book.pages, book.script, book.binding,
                book.publish_date, book.isbn, book.cover_image_url, book.created_at, book.views
            )
        );

        return new BookDto(
            newBook.id, newBook.title, newBook.summary, newBook.format, newBook.pages, newBook.script, newBook.binding,
            newBook.publish_date, newBook.isbn, newBook.cover_image_url, newBook.created_at, newBook.views
        );
    }

    async updateBook(title: string, updates: Partial<BookDto>): Promise<BookDto> {
        const existingBook = await this.bookRepository.getByTitle(title);
        if (existingBook.id === 0) return new BookDto();

        const updatedBook = new Book(
            existingBook.id,
            updates.title || existingBook.title,
            updates.summary || existingBook.summary,
            updates.format || existingBook.format,
            updates.pages || existingBook.pages,
            updates.script || existingBook.script,
            updates.binding || existingBook.binding,
            updates.publish_date || existingBook.publish_date,
            updates.isbn || existingBook.isbn,
            updates.cover_image_url || existingBook.cover_image_url,
            existingBook.created_at,
            updates.views ?? existingBook.views
        );

        const savedBook = await this.bookRepository.update(updatedBook);
        return new BookDto(
            savedBook.id, savedBook.title, savedBook.summary, savedBook.format, savedBook.pages, savedBook.script,
            savedBook.binding, savedBook.publish_date, savedBook.isbn, savedBook.cover_image_url, savedBook.created_at, savedBook.views
        );
    }

    async deleteBook(id: number): Promise<boolean> {
        return this.bookRepository.delete(id);
    }

    async incrementViews(title: string): Promise<BookDto> {
        const book = await this.bookRepository.getByTitle(title);
        if (book.id === 0) return new BookDto();

        book.views += 1;
        const updatedBook = await this.bookRepository.update(book);

        return new BookDto(
            updatedBook.id, updatedBook.title, updatedBook.summary, updatedBook.format, updatedBook.pages,
            updatedBook.script, updatedBook.binding, updatedBook.publish_date, updatedBook.isbn, updatedBook.cover_image_url,
            updatedBook.created_at, updatedBook.views
        );
    }

}