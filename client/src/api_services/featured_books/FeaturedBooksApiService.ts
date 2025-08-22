import axios from "axios";
import type { FeaturedBooksDto } from "../../models/featured_books/FeaturedBooksDto";
import type { IFeaturedBooksService } from "./IFeaturedBooksApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "featured_book";

const emptyFeaturedBook: FeaturedBooksDto = {
    id: 0,
    book_id: 0,
    editor_id: 0
};

export const featuredBooksApi: IFeaturedBooksService = {
    async getAllFeaturedBooks(): Promise<FeaturedBooksDto[]> {
        try {
            const res = await axios.get<FeaturedBooksDto[]>(`${API_URL}s`);
            return res.data;
        }
        catch {
            return [];
        }
    },
    async addFeaturedBook(token: string, bookId: number, editorId: number): Promise<FeaturedBooksDto> {
        try {
            const res = await axios.post<FeaturedBooksDto>(
                `${API_URL}s`,
                {
                    bookId,
                    editorId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch {
            return emptyFeaturedBook;
        }
    },
    async removeFeaturedBook(token: string, id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return true;
        } catch {
            return false;
        }
    }
}