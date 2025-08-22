import { FeaturedBookDto } from "../../Domain/DTOs/featuredBooks/FeaturedBookDto";
import { FeaturedBooks } from "../../Domain/models/FeaturedBooks";
import { IFeaturedBooksRepository } from "../../Domain/repositories/IFeaturedBooksRepository";
import { IFeaturedBookService } from "../../Domain/services/featuredBooks/IFeaturedBookService";

export class FeaturedBookService implements IFeaturedBookService {
    public constructor(private featuredBookRepository: IFeaturedBooksRepository) {}
    
    async getAllFeaturedBooks(): Promise<FeaturedBookDto[]> {
        const featuredBooks: FeaturedBooks[] = await this.featuredBookRepository.getAll();
        return featuredBooks.map(fb => new FeaturedBookDto(fb.id, fb.book_id, fb.editor_id));
    }
   
    async addFeaturedBook(bookId: number, editorId: number): Promise<FeaturedBookDto> {
        const newFb = await this.featuredBookRepository.create(new FeaturedBooks(0, bookId, editorId));
        return new FeaturedBookDto(newFb.id, newFb.book_id, newFb.editor_id);    
    }
   
    async removeFeaturedBook(id: number): Promise<boolean> {
        return await this.featuredBookRepository.delete(id);
    }
}