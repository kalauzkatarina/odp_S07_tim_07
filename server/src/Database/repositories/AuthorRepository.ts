import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Author } from "../../Domain/models/Author";
import { IAuthorRepository } from "../../Domain/repositories/IAuthorRepository";
import db from "../connection/db_connection_pool";

export class AuthorRepository implements IAuthorRepository {
    async create(author: Author): Promise<Author> {
        try {
            const query = `INSERT INTO authors (first_name, last_name) VALUES (?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                author.first_name,
                author.last_name
            ]);

            if (result.insertId) {
                return new Author(result.insertId, author.first_name, author.last_name);
            }

            return new Author();
        }
        catch (error) {
            console.error('Error creating author: ', error);
            return new Author();
        }
    }
    async getById(id: number): Promise<Author> {
        try {
            const query = `SELECT * FROM authors WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Author(row.id, row.first_name, row.last_name);
            }

            return new Author();
        }
        catch {
            return new Author();
        }
    }
    async getByFirstName(first_name: string): Promise<Author> {
        try {
            const query = `SELECT * FROM authors WHERE first_name = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [first_name]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Author(row.id, row.first_name, row.last_name);
            }

            return new Author();
        }
        catch {
            return new Author();
        }
    }
    async getByLastName(last_name: string): Promise<Author> {
        try {
            const query = `SELECT * FROM authors WHERE last_name = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [last_name]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Author(row.id, row.first_name, row.last_name);
            }

            return new Author();
        }
        catch {
            return new Author();
        }
    }
    async getAll(): Promise<Author[]> {
        try {
            const query = `SELECT * FROM authors ORDER BY id ASC`;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new Author(row.id, row.first_name, row.last_name)
            );
        }
        catch {
            return [];
        }
    }
    async update(author: Author): Promise<Author> {
        try {
            const query = `UPDATE authors SET first_name = ?, last_name = ? WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                author.first_name,
                author.last_name
            ]);

            if (result.affectedRows > 0) {
                return author;
            }

            return new Author();
        }
        catch {
            return new Author();
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM authors WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch {
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*) as count FROM authors WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        } catch {
            return false;
        }
    }

}