import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/IUserRepository";
import db from "../connection/DbConnectionPool";

export class UserRepository implements IUserRepository {
    async create(user: User): Promise<User> {
        try {
            const query = `INSERT INTO users (username, password, email, role, created_at) VALUES (?, ?, ?, ?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                user.username,
                user.password,
                user.email,
                user.role,
                user.created_at
            ]);

            if (result.insertId) {
                return new User(result.insertId, user.username, user.password, user.email, user.role, user.created_at);
            }

            return new User();
        }
        catch (error: any) {
            console.error('Error creating user: ', error);
            return new User();
        }
    }
    async getById(id: number): Promise<User> {
        try {
            const query = `SELECT * FROM users WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new User(row.id, row.username, row.password, row.email, row.role, row.created_at);
            }

            return new User();
        }
        catch {
            return new User();
        }
    }
    async getByUsername(username: string): Promise<User> {
        try {
            const query = `SELECT * FROM users WHERE username = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [username]);

            if (rows.length > 0) {
                const row = rows[0];
                return new User(row.id, row.username, row.password, row.email, row.role, row.created_at);
            }

            return new User();
        }
        catch {
            return new User();
        }
    }

     async getUsernameById(userId: number): Promise<string> {
        try {
            const query = `SELECT username FROM users WHERE id = ?`;
            const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);
            if (rows.length > 0) return rows[0].username;
            return `User #${userId}`; // fallback
        } catch (error) {
            console.error("Error fetching username:", error);
            return `User #${userId}`;
        }
    }

    async getByEmail(email: string): Promise<User> {
        try {
            const query = `SELECT * FROM users WHERE email = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [email]);

            if (rows.length > 0) {
                const row = rows[0];
                return new User(row.id, row.username, row.password, row.email, row.role, row.created_at);
            }

            return new User();
        }
        catch {
            return new User();
        }
    }
    async getByRole(role: string): Promise<User> {
        try {
            const query = `SELECT * FROM users WHERE role = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [role]);

            if (rows.length > 0) {
                const row = rows[0];
                return new User(row.id, row.username, row.password, row.email, row.role, row.created_at);
            }

            return new User();
        }
        catch {
            return new User();
        }
    }
    async getAll(): Promise<User[]> {
        try {
            const query = `SELECT * FROM users ORDER BY id ASC`;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new User(row.id, row.username, row.password, row.email, row.role, row.created_at)
            );
        }
        catch {
            return [];
        }
    }
    async update(user: User): Promise<User> {
        try {
            const query = `UPDATE users SET username = ?, password = ?, email = ?, role = ?, created_at = ? WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                user.username,
                user.password,
                user.email,
                user.role,
                user.created_at
            ]);

            if (result.affectedRows > 0) {
                return user;
            }

            return new User();
        }
        catch {
            return new User();
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM users WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch {
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*) as count FROM users WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        } catch {
            return false;
        }
    }

}