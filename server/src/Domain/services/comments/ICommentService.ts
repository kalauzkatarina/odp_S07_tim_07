import { CommentDto } from "../../DTOs/comments/CommentDto";

export interface ICommentService{
    getAllCommentsByBook(book_id: number): Promise<CommentDto[]>;
    createComment(comment: CommentDto): Promise<CommentDto>;
    deleteComment(id: number): Promise<boolean>;
}