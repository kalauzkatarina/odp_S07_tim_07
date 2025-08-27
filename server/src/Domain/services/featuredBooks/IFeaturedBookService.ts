import { FeaturedBookDto } from "../../DTOs/featuredBooks/FeaturedBookDto";
import { Book } from "../../models/Book";

export interface IFeaturedBookService {
    getAllFeaturedBooks(limit: number): Promise<FeaturedBookDto[]>;
    addFeaturedBook(bookId: number, editorId: number): Promise<FeaturedBookDto>;
    removeFeaturedBook(id: number): Promise<boolean>;
}