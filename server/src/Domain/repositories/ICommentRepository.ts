import { Comment } from "../models/Comment";

export interface ICommentRepository {
    create(comment: Comment): Promise<Comment>;
    getByUserId(id: number): Promise<Comment>;
    getByBookId(id: number): Promise<Comment[]>;
    getAll(): Promise<Comment[]>;
    update(comment: Comment): Promise<Comment>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}