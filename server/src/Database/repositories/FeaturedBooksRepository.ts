import { ResultSetHeader, RowDataPacket } from "mysql2";
import { FeaturedBooks } from "../../Domain/models/FeaturedBooks";
import { IFeaturedBooksRepository } from "../../Domain/repositories/IFeaturedBooksRepository";
import db from "../connection/DbConnectionPool";
import { Book } from "../../Domain/models/Book";

export class FeaturedBooksRepository implements IFeaturedBooksRepository {
    async create(featured_books: FeaturedBooks): Promise<FeaturedBooks> {
        try {
            const featuredAt = featured_books.featured_at || new Date();
            const query = `INSERT INTO featured_books (book_id, editor_id, featured_at) VALUES (?, ?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                featured_books.book_id,
                featured_books.editor_id,
                featuredAt
            ]);

            if (result.insertId) {
                return new FeaturedBooks(result.insertId, featured_books.book_id, featured_books.editor_id, featuredAt);
            }

            return new FeaturedBooks();
        } catch (error) {
            console.error('Error creating featured book: ', error);
            return new FeaturedBooks();
        }
    }


    async getById(id: number): Promise<FeaturedBooks> {
        try {
            const query = `SELECT * FROM featured_books WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new FeaturedBooks(row.id, row.book_id, row.editor_id, row.featured_at);
            }

            return new FeaturedBooks(); // nije našao
        }
        catch (error) {
            console.error("Error fetching featured book by id:", error);
            return new FeaturedBooks();
        }
    }

    async getByBookId(id: number): Promise<FeaturedBooks & { book: Book } | null> {
        try {
            const query = `
            SELECT 
                fb.id AS featured_id,
                fb.book_id AS fb_book_id,
                fb.editor_id,
                fb.featured_at,
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
            FROM featured_books fb
            JOIN books b ON fb.book_id = b.id
            WHERE fb.book_id = ?
        `;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length === 0) return null;

            const row = rows[0];

            return {
                id: row.featured_id,
                book_id: row.fb_book_id,
                editor_id: row.editor_id,
                featured_at: row.featured_at,
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
            console.error("Error fetching featured book with book details:", error);
            return null;
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
    async getAll(limit: number): Promise<(FeaturedBooks & { book: Book })[]> {
        try {
            const query = `
            SELECT 
                fb.id              AS featured_id,
                fb.book_id,
                fb.editor_id,
                fb.featured_at,
                b.id               AS book_id,
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
            FROM featured_books fb
            JOIN books b ON fb.book_id = b.id
            ORDER BY fb.featured_at DESC
            LIMIT ${limit}
        `;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(row => ({
                id: row.featured_id,
                book_id: row.book_id,
                editor_id: row.editor_id,
                featured_at: row.featured_at,
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
            console.error("Error fetching featured books with details:", error);
            return [];
        }
    }

    async update(featured_books: FeaturedBooks): Promise<FeaturedBooks> {
        try {
            const query = `UPDATE featured_books SET book_id = ?, editor_id = ?, featured_at = ? WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                featured_books.book_id,
                featured_books.editor_id,
                featured_books.featured_at,
                featured_books.id
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
            const query = `DELETE FROM featured_books WHERE book_id = ?`;

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