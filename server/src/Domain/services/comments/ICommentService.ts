import { CommentDto } from "../../DTOs/comments/CommentDto";
import { Comment } from "../../models/Comment";

export interface ICommentService{
    getAllCommentsByBook(book_id: number): Promise<CommentDto[]>;
    createComment(comment: Comment): Promise<CommentDto>;
    deleteComment(id: number): Promise<boolean>;
}