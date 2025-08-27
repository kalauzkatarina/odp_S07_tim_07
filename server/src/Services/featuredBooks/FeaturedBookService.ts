import { BookDto } from "../../Domain/DTOs/books/BookDto";
import { FeaturedBookDto } from "../../Domain/DTOs/featuredBooks/FeaturedBookDto";
import { Book } from "../../Domain/models/Book";
import { FeaturedBooks } from "../../Domain/models/FeaturedBooks";
import { IBookRepository } from "../../Domain/repositories/IBooksRepository";
import { IFeaturedBooksRepository } from "../../Domain/repositories/IFeaturedBooksRepository";
import { IFeaturedBookService } from "../../Domain/services/featuredBooks/IFeaturedBookService";

export class FeaturedBookService implements IFeaturedBookService {
    public constructor(
        private featuredBookRepository: IFeaturedBooksRepository,
        private bookRepository: IBookRepository
    ) { }

    async getAllFeaturedBooks(limit: number): Promise<FeaturedBookDto[]> {
        const featuredBooks = await this.featuredBookRepository.getAll(limit);
        console.log(featuredBooks);
        
        return featuredBooks.map(fb => new FeaturedBookDto(
            fb.id,
            fb.book_id,
            fb.editor_id,
            fb.book 
        ));
    }

    async addFeaturedBook(bookId: number, editorId: number): Promise<FeaturedBookDto> {
        // Proveri da li knjiga već postoji
        const exists = await this.featuredBookRepository.getByBookId(bookId);
        if (exists && exists.id) {
            throw new Error("Ova knjiga je već dodata u featured.");
        }

        // Kreiraj featured book u bazi
        const newFb = await this.featuredBookRepository.create(new FeaturedBooks(0, bookId, editorId));

        // Dohvati book iz repozitorijuma
        const book = await this.bookRepository.getBookById(bookId);
        if (!book || !book.id) {
            throw new Error("Book nije pronađen.");
        }

        return new FeaturedBookDto(newFb.id, newFb.book_id, newFb.editor_id, book);
    }



    async removeFeaturedBook(id: number): Promise<boolean> {
        return await this.featuredBookRepository.delete(id);
    }
}