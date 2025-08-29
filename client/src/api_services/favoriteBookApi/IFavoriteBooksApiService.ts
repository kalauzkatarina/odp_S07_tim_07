import type { BookDto } from "../../models/books/BookDto";
import type { FavoriteBooksDto } from "../../models/favoriteBooks/FavoriteBooksDto";

export interface IFavoriteBooksService{
    getAllFavoriteBooks(token: string): Promise<BookDto[]>;
    addFavoriteBook(token: string, bookId: number, editorId: number): Promise<FavoriteBooksDto>;
    removeFavoriteBook(token: string, id: number): Promise<boolean>;
}