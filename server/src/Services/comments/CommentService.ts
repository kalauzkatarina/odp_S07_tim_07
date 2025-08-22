import { CommentDto } from "../../Domain/DTOs/comments/CommentDto";
import { Comment } from "../../Domain/models/Comment";
import { ICommentRepository } from "../../Domain/repositories/ICommentRepository";
import { ICommentService } from "../../Domain/services/comments/ICommentService";

export class CommentService implements ICommentService{
    public constructor(private commentRepository: ICommentRepository){}

    async getAllCommentsByBook(book_id: number): Promise<CommentDto[]> {
        const comments: Comment[] = await this.commentRepository.getByBookId(book_id);
        console.log(comments);
        return comments.map(c => new CommentDto(
            c.id, c.content, c.user_id, c.book_id
        ));
    }

    async createComment(content: string, book_id: number, user_id: number): Promise<CommentDto> {
        const newComment = await this.commentRepository.create(
            new Comment(
                0, content, new Date(), user_id, book_id
            )
        );
        console.log(newComment);
        return new CommentDto(
            newComment.id, newComment.content, newComment.user_id, newComment.book_id
        );
    }

    async deleteComment(id: number): Promise<boolean> {
        return this.commentRepository.delete(id);
    }
    
}