import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Book } from "../../Domain/models/Book";
import { FavoriteBooks } from "../../Domain/models/FavoriteBooks";
import { IFavoriteBooksRepository } from "../../Domain/repositories/IFavoriteBooksRepository";
import db from "../connection/DbConnectionPool";

export class FavoriteBooksRepository implements IFavoriteBooksRepository{
    async create(favorite_books: FavoriteBooks): Promise<FavoriteBooks> {
        try {
            const query = `INSERT INTO favorite_books (book_id, user_id, favorite) VALUES (?, ?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                favorite_books.book_id,
                favorite_books.user_id,
                favorite_books.favorite
            ]);

            if (result.insertId) {
                return new FavoriteBooks(result.insertId, favorite_books.book_id, favorite_books.user_id, favorite_books.favorite);
            }

            return new FavoriteBooks();
        } catch (error) {
            console.error("Error creating favorite book: ", error);
            return new FavoriteBooks();
        }
    }
    async getById(id: number): Promise<FavoriteBooks> {
        try {
            const query = `SELECT * FROM favorite_books WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new FavoriteBooks(row.id, row.book_id, row.user_id, row.favorite);
            }

            return new FavoriteBooks();
        } catch (error) {
            console.error("Error fetching favorite book by id: ", error);
            return new FavoriteBooks();
        }
    }
    async getByBookId(id: number): Promise<(FavoriteBooks & { book: Book; }) | null> {
        try {
            const query = `
                SELECT 
                    fb.id AS favorite_id,
                    fb.book_id AS fb_book_id,
                    fb.user_id,
                    fb.favorite,
                    b.id AS book_id,
                    b.title,
                    b.author,
                    b.summary,
                    b.format,
                    b.pages,
                    b.script,
                    b.binding,
                    b.publish_date,
                    b.isbn,
                    b.cover_image_url,
                    b.created_at,
                    b.views
                FROM favorite_books fb
                JOIN books b ON fb.book_id = b.id
                WHERE fb.book_id = ?
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length === 0) return null;

            const row = rows[0];

            return {
                id: row.favorite_id,
                book_id: row.fb_book_id,
                user_id: row.user_id,
                favorite: !!row.favorite,
                book: new Book(
                    row.book_id,
                    row.title,
                    row.author,
                    row.summary,
                    row.format,
                    row.pages,
                    row.script,
                    row.binding,
                    row.publish_date,
                    row.isbn,
                    row.cover_image_url,
                    row.created_at,
                    row.views
                )
            };
        } catch (error) {
            console.error("Error fetching favorite book with book details:", error);
            return null;
        }
    }
    async getByUserId(id: number): Promise<FavoriteBooks> {
        try {
            const query = `SELECT * FROM favorite_books WHERE user_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new FavoriteBooks(row.id, row.book_id, row.user_id, row.favorite);
            }

            return new FavoriteBooks();
        } catch (error) {
            console.error("Error fetching favorite books by user id: ", error);
            return new FavoriteBooks();
        }
    }
    async getAll(favorite: boolean): Promise<(FavoriteBooks & { book: Book; })[]> {
        try {
            const query = `
                SELECT 
                    fb.id AS favorite_id,
                    fb.book_id,
                    fb.user_id,
                    fb.favorite,
                    b.id AS book_id,
                    b.title,
                    b.author,
                    b.summary,
                    b.format,
                    b.pages,
                    b.script,
                    b.binding,
                    b.publish_date,
                    b.isbn,
                    b.cover_image_url,
                    b.created_at,
                    b.views
                FROM favorite_books fb
                JOIN books b ON fb.book_id = b.id
                WHERE fb.favorite = ?
                ORDER BY fb.id DESC
            `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [favorite]);

            return rows.map(row => ({
                id: row.favorite_id,
                book_id: row.book_id,
                user_id: row.user_id,
                favorite: !!row.favorite,
                book: new Book(
                    row.book_id,
                    row.title,
                    row.author,
                    row.summary,
                    row.format,
                    row.pages,
                    row.script,
                    row.binding,
                    row.publish_date,
                    row.isbn,
                    row.cover_image_url,
                    row.created_at,
                    row.views
                )
            }));
        } catch (error) {
            console.error("Error fetching favorite books with details:", error);
            return [];
        }
    }
    async update(favorite_books: FavoriteBooks): Promise<FavoriteBooks> {
        try {
            const query = `UPDATE favorite_books SET book_id = ?, user_id = ?, favorite = ? WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                favorite_books.book_id,
                favorite_books.user_id,
                favorite_books.favorite,
                favorite_books.id
            ]);

            if (result.affectedRows > 0) {
                return favorite_books;
            }

            return new FavoriteBooks();
        } catch (error) {
            console.error("Error updating favorite book: ", error);
            return new FavoriteBooks();
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM favorite_books WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting favorite book: ", error);
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*) as count FROM favorite_books WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        } catch (error) {
            console.error("Error checking if favorite book exists: ", error);
            return false;
        }
    }
    
}