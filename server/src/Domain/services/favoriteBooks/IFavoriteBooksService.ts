import { FavoriteBooksDto } from "../../DTOs/favoriteBooks/FavoriteBooksDto"

export interface IFavoriteBookService {
    getAllFavoriteBooks(favorite: boolean): Promise<FavoriteBooksDto[]>;
    getFavoritesByUserId(userId: number): Promise<FavoriteBooksDto[]>;
    addFavoriteBook(bookId: number, userId: number): Promise<FavoriteBooksDto>;
    removeFavoriteBook(bookId: number, userId: number): Promise<boolean>
}