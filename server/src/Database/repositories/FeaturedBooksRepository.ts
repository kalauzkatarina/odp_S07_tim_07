import { ResultSetHeader, RowDataPacket } from "mysql2";
import { FeaturedBooks } from "../../Domain/models/FeaturedBooks";
import { IFeaturedBooksRepository } from "../../Domain/repositories/IFeaturedBooksRepository";
import db from "../connection/DbConnectionPool";

export class FeaturedBooksRepository implements IFeaturedBooksRepository {
    async create(featured_books: FeaturedBooks): Promise<FeaturedBooks> {
        try {
            const query = `INSERT INTO featured_books (book_id, editor_id, featured_at) VALUES (?, ?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                featured_books.book_id,
                featured_books.editor_id,
                featured_books.featured_at
            ]);

            if (result.insertId) {
                return new FeaturedBooks(result.insertId, featured_books.book_id, featured_books.editor_id, featured_books.featured_at);
            }

            return new FeaturedBooks();
        }
        catch (error) {
            console.error('Error creating featured book: ', error);
            return new FeaturedBooks();
        }
    }
    async getByBookId(id: number): Promise<FeaturedBooks> {
        try {
            const query = `SELECT * FROM featured_books WHERE book_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new FeaturedBooks(row.book_id, row.editor_id, row.featured_at);
            }

            return new FeaturedBooks();
        }
        catch {
            return new FeaturedBooks();
        }
    }
    async getByEditorId(id: number): Promise<FeaturedBooks> {
        try {
            const query = `SELECT * FROM featured_books WHERE editor_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new FeaturedBooks(row.book_id, row.editor_id, row.featured_at);
            }

            return new FeaturedBooks();
        }
        catch {
            return new FeaturedBooks();
        }
    }
    async getAll(): Promise<FeaturedBooks[]> {
        try {
            const query = `SELECT * FROM featured_books ORDER BY id ASC`;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new FeaturedBooks(row.id, row.book_id, row.editor_id, row.featured_at)
            );
        }
        catch {
            return [];
        }
    }
    async update(featured_books: FeaturedBooks): Promise<FeaturedBooks> {
        try {
            const query = `UPDATE users SET book_id = ?, editor_id = ?, featured_at = ? WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                featured_books.book_id,
                featured_books.editor_id,
                featured_books.featured_at
            ]);

            if (result.affectedRows > 0) {
                return featured_books;
            }

            return new FeaturedBooks();
        }
        catch {
            return new FeaturedBooks();
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM featured_books WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch {
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*) as count FROM featured_books WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        } catch {
            return false;
        }
    }

}