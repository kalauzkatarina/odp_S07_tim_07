import { Response, Request, Router } from "express";
import { IFeaturedBookService } from "../../Domain/services/featuredBooks/IFeaturedBookService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { FeaturedBookDto } from "../../Domain/DTOs/featuredBooks/FeaturedBookDto";

export class FeaturedBookController {
    private router: Router;
    private featuredBookService: IFeaturedBookService;

    constructor(featuredBookService: IFeaturedBookService){
        this.router = Router();
        this.featuredBookService = featuredBookService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/featuredBooks/getAllFeaturedBooks", this.getAllFeaturedBooks.bind(this));
        this.router.post("/featuredBooks/addFeaturedBook", authenticate, authorize("editor"), this.addFeaturedBook.bind(this));
        this.router.delete("/featuredBooks/removeFeaturedBook/:id", authenticate, authorize("editor"), this.removeFeaturedBook.bind(this));
    }

    private async getAllFeaturedBooks(req: Request, res: Response): Promise<void> {
    try {
        const limit = 5;
        const featuredBooks = await this.featuredBookService.getAllFeaturedBooks(limit);

        const featuredBooksWithDetails = featuredBooks.map(fb => ({
            id: fb.id,
            book_id: fb.book_id,
            editor_id: fb.editor_id,
            book: fb.book
        }));

        res.status(200).json(featuredBooksWithDetails);
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}


     private async addFeaturedBook(req: Request, res: Response): Promise<void> {
    try {
        const { bookId, editorId } = req.body;
        const newFeatured = await this.featuredBookService.addFeaturedBook(
            Number(bookId),
            Number(editorId)
        );
        res.status(201).json(newFeatured);
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

    private async removeFeaturedBook(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await this.featuredBookService.removeFeaturedBook(Number(req.params.id));
            res.status(deleted ? 200 : 404).json({ success: deleted });
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}