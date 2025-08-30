import { Request, Response, Router } from "express";
import { IFavoriteBookService } from "../../Domain/services/favoriteBooks/IFavoriteBooksService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";

export class FavoriteBookController {
    private router: Router;
    private favoriteBookService: IFavoriteBookService;

    constructor(favoriteBookService: IFavoriteBookService) {
        this.router = Router();
        this.favoriteBookService = favoriteBookService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/favoriteBooks/getAllFavoriteBooks", this.getAllFavoriteBooks.bind(this));
        this.router.get("/favoriteBooks/getFavoritesByUser/:userId", authenticate, this.getFavoritesByUser.bind(this));
        this.router.post("/favoriteBooks/addFavoriteBook", authenticate, this.addFavoriteBook.bind(this));
        this.router.delete("/favoriteBooks/removeFavoriteBook", authenticate, this.removeFavoriteBook.bind(this));
    }

    private async getAllFavoriteBooks(req: Request, res: Response): Promise<void> {
        try {
            const favorite = req.query.favorite === "true";
            const favorites = await this.favoriteBookService.getAllFavoriteBooks(favorite);

            const result = favorites.map(fb => ({
                id: fb.id,
                book_id: fb.book_id,
                user_id: fb.user_id,
                book: fb.book
            }));

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
        }
    }

    private async getFavoritesByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            if (!userId) {
                res.status(400).json({ success: false, message: "Nedostaje userId." });
                return;
            }

            const favorites = await this.favoriteBookService.getFavoritesByUserId(userId);
            const result = favorites.map(fb => ({
                id: fb.id,
                book_id: fb.book_id,
                user_id: fb.user_id,
                book: fb.book
            }));

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
        }
    }

    private async addFavoriteBook(req: Request, res: Response): Promise<void> {
        try {
            const { bookId, userId } = req.body;

            if (!bookId || !userId) {
                res.status(400).json({ success: false, message: "Nedostaje bookId ili userId." });
                return;
            }

            const newFavorite = await this.favoriteBookService.addFavoriteBook(Number(bookId), Number(userId));
            res.status(201).json(newFavorite);
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
        }
    }

    private async removeFavoriteBook(req: Request, res: Response): Promise<void> {
        try {
            const { bookId, userId } = req.body;

            if (!bookId || !userId) {
                res.status(400).json({ success: false, message: "Nedostaje bookId ili userId." });
                return;
            }

            const removed = await this.favoriteBookService.removeFavoriteBook(Number(bookId), Number(userId));
            res.status(removed ? 200 : 404).json({ success: removed });
        } catch (error) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : error });
        }
    }


    public getRouter(): Router {
        return this.router;
    }
}
