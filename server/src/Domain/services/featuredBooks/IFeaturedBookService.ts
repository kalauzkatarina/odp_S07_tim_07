import { FeaturedBookDto } from "../../DTOs/featuredBooks/FeaturedBookDto";

export interface IFeaturedBookService {
    getAllFeaturedBooks(): Promise<FeaturedBookDto[]>;
    getFeaturedBookById(id: number): Promise<FeaturedBookDto>;
    addFeaturedBook(bookId: number, editorId: number): Promise<FeaturedBookDto>;
    removeFeaturedBook(id: number): Promise<boolean>;
}