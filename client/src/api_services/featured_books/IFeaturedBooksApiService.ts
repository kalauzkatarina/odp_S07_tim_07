import type { FeaturedBooksDto } from "../../models/featured_books/FeaturedBooksDto";

export interface IFeaturedBooksService {
    getAllFeaturedBooks(): Promise<FeaturedBooksDto[]>;
    addFeaturedBook(token: string, bookId: number, editorId: number): Promise<FeaturedBooksDto>;
    removeFeaturedBook(token: string, id: number): Promise<boolean>;
}