import type { FavoriteBooksDto } from "../../models/favoriteBooks/FavoriteBooksDto";

export interface IFavoriteBooksService {
    getAllFavoriteBooks(token: string): Promise<FavoriteBooksDto[]>;
    getFavoriteBooksByUserId(token: string, userId: number): Promise<FavoriteBooksDto[]>
    addFavoriteBook(token: string, bookId: number, editorId: number): Promise<FavoriteBooksDto>;
    removeFavoriteBook(token: string, bookId: number, userId: number): Promise<boolean>;
}