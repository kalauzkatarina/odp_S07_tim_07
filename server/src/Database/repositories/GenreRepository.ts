import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Genre } from "../../Domain/models/Genre";
import { IGenreRepository } from "../../Domain/repositories/IGenreRepository";
import db from "../connection/db_connection_pool";

export class GenreRepository implements IGenreRepository {
    async create(genre: Genre): Promise<Genre> {
        try {
            const query = `INSERT INTO genres (name) VALUES (?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                genre.name
            ]);

            if (result.insertId) {
                return new Genre(result.insertId, genre.name);
            }

            return new Genre();
        }
        catch (error) {
            console.error('Error creating genre: ', error);
            return new Genre();
        }
    }
    async getById(id: number): Promise<Genre> {
        try {
            const query = `SELECT * FROM genres WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Genre(row.id, row.name);
            }

            return new Genre();
        }
        catch {
            return new Genre();
        }
    }
    async getByName(name: string): Promise<Genre> {
        try {
            const query = `SELECT * FROM genres WHERE name = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [name]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Genre(row.id, row.name);
            }

            return new Genre();
        }
        catch {
            return new Genre();
        }
    }
    async getAll(): Promise<Genre[]> {
        try {
            const query = `SELECT * FROM genres ORDER BY id ASC`;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new Genre(row.id, row.name)
            );
        }
        catch {
            return [];
        }
    }
    async update(genre: Genre): Promise<Genre> {
        try {
            const query = `UPDATE genres SET name = ? WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                genre.name
            ]);

            if (result.affectedRows > 0) {
                return genre;
            }

            return new Genre();
        }
        catch {
            return new Genre();
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM genres WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch {
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*) as count FROM genres WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        } catch {
            return false;
        }
    }

}