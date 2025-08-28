import { Book } from "../models/Book";
import { FavoriteBooks } from "../models/FavoriteBooks";

export interface IFavoriteBooksRepository{
    create(favorite_books: FavoriteBooks): Promise<FavoriteBooks>;
    getById(id: number): Promise<FavoriteBooks>;
    getByBookId(id: number): Promise<FavoriteBooks & {book : Book} | null>;
    getByUserId(id: number): Promise<FavoriteBooks>;
    getAll(favorite: boolean): Promise<(FavoriteBooks & { book: Book})[]>;
    update(favorite_books: FavoriteBooks): Promise<FavoriteBooks>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}