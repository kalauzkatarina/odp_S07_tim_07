import { FeaturedBooks } from "../models/FeaturedBooks";

export interface IFeaturedBooksRepository {
    create(featured_books: FeaturedBooks): Promise<FeaturedBooks>;
    getById(id: number): Promise<FeaturedBooks>;
    getByBookId(id: number): Promise<FeaturedBooks>;
    getByEditorId(id: number): Promise<FeaturedBooks>;
    getAll(): Promise<FeaturedBooks[]>;
    update(featured_books: FeaturedBooks): Promise<FeaturedBooks>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}