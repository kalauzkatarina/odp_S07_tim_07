import { ResultSetHeader, RowDataPacket } from "mysql2";
import { BookAuthor } from "../../Domain/models/BookAuthor";
import { IBookAuthorRepository } from "../../Domain/repositories/IBookAuthorRepository";
import db from "../connection/DbConnectionPool";

export class BookAuthorRepository implements IBookAuthorRepository {
    async create(book_author: BookAuthor): Promise<BookAuthor> {
        try {
            const query = `INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                book_author.book_id,
                book_author.author_id
            ]);

            if (result.insertId) {
                return new BookAuthor(book_author.book_id, book_author.author_id);
            }

            return new BookAuthor();
        }
        catch (error) {
            console.error('Error creating book author: ', error);
            return new BookAuthor();
        }
    }
    async getByBookId(id: number): Promise<BookAuthor> {
        try {
            const query = `SELECT * FROM book_authors WHERE book_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new BookAuthor(row.book_id, row.author_id);
            }

            return new BookAuthor();
        }
        catch {
            return new BookAuthor();
        }
    }
    async getByAuthorId(id: number): Promise<BookAuthor> {
        try {
            const query = `SELECT * FROM book_authors WHERE author_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new BookAuthor(row.book_id, row.author_id);
            }

            return new BookAuthor();
        }
        catch {
            return new BookAuthor();
        }
    }
    async getAll(): Promise<BookAuthor[]> {
        try {
            const query = `SELECT * FROM book_authors ORDER BY book_id ASC`;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new BookAuthor(row.book_id, row.author_id)
            );
        }
        catch {
            return [];
        }
    }
    async update(book_author: BookAuthor): Promise<BookAuthor> {
        try {
            const query = `UPDATE book_authors SET book_id = ?, author_id = ? WHERE book_id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                book_author.book_id,
                book_author.author_id
            ]);

            if (result.affectedRows > 0) {
                return book_author;
            }

            return new BookAuthor();
        }
        catch {
            return new BookAuthor();
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM book_authors WHERE book_id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch {
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*) as count FROM book_authors WHERE book_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        } catch {
            return false;
        }
    }

}