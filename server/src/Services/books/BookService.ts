import { BookDto } from "../../Domain/DTOs/books/BookDto";
import { GenreDto } from "../../Domain/DTOs/genres/GenreDto";
import { Book } from "../../Domain/models/Book";
import { IBookGenreRepository } from "../../Domain/repositories/IBookGenreRepository";
import { IBookRepository } from "../../Domain/repositories/IBooksRepository";
import { IGenreRepository } from "../../Domain/repositories/IGenreRepository";
import { IBookService } from "../../Domain/services/books/IBookService";

export class BookService implements IBookService {
    public constructor(
        private bookRepository: IBookRepository,
        private bookGenreRepository: IBookGenreRepository,
        private genreRepository: IGenreRepository
    ) { }


    async getAllBooks(): Promise<BookDto[]> {
        const books: Book[] = await this.bookRepository.getAll();

        const bookDtos: BookDto[] = [];
        for (const b of books) {
            const dto = await this.mapToDto(b);
            bookDtos.push(dto);
        }
        return bookDtos;
    }

    async getAllBooksByGenre(genre_id: number): Promise<BookDto[]> {
        const books = await this.bookRepository.getAllByGenre(genre_id);
        const bookDtos: BookDto[] = [];

        for (const book of books) {
            bookDtos.push(await this.mapToDto(book));
        }

        return bookDtos;
    }

    async getBookByTitle(title: string): Promise<BookDto> {
        const book = await this.bookRepository.getByTitle(title);
        if (book.id !== 0) {
            return this.mapToDto(book);
        }
        return new BookDto();
    }

    async getBookByAuthor(author: string): Promise<BookDto> {
        const book = await this.bookRepository.getByAuthor(author);
        if (book.id !== 0) {
            return this.mapToDto(book);
        }
        return new BookDto();
    }

    async getBookById(id: number): Promise<BookDto> {
        const book = await this.bookRepository.getBookById(id);
        if (book.id === 0) return new BookDto();
        return this.mapToDto(book);
    }

    async createBook(title: string, author: string, summary: string, format: string, pages: number, script: string,
        binding: string, publish_date: string, isbn: string, cover_image_url: string, genre_ids: number[]): Promise<BookDto> {

        const newBook = await this.bookRepository.create(
            new Book(
                0, title, author, summary, format, pages, script, binding,
                publish_date, isbn, cover_image_url, new Date(), 0
            )
        );

        //povezi zanrove
        for (const genre_id of genre_ids) {
            await this.bookGenreRepository.create({
                book_id: newBook.id,
                genre_id: genre_id
            });
        }

        return await this.mapToDto(newBook);
    }

    async updateBook(id: number, updates: Partial<BookDto>): Promise<BookDto> {
        const existingBook = await this.bookRepository.getBookById(id);
        console.log(existingBook);
        if (existingBook.id === 0) return new BookDto();

        const updatedBook = new Book(
            existingBook.id,
            updates.title || existingBook.title,
            updates.author || existingBook.author,
            updates.summary || existingBook.summary,
            updates.format || existingBook.format,
            updates.pages || existingBook.pages,
            updates.script || existingBook.script,
            updates.binding || existingBook.binding,
            updates.publish_date || existingBook.publish_date,
            updates.isbn || existingBook.isbn,
            updates.cover_image_url || existingBook.cover_image_url,
            existingBook.created_at,
            updates.views || existingBook.views
        );

        const savedBook = await this.bookRepository.update(updatedBook);
        return this.mapToDto(savedBook);
    }

    async deleteBook(id: number): Promise<boolean> {
        await this.bookGenreRepository.delete(id);
        return this.bookRepository.delete(id);
    }

    async incrementViewsById(id: number): Promise<BookDto> {
        const book = await this.bookRepository.getBookById(id);
        if (!book) return new BookDto();

        book.views += 1;
        const updatedBook = await this.bookRepository.update(book);
        return this.mapToDto(updatedBook);
    }

    async getTopViewedBooks(limit: number): Promise<BookDto[]> {
        const books = await this.bookRepository.getTopViewed(limit);

        const bookDtos: BookDto[] = [];
        for (const b of books) {
            bookDtos.push(await this.mapToDto(b));
        }

        return bookDtos;
    }

    //mapiranje knjige u BookDto sa zanrovima
    private async mapToDto(book: Book): Promise<BookDto> {
        //nadji sve zanrove povezane sa knjigom
        const bookGenres = await this.bookGenreRepository.getByBookId(book.id);
        const genres: GenreDto[] = [];

        for (const bg of Array.isArray(bookGenres) ? bookGenres : [bookGenres]) {
            if (bg.genre_id) {
                const genre = await this.genreRepository.getById(bg.genre_id);
                if (genre.id !== 0) {
                    genres.push(new GenreDto(genre.id, genre.name));
                }
            }
        }

        //vrati kompletan DTO
        return new BookDto(
            book.id, book.title, book.author, book.summary, book.format, book.pages, book.script, book.binding,
            book.publish_date, book.isbn, book.cover_image_url, book.views, genres
        );
    }
}