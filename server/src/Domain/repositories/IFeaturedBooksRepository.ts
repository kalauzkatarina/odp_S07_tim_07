import { Book } from "../models/Book";
import { FeaturedBooks } from "../models/FeaturedBooks";

export interface IFeaturedBooksRepository {
    create(featured_books: FeaturedBooks): Promise<FeaturedBooks>;
    getById(id: number): Promise<FeaturedBooks>;
    getByBookId(id: number): Promise<FeaturedBooks & { book: Book } | null>;
    getByEditorId(id: number): Promise<FeaturedBooks>;
    getAll(limit: number): Promise<(FeaturedBooks & { book: Book })[]>; update(featured_books: FeaturedBooks): Promise<FeaturedBooks>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}