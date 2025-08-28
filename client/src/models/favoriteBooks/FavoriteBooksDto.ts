import type { BookDto } from "../books/BookDto";

export interface FavoriteBooksDto{
    id          : number;
    book_id     : number;
    user_id   : number;
    book        : BookDto;
}