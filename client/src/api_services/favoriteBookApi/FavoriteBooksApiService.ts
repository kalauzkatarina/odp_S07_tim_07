import axios from "axios";
import type { BookDto } from "../../models/books/BookDto";
import type { FavoriteBooksDto } from "../../models/favoriteBooks/FavoriteBooksDto";
import type { IFavoriteBooksService } from "./IFavoriteBooksApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "favoriteBooks";

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

const emptyFavoriteBook: FavoriteBooksDto = {
    id: 0,
    book_id: 0,
    user_id: 0,
    book: emptyBook
};

export const favoriteBooksApi: IFavoriteBooksService = {
    async getAllFavoriteBooks(): Promise<BookDto[]> {
        try {
            const res = await axios.get<FavoriteBooksDto[]>(`${API_URL}/getAllFavoriteBooks`);
            return res.data.map(fb => fb.book);
        } catch {
            return [];
        }
    },

    async addFavoriteBook(token: string, bookId: number, userId: number): Promise<FavoriteBooksDto> {
        try {
            const res = await axios.post<FavoriteBooksDto>(
                `${API_URL}/addFavoriteBook`,
                { bookId, userId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return res.data;
        } catch {
            return emptyFavoriteBook;
        }
    },

    async removeFavoriteBook(token: string, id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/removeFavoriteBook/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return true;
        } catch {
            return false;
        }
    }
};
