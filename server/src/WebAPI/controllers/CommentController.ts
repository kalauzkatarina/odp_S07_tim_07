import { Request, Response, Router } from "express";
import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class CommentController{
    private router: Router;
    private commentService: ICommentService;

    constructor(commentService: ICommentService){
        this.router = Router();
        this.commentService = commentService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/books/:id/comments", this.getComments.bind(this));
        this.router.post("/books/:id/comments", authenticate, this.createComment.bind(this));
        this.router.delete("/comments/:id", authenticate, authorize("editor"), this.deleteComment.bind(this));
    }

    private async getComments(req: Request, res: Response){
        try{
            const bookId = Number(req.params.id);
            const comments = await this.commentService.getAllCommentsByBook(bookId);
            res.status(200).json(comments);
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async createComment(req: Request, res: Response){
        try{
            const bookId = Number(req.params.id);
            const userId = req.user?.id;
            
            if(!userId){
                res.status(401).json({success: false, message: "Unauthorized"});
                return;
            }
            const { content } = req.body;

            if(!content || content.trim().length === 0){
                res.status(400).json({success: false, message: "Content is required"});
                return;
            }

            const comment = await this.commentService.createComment({
                id: 0,
                content, 
                created_at: new Date(),
                user_id: userId,
                book_id: bookId
            });

            res.status(201).json(comment);
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async deleteComment(req: Request, res: Response){
        try{
            const result = await this.commentService.deleteComment(Number(req.params.id));
            res.status(result ? 200 : 404).json({success: result});
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    public getRouter(): Router{
        return this.router;
    }
}