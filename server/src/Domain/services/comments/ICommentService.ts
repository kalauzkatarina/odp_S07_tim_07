import { CommentDto } from "../../DTOs/comments/CommentDto";

export interface ICommentService{
    getAllCommentsByBook(book_id: number): Promise<CommentDto[]>;
    createComment(content: string, book_id: number, user_id: number): Promise<CommentDto>;
    deleteComment(id: number): Promise<boolean>;
}