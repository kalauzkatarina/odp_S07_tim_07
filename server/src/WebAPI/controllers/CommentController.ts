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
        this.router.get("/comments/getComments/:id", this.getComments.bind(this));
        this.router.post("/comments/createComment", authenticate, this.createComment.bind(this));
        this.router.delete("/comments/deleteComment/:id", authenticate, authorize("editor"), this.deleteComment.bind(this));
    }

    private async getComments(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const comments = await this.commentService.getAllCommentsByBook(Number(id));
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

    private async createComment(req: Request, res: Response){
        try{
            const { book_id, user_id, content}  = req.body;
            
            if(!user_id){
                res.status(401).json({success: false, message: "Unauthorized"});
                return;
            }

            if(!content || content.trim().length === 0){
                res.status(400).json({success: false, message: "Content is required"});
                return;
            }

            const comment = await this.commentService.createComment( content, book_id, user_id);

            res.status(201).json(comment);
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async deleteComment(req: Request, res: Response){
        try{
            const { id } = req.params;
            const result = await this.commentService.deleteComment(Number(id));
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