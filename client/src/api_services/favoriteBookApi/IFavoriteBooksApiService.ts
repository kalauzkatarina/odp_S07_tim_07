import type { FavoriteBooksDto } from "../../models/favoriteBooks/FavoriteBooksDto";

export interface IFavoriteBooksService{
    getAllFavoriteBooks(token: string): Promise<FavoriteBooksDto[]>;
    addFavoriteBook(token: string, bookId: number, editorId: number): Promise<FavoriteBooksDto>;
    removeFavoriteBook(token: string, id: number): Promise<boolean>;
}