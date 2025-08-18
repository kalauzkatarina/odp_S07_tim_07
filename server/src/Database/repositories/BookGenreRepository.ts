import { ResultSetHeader, RowDataPacket } from "mysql2";
import { BookGenre } from "../../Domain/models/BookGenre";
import { IBookGenreRepository } from "../../Domain/repositories/IBookGenreRepository";
import db from "../connection/db_connection_pool";

export class BookGenreRepository implements IBookGenreRepository {
    async create(book_genre: BookGenre): Promise<BookGenre> {
        try {
            const query = `INSERT INTO book_genres (book_id, genre_id) VALUES (?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                book_genre.book_id,
                book_genre.genre_id
            ]);

            if (result.insertId) {
                return new BookGenre(book_genre.book_id, book_genre.genre_id);
            }

            return new BookGenre();
        }
        catch (error) {
            console.error('Error creating book genre: ', error);
            return new BookGenre();
        }
    }
    async getByBookId(id: number): Promise<BookGenre> {
        try {
            const query = `SELECT * FROM book_genres WHERE book_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new BookGenre(row.book_id, row.genre_id);
            }

            return new BookGenre();
        }
        catch {
            return new BookGenre();
        }
    }
    async getByGenreId(id: number): Promise<BookGenre> {
        try {
            const query = `SELECT * FROM book_genres WHERE genre_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new BookGenre(row.book_id, row.genre_id);
            }

            return new BookGenre();
        }
        catch {
            return new BookGenre();
        }
    }
    async getAll(): Promise<BookGenre[]> {
        try {
            const query = `SELECT * FROM book_genres ORDER BY book_id ASC`;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new BookGenre(row.book_id, row.genre_id)
            );
        }
        catch {
            return [];
        }
    }
    async update(book_genre: BookGenre): Promise<BookGenre> {
        try {
            const query = `UPDATE book_genres SET book_id = ?, genre_id = ? WHERE book_id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                book_genre.book_id,
                book_genre.genre_id
            ]);

            if (result.affectedRows > 0) {
                return book_genre;
            }

            return new BookGenre();
        }
        catch {
            return new BookGenre();
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM book_genres WHERE book_id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch {
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*) as count FROM book_genress = ? WHERE book_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        } catch {
            return false;
        }
    }

}