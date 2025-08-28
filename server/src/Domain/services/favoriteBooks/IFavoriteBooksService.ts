import { FavoriteBooksDto } from "../../DTOs/favoriteBooks/FavoriteBooksDto"

export interface IFavoriteBookService{
    getAllFavoriteBooks(favorite: boolean): Promise<FavoriteBooksDto[]>;
    addFavoriteBook(bookId: number, userId: number): Promise<FavoriteBooksDto>;
    removeFavoriteBook(id: number): Promise<boolean>;
}