import axios from "axios";
import type { FeaturedBooksDto } from "../../models/featured_books/FeaturedBooksDto";
import type { IFeaturedBooksService } from "./IFeaturedBooksApiService";
import type { BookDto } from "../../models/books/BookDto";

// API_URL treba da bude nešto poput "http://localhost:4000/api/v1/"
const API_URL: string = import.meta.env.VITE_API_URL + "featuredBooks";

const emptyBook: BookDto = {
    id: 0,
    title: "",
    author: "",
    summary: "",
    format: "",
    pages: 0,
    script: "",
    binding: "",
    publish_date: "",
    isbn: "",
    cover_image_url: "",
    views: 0,
    genres: []
};

const emptyFeaturedBook: FeaturedBooksDto = {
    id: 0,
    book_id: 0,
    editor_id: 0,
    book: emptyBook
};

export const featuredBooksApi: IFeaturedBooksService = {
    async getAllFeaturedBooks(): Promise<BookDto[]> {
        try {
            const res = await axios.get<FeaturedBooksDto[]>(`${API_URL}/getAllFeaturedBooks`);
            return res.data.map(fb => fb.book);
        } catch {
            return [];
        }
    },

    async addFeaturedBook(token: string, bookId: number, editorId: number): Promise<FeaturedBooksDto> {
        try {
            const res = await axios.post<FeaturedBooksDto>(
                `${API_URL}/addFeaturedBook`,
                { bookId, editorId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return res.data;
        } catch {
            return emptyFeaturedBook;
        }
    },

    async removeFeaturedBook(token: string, id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/removeFeaturedBook/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return true;
        } catch {
            return false;
        }
    }
};
