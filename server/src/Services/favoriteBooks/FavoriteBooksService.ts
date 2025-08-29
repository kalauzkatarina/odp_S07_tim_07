import { IFavoriteBookService } from "../../Domain/services/favoriteBooks/IFavoriteBooksService";
import { FavoriteBooks } from "../../Domain/models/FavoriteBooks";
import { IFavoriteBooksRepository } from "../../Domain/repositories/IFavoriteBooksRepository";
import { IBookRepository } from "../../Domain/repositories/IBooksRepository";
import { FavoriteBooksDto } from "../../Domain/DTOs/favoriteBooks/FavoriteBooksDto";

export class FavoriteBookService implements IFavoriteBookService {
    public constructor(
        private favoriteBookRepository: IFavoriteBooksRepository,
        private bookRepository: IBookRepository
    ) { }

    async getAllFavoriteBooks(favorite: boolean): Promise<FavoriteBooksDto[]> {
        const favorites = await this.favoriteBookRepository.getAll(favorite);

        return favorites.map(fb => new FavoriteBooksDto(
            fb.id,
            fb.book_id,
            fb.user_id,
            fb.book
        ));
    }

    async getFavoritesByUserId(userId: number): Promise<FavoriteBooksDto[]> {
    // Dohvati sve favorite zapise za datog korisnika
    const favorites = await this.favoriteBookRepository.getByUserId(userId);

    // Mapiraj u DTO
    return favorites.map(fb => new FavoriteBooksDto(
        fb.id,
        fb.book_id,
        fb.user_id,
        fb.book
    ));
}


    async addFavoriteBook(bookId: number, userId: number): Promise<FavoriteBooksDto> {
        const existing = await this.favoriteBookRepository.getByBookId(bookId);

        if (existing && existing.id) {
            existing.favorite = true;
            const updated = await this.favoriteBookRepository.update(existing);
            const book = await this.bookRepository.getBookById(bookId);

            if (!book || !book.id) {
                throw new Error("Knjiga nije pronađena.");
            }

            return new FavoriteBooksDto(updated.id, updated.book_id, updated.user_id, book);
        }

        const newFavorite = await this.favoriteBookRepository.create(
            new FavoriteBooks(0, bookId, userId, true)
        );

        const book = await this.bookRepository.getBookById(bookId);
        if (!book || !book.id) {
            throw new Error("Knjiga nije pronađena.");
        }

        return new FavoriteBooksDto(newFavorite.id, newFavorite.book_id, newFavorite.user_id, book);
    }

    async removeFavoriteBook(bookId: number, userId: number): Promise<boolean> {
    // Pronađi favorite zapis za tog korisnika i knjigu
    const favorite = await this.favoriteBookRepository.getByBookId(bookId);

    if (!favorite || favorite.user_id !== userId) {
        throw new Error("Favorite zapis nije pronađen za ovog korisnika.");
    }

    // Stvarno brisanje iz baze
    return await this.favoriteBookRepository.delete(favorite.id);
}

}
