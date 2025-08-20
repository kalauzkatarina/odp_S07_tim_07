import { AuthorDto } from "../../Domain/DTOs/authors/AuthorDto";
import { BookDto } from "../../Domain/DTOs/books/BookDto";
import { GenreDto } from "../../Domain/DTOs/genres/GenreDto";
import { Book } from "../../Domain/models/Book";
import { IAuthorRepository } from "../../Domain/repositories/IAuthorRepository";
import { IBookAuthorRepository } from "../../Domain/repositories/IBookAuthorRepository";
import { IBookGenreRepository } from "../../Domain/repositories/IBookGenreRepository";
import { IBookRepository } from "../../Domain/repositories/IBooksRepository";
import { IGenreRepository } from "../../Domain/repositories/IGenreRepository";
import { IBookService } from "../../Domain/services/books/IBookService";

export class BookService implements IBookService {
    public constructor(
        private bookRepository: IBookRepository,
        private bookAuthorRepository: IBookAuthorRepository,
        private bookGenreRepository: IBookGenreRepository,
        private authorRepository: IAuthorRepository,
        private genreRepository: IGenreRepository
    ) { }


    async getAllBooks(filters?: { title?: string; author?: string; genre?: string; }): Promise<BookDto[]> {
        const books: Book[] = await this.bookRepository.getAll(filters);

        const bookDtos: BookDto[] = [];
        for (const b of books) {
            const dto = await this.mapToDto(b);
            bookDtos.push(dto);
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

    async createBook(book: Book): Promise<BookDto> {
        const newBook = await this.bookRepository.create(
            new Book(
                0, book.title, book.summary, book.format, book.pages, book.script, book.binding,
                book.publish_date, book.isbn, book.cover_image_url, book.created_at, book.views
            )
        );
        return this.mapToDto(newBook);
    }

    async updateBook(title: string, updates: Partial<BookDto>): Promise<BookDto> {
        const existingBook = await this.bookRepository.getByTitle(title);
        
        if (existingBook.id === 0) return new BookDto();

        const updatedBook = new Book(
            existingBook.id,
            updates.title           || existingBook.title,
            updates.summary         || existingBook.summary,
            updates.format          || existingBook.format,
            updates.pages           || existingBook.pages,
            updates.script          || existingBook.script,
            updates.binding         || existingBook.binding,
            updates.publish_date    || existingBook.publish_date,
            updates.isbn            || existingBook.isbn,
            updates.cover_image_url || existingBook.cover_image_url,
            existingBook.created_at,
            updates.views           || existingBook.views
        );

        const savedBook = await this.bookRepository.update(updatedBook);
        return this.mapToDto(savedBook);
    }

    async deleteBook(id: number): Promise<boolean> {
        return this.bookRepository.delete(id);
    }

    async incrementViews(title: string): Promise<BookDto> {
        const book = await this.bookRepository.getByTitle(title);
        if (book.id === 0) return new BookDto();

        book.views += 1;
        const updatedBook = await this.bookRepository.update(book);
        return this.mapToDto(updatedBook);
    }

    //mapiranje knjige u BookDto sa autorima i zanrovima

    private async mapToDto(book: Book): Promise<BookDto> {
        //nadji sve autore povezane sa knjigom
        const bookAuthors = await this.bookAuthorRepository.getByBookId(book.id);
        const authors: AuthorDto[] = [];

        for(const ba of Array.isArray(bookAuthors) ? bookAuthors : [bookAuthors]) {
            if(ba.author_id){
                const author = await this.authorRepository.getById(ba.author_id);
                if(author.id !== 0){
                    authors.push(new AuthorDto(author.id, author.first_name, author.last_name));
                }
            }
        }

        //nadji sve zanrove povezane sa knjigom
        const bookGenres = await this.bookGenreRepository.getByBookId(book.id);
        const genres: GenreDto[] = [];

        for(const bg of Array.isArray(bookGenres) ? bookGenres : [bookGenres]){
            if(bg.genre_id){
                const genre = await this.genreRepository.getById(bg.genre_id);
                if(genre.id !== 0){
                    genres.push(new GenreDto(genre.id, genre.name));
                }
            }
        }

        //vrati kompletan DTO
        return new BookDto(
            book.id, book.title, book.summary, book.format, book.pages, book.script, book.binding,
            book.publish_date, book.isbn, book.cover_image_url, book.views,
            authors,
            genres
        );
    }
}