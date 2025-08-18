import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Comment } from "../../Domain/models/Comment";
import { ICommentRepository } from "../../Domain/repositories/ICommentRepository";
import db from "../connection/db_connection_pool";

export class CommentRepository implements ICommentRepository {
    async create(comment: Comment): Promise<Comment> {
        try {
            const query = `INSERT INTO comments (content, created_at, user_id, book_id) VALUES (?, ?, ?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                comment.content,
                comment.created_at,
                comment.user_id,
                comment.book_id
            ]);

            if (result.insertId) {
                return new Comment(result.insertId, comment.content, comment.created_at, comment.user_id, comment.book_id);
            }

            return new Comment();
        }
        catch (error) {
            console.error('Error creating comment: ', error);
            return new Comment();
        }
    }
    async getByUserId(id: number): Promise<Comment> {
        try {
            const query = `SELECT * FROM comments WHERE user_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Comment(row.id, row.content, row.created_at, row.user_id, row.book_id);
            }

            return new Comment();
        }
        catch {
            return new Comment();
        }
    }
    async getByBookId(id: number): Promise<Comment> {
        try {
            const query = `SELECT * FROM comments WHERE book_id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            if (rows.length > 0) {
                const row = rows[0];
                return new Comment(row.id, row.content, row.created_at, row.user_id, row.book_id);
            }

            return new Comment();
        }
        catch {
            return new Comment();
        }
    }
    async getAll(): Promise<Comment[]> {
        try {
            const query = `SELECT * FROM comments ORDER BY id ASC`;

            const [rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new Comment(row.id, row.content, row.created_at, row.user_id, row.book_id)
            );
        }
        catch {
            return [];
        }
    }
    async update(comment: Comment): Promise<Comment> {
        try {
            const query = `UPDATE comments SET content = ?, created_at = ?, user_id = ?, book_id = ? WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                comment.content,
                comment.created_at,
                comment.user_id,
                comment.book_id
            ]);

            if (result.affectedRows > 0) {
                return comment;
            }

            return new Comment();
        }
        catch {
            return new Comment();
        }
    }
    async delete(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM comments WHERE id = ?`;

            const [result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        } catch {
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*) as count FROM comments WHERE id = ?`;

            const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        } catch {
            return false;
        }
    }

}