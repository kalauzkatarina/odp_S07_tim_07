import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Book } from "../../Domain/models/Book";
import { IBookRepository } from "../../Domain/repositories/IBooksRepository";
import db from "../connection/DbConnectionPool";

export class BookRepository implements IBookRepository {
    async create(book: Book): Promise<Book> {
        try {
            const query = `INSERT INTO books (title, author, genres, summary, format, pages, script, binding, publish_date, isbn, cover_image_url, created_at, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                book.title,
                book.summary,
                book.format,
                book.pages,
                book.script,
                book.binding,
                book.publish_date,
                book.isbn,
                book.cover_image_url,
                book.created_at,
                book.views
            ]);

            if (result.insertId) {
                return new Book(result.insertId, book.title, book.summary, book.format, book.pages, book.script, book.binding, book.publish_date, book.isbn, book.cover_image_url, book.created_at, book.views);
            }
            return new Book();
        } catch (error) {
            console.error("Error creating book: ", error);
            return new Book();
        }
    }
    async getByTitle(title: string): Promise<Book> {
        try {
            const query = `SELECT * FROM books WHERE title = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [title]);
            if (rows.length > 0) {
                const row = rows[0];
                return new Book(row.id, row.title, row.summary, row.format, row.pages, row.script, row.binding, row.publlish_date, row.isbn, row.cover_image_url, row.created_at, row.views);
            }
            return new Book();
        }
        catch (error) {
            console.error("Error getting the book by title: ", error);
            return new Book();
        }
    }
    async getAll(filters?: {title?: string; author?: string; genre?: string;}): Promise<Book[]> {
        try {
            const query = `SELECT * FROM books ORDER BY id ASC`;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new Book(row.id, row.title, row.summary, row.format, row.pages, row.script, row.binding, row.publlish_date, row.isbn, row.cover_image_url, row.created_at, row.views)
            )
        }
        catch (error) {
            console.error("Error getting all books: ", error);
            return [];
        }
    }
    async update(book: Book): Promise<Book> {
        try {
            const query = `UPDATE books SET title = ?, summary = ?, format = ?, pages = ?, script = ?, script = ?, binding = ?, publish_date = ?, isbn = ?, cover_image_url = ?, created_at = ?, views = ? WHERE id = ?`

            const [result] = await db.execute<ResultSetHeader>(query, [
                book.title,
                book.summary,
                book.format,
                book.pages,
                book.script,
                book.binding,
                book.publish_date,
                book.isbn,
                book.cover_image_url,
                book.created_at,
                book.views
            ]);

            if (result.affectedRows > 0) {
                return book;
            }

            return new Book();
        }
        catch (error) {
            console.error("Error updating the book: ", error);
            return new Book();
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM books WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        }
        catch (error) {
            console.error("Error deleting a book from the database: ", error);
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*) as count FROM books WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        }
        catch (error) {
            console.error("Error finding the book by id: ", error);
            return false;
        }
    }

}