import type { CommentDto } from "../../models/comments/CommentDto";

export interface ICommentsApiService{
    getAllCommentsByBook(book_id: number): Promise<CommentDto[]>;
    createComment(content: string, book_id: number, user_id: number): Promise<CommentDto>;
    deleteComment(token: string, id: number): Promise<boolean>;
}