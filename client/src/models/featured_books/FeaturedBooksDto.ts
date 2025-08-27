import type { BookDto } from "../books/BookDto";

export interface FeaturedBooksDto{
    id          : number;
    book_id     : number;
    editor_id   : number;
    book        : BookDto;
}