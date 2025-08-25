import axios from "axios";
import type { BookDto } from "../../models/books/BookDto";
import type { IBooksApiService } from "./IBooksApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "book";

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
    genres: [],
};

export const booksApi: IBooksApiService = {
    async getAllBooks(): Promise<BookDto[]> {
        try {
            const res = await axios.get<BookDto[]>(`${API_URL}s`);
            return res.data;
        }
        catch {
            return [];
        }
    },
    async getAllBooksByGenre(genre_id: number): Promise<BookDto[]> {
        try {
            const res = await axios.get<BookDto[]>(`${API_URL}s/genre/${genre_id}`);
            return res.data;
        } catch {
            return [];
        }
    },
    async getBookByTitle(title: string): Promise<BookDto> {
        try {
            const res = await axios.get<BookDto>(`${API_URL}s/title/${encodeURIComponent(title)}`);
            return res.data;
        } catch {
            return emptyBook;
        }
    },
    async getBookByAuthor(author: string): Promise<BookDto> {
        try {
            const res = await axios.get<BookDto>(`${API_URL}s/author/${encodeURIComponent(author)}`);
            return res.data;
        } catch {
            return emptyBook;
        }
    },

    async getBookById(id: number): Promise<BookDto> {
        try {
            const res = await axios.get<BookDto>(`${API_URL}s/${id}`);
            return res.data;
        } catch {
            return emptyBook;
        }
    },

    async createBook(token: string, title: string, author: string, summary: string, format: string, pages: number, script: string, binding: string, publish_date: string, isbn: string, cover_image_url: string, genre_ids: number[]): Promise<BookDto> {
        try {
            const res = await axios.post<BookDto>(
                `${API_URL}s/add`,
                {
                    title,
                    author,
                    summary,
                    format,
                    pages,
                    script,
                    binding,
                    publish_date,
                    isbn,
                    cover_image_url,
                    genres: genre_ids,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch {
            return emptyBook;
        }
    },
    async updateBook(token: string, title: string, updates: Partial<BookDto>): Promise<BookDto> {
        try {
            const res = await axios.put<BookDto>(
                `${API_URL}s/title/${encodeURIComponent(title)}`,
                updates,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch {
            return emptyBook;
        }
    },
    async deleteBook(token: string, id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}s/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return true;
        } catch {
            return false;
        }
    },
    async incrementViews(id: number): Promise<BookDto> {
        try {
            const res = await axios.patch<BookDto>(`${API_URL}s/${id}/views`);
            return res.data;
        } catch {
            return emptyBook;
        }
    }
}